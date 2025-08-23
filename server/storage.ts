import { type Portfolio } from "@shared/schema";
import fs from "fs/promises";
import path from "path";

export interface IStorage {
  getPortfolio(): Promise<Portfolio>;
  updatePortfolio(portfolio: Portfolio): Promise<Portfolio>;
}

export class MemStorage implements IStorage {
  private portfolio: Portfolio | null = null;

  async getPortfolio(): Promise<Portfolio> {
    if (!this.portfolio) {
      try {
        const filePath = path.resolve(process.cwd(), "portfolio-data.json");
        const data = await fs.readFile(filePath, "utf-8");
        this.portfolio = JSON.parse(data);
      } catch (error) {
        console.error("Error loading portfolio data:", error);
        throw new Error("Portfolio data not found");
      }
    }
    return this.portfolio!;
  }

  async updatePortfolio(portfolio: Portfolio): Promise<Portfolio> {
    this.portfolio = portfolio;
    try {
      const filePath = path.resolve(process.cwd(), "portfolio-data.json");
      await fs.writeFile(filePath, JSON.stringify(portfolio, null, 2));
    } catch (error) {
      console.error("Error saving portfolio data:", error);
      throw new Error("Failed to save portfolio data");
    }
    return portfolio;
  }
}

export const storage = new MemStorage();
