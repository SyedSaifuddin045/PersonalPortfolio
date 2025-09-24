import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { portfolioSchema } from "@shared/schema";
import { enrichProjectsWithImages, discoverProjectImages, generateImageSrcSet } from "./imageUtils";
import path from "path";
import fs from "fs";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

// Check if SendGrid API key exists
if (!process.env.SEND_GRID_KEY) {
  console.error("SEND_GRID_KEY environment variable is not set");
}

sgMail.setApiKey(process.env.SEND_GRID_KEY as string);

function resolveAssetsBasePath() {
  const optimized = path.resolve(import.meta.dirname, "public", "project_assets");
  const source = path.resolve(import.meta.dirname, "..", "project_assets");
  if (fs.existsSync(optimized)) return optimized;
  return source;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get portfolio data with auto-discovered images
  app.get("/api/portfolio", async (req, res) => {
    try {
      const portfolio = await storage.getPortfolio();

      // Auto-discover images for all projects
      if (portfolio.projects) {
        const basePath = resolveAssetsBasePath();
        portfolio.projects = await enrichProjectsWithImages(portfolio.projects, basePath);
      }

      res.json(portfolio);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      res.status(404).json({ message: "Portfolio data not found" });
    }
  });

  // Update portfolio data
  app.put("/api/portfolio", async (req, res) => {
    try {
      const validatedData = portfolioSchema.parse(req.body);
      const updatedPortfolio = await storage.updatePortfolio(validatedData);
      res.json(updatedPortfolio);
    } catch (error) {
      res.status(400).json({ message: "Invalid portfolio data" });
    }
  });

  // Get assets for a project (enhanced with auto-discovery)
  app.get("/api/assets/:folder", async (req, res) => {
    try {
      const { folder } = req.params;
      const basePath = resolveAssetsBasePath();
      const images = await discoverProjectImages(folder, basePath);

      // Generate responsive image data
      const imageData = images.map(image => ({
        filename: image,
        srcset: generateImageSrcSet(folder, image),
        path: `/project_assets/${folder}/${image}`
      }));

      res.json({
        folder,
        images: imageData,
        count: images.length
      });
    } catch (error) {
      console.error('Error fetching assets:', error);
      res.status(404).json({ message: "Assets not found" });
    }
  });

  // IMPROVED Contact form endpoint with better error handling
  app.post("/api/contact", async (req, res) => {
    try {
      const { firstName, lastName, email, subject, message, emailTo } = req.body;

      // Input validation
      if (!firstName || !lastName || !email || !message) {
        return res.status(400).json({ 
          message: "Missing required fields: firstName, lastName, email, and message are required" 
        });
      }

      // Check if required environment variables are set
      if (!process.env.SENDER_EMAIL) {
        console.error("SENDER_EMAIL environment variable is not set");
        return res.status(500).json({ message: "Server configuration error" });
      }

      const msg = {
        to: emailTo || process.env.MY_EMAIL || process.env.SENDER_EMAIL, // fallback chain
        from: process.env.SENDER_EMAIL as string, // must be verified in SendGrid
        subject: subject || `Portfolio Contact from ${firstName} ${lastName}`,
        text: `
Contact Form Submission

Name: ${firstName} ${lastName}
Email: ${email}
Subject: ${subject || 'No subject provided'}

Message:
${message}

---
This message was sent from your portfolio contact form.
        `.trim(),
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 10px 0;"><strong>Name:</strong> ${firstName} ${lastName}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> 
                <a href="mailto:${email}" style="color: #007bff;">${email}</a>
              </p>
              <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject || 'No subject provided'}</p>
            </div>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #333;">Message:</h3>
              <div style="background: white; border: 1px solid #ddd; padding: 15px; border-radius: 4px; white-space: pre-wrap;">
${message}
              </div>
            </div>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px; text-align: center;">
              This message was sent from your portfolio contact form on ${new Date().toLocaleString()}
            </p>
          </div>
        `,
        replyTo: email // This allows you to reply directly to the sender
      };

      // Send the email
      const result = await sgMail.send(msg);
      
      // Log success (but don't log sensitive data in production)
      console.log(`Contact form email sent successfully to ${msg.to} from ${firstName} ${lastName}`);
      console.log('SendGrid response status:', result[0].statusCode);

      res.json({ 
        message: "Message sent successfully",
        success: true 
      });

    } catch (error: any) {
      console.error("SendGrid Error Details:", {
        message: error.message,
        code: error.code,
        response: error.response?.body
      });

      // Handle specific SendGrid errors
      if (error.code === 401) {
        return res.status(500).json({ 
          message: "Email service authentication failed" 
        });
      } else if (error.code === 403) {
        return res.status(500).json({ 
          message: "Email service access forbidden - check sender verification" 
        });
      } else if (error.code >= 400 && error.code < 500) {
        return res.status(400).json({ 
          message: "Invalid email request" 
        });
      }

      res.status(500).json({ 
        message: "Failed to send message. Please try again later." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}