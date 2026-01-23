import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Setup Auth FIRST
  await setupAuth(app);
  registerAuthRoutes(app);

  // === API ROUTES ===

  // Get Questions
  app.get(api.questions.list.path, async (req, res) => {
    const questions = await storage.getQuestions();
    res.json(questions);
  });

  // Submit Results
  app.post(api.submissions.create.path, async (req, res) => {
    try {
      const input = api.submissions.create.input.parse(req.body);
      const submission = await storage.createSubmission(input);
      res.status(201).json(submission);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Admin: Get Submissions
  app.get(api.submissions.list.path, isAuthenticated, async (req, res) => {
    const submissions = await storage.getSubmissions();
    res.json(submissions);
  });

  // Seed Data if empty
  await seedQuestions();

  return httpServer;
}

async function seedQuestions() {
  const existing = await storage.getQuestions();
  if (existing.length === 0) {
    const categories = ["Saver", "Spender", "Risk Taker", "Security Seeker", "Flyer", "Earner"];
    const placeholders = [
      // Wealth & Abundance
      "Money comes easily and frequently to me.",
      "There is always enough money available for what I need.",
      "I deserve to be wealthy and financially successful.",
      "Making money is a natural skill I can develop.",
      "The world has abundant opportunities for creating wealth.",
      "I am worthy of earning a high income.",
      // Saving & Investing
      "I regularly save at least 10% of my income.",
      "Investing in the stock market is a smart long-term strategy.",
      "I understand the basics of compound interest.",
      "Building an emergency fund is one of my top priorities.",
      "I feel confident making investment decisions.",
      "I review my financial situation at least monthly.",
      // Spending & Debt
      "I track my spending and know where my money goes.",
      "I can easily delay gratification for larger future rewards.",
      "Credit card debt is acceptable only in emergencies.",
      "I make purchasing decisions based on value, not price alone.",
      "I pay my credit card balance in full every month.",
      "I live below my means to create financial margin.",
      // Money Beliefs & Psychology
      "Talking about money openly is important and healthy.",
      "My childhood experiences with money still influence me today.",
      "Money cannot buy happiness, but it can reduce stress.",
      "I am in control of my financial future.",
      "Financial education is just as important as formal education.",
      "I believe I can recover from financial setbacks.",
      // Additional WealthIQ Specific prompts
      "I feel most confident when my bank account is full.",
      "I believe wealth is a reflection of hard work.",
      "I've already planned my retirement in detail.",
      "I find financial news and market trends fascinating.",
      "I prioritize financial independence above all else.",
      "I enjoy the thrill of a high-stakes gamble.",
      // Completing the 36
      "Retail therapy is my go-to stress reliever.",
      "I save every penny I can.",
      "I enjoy trading stocks and crypto.",
      "I prefer stable, low-risk investments.",
      "Money is just a tool to enjoy life today.",
      "I am constantly looking for new income streams."
    ];

    // Seed exactly 36 questions
    for (let i = 0; i < 36; i++) {
      await storage.createQuestion({
        text: placeholders[i],
        category: categories[i % categories.length],
      });
    }
    console.log("Seeded 36 questions");
  }
}
