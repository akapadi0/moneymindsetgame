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
      "I feel guilty when I spend money on myself.",
      "I often buy things I don't need just because they are on sale.",
      "I am comfortable taking big financial risks for big returns.",
      "I need a large emergency fund to feel safe.",
      "I don't really pay attention to my bank balance.",
      "Making more money is the solution to all my problems.",
      "I save every penny I can.",
      "Retail therapy is my go-to stress reliever.",
      "I enjoy trading stocks and crypto.",
      "I prefer stable, low-risk investments.",
      "Money is just a tool to enjoy life today.",
      "I am constantly looking for new income streams.",
      "I track every single expense in a spreadsheet.",
      "Buying luxury items makes me feel successful.",
      "I'd rather invest in a startup than a savings account.",
      "I worry about my financial future daily.",
      "Budgeting feels like a restriction on my freedom.",
      "I believe wealth is a reflection of hard work.",
      "I check my investment portfolio multiple times a day.",
      "I rarely look at the price tag before buying something.",
      "I've already planned my retirement in detail.",
      "I enjoy the thrill of a high-stakes gamble.",
      "Having a high credit limit makes me feel powerful.",
      "I prioritize financial independence above all else.",
      "I often treat friends and family to expensive dinners.",
      "I am hesitant to spend money even on necessities.",
      "I view money as a way to gain social status.",
      "I find financial news and market trends fascinating.",
      "I live by the motto 'You can't take it with you'.",
      "I feel most confident when my bank account is full."
    ];

    // Seed exactly 30 questions
    for (let i = 0; i < 30; i++) {
      await storage.createQuestion({
        text: placeholders[i],
        category: categories[i % categories.length],
      });
    }
    console.log("Seeded 30 questions");
  }
}
