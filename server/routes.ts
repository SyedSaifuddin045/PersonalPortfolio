import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { portfolioSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get portfolio data
  app.get("/api/portfolio", async (req, res) => {
    try {
      const portfolio = await storage.getPortfolio();
      res.json(portfolio);
    } catch (error) {
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

  // Submit contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const { firstName, lastName, email, subject, message } = req.body;
      
      // In a real application, you would send an email or save to database
      console.log("Contact form submission:", {
        firstName,
        lastName,
        email,
        subject,
        message,
      });
      
      res.json({ message: "Message sent successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
