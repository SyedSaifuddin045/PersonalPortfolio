import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const projectAssetsPath = path.resolve(import.meta.dirname, "..", "project_assets");
  const personalAssetsPath = path.resolve(import.meta.dirname, "..", "personal_assets");
  
  log(`Project assets path: ${projectAssetsPath}`);
  log(`Directory exists: ${fs.existsSync(projectAssetsPath)}`);
  if (fs.existsSync(projectAssetsPath)) {
    log(`Contents: ${fs.readdirSync(projectAssetsPath).join(", ")}`);
  }
  
  // Serve static assets BEFORE vite middleware
  app.use("/project_assets", express.static(projectAssetsPath));
  app.use("/personal_assets", express.static(personalAssetsPath));
  
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");
  const optimizedAssetsPath = path.resolve(import.meta.dirname, "public", "project_assets");
  const projectAssetsPath = path.resolve(import.meta.dirname, "..", "project_assets");
  const personalAssetsPath = path.resolve(import.meta.dirname, "..", "personal_assets");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  log(`Project assets path: ${projectAssetsPath}`);
  log(`Directory exists: ${fs.existsSync(projectAssetsPath)}`);
  if (fs.existsSync(projectAssetsPath)) {
    log(`Contents: ${fs.readdirSync(projectAssetsPath).join(", ")}`);
  }

  app.use(express.static(distPath));
  // Serve optimized assets if they exist, otherwise fall back to source assets
  if (fs.existsSync(optimizedAssetsPath)) {
    log(`Serving optimized assets from: ${optimizedAssetsPath}`);
    app.use("/project_assets", express.static(optimizedAssetsPath));
  } else {
    log(`Serving source assets from: ${projectAssetsPath}`);
    app.use("/project_assets", express.static(projectAssetsPath));
  }
  app.use("/personal_assets", express.static(personalAssetsPath));
  
  // Add logging middleware for project_assets requests
  app.use("/project_assets", (req, res, next) => {
    log(`Accessing: ${req.url}`);
    next();
  });

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
