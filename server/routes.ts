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
    // Original 36 WealthIQ questions in exact original order
    const originalQuestions = [
      { text: "I am okay with taking on debt to fund new experiences or travel.", category: "Risk Taker" },
      { text: "I do not enjoy creating budgets, preferring to handle money more flexibly.", category: "Flyer" },
      { text: "I make saving a top priority, setting aside funds for future security before indulging in discretionary spending.", category: "Saver" },
      { text: "I research thoroughly before making big money decisions (e.g., purchasing a home, car).", category: "Security Seeker" },
      { text: "I consider potential financial setbacks well in advance to be prepared.", category: "Security Seeker" },
      { text: "I enjoy giving gifts or donating money, even if it means a tighter budget for myself.", category: "Earner" },
      { text: "I find myself engaging in new side hustles and income streams for the thrill of it.", category: "Risk Taker" },
      { text: "I make deliberate financial choices to build and reinforce the image I want to project to others.", category: "Spender" },
      { text: "I rarely worry about money details, trusting everything will balance out in the end.", category: "Flyer" },
      { text: "I believe money is just a tool; I don't obsess over it.", category: "Flyer" },
      { text: "I find myself drawn to purchases or experiences that others view positively or recommend.", category: "Spender" },
      { text: "I view unexpected costs as a normal part of life and see them as opportunities to learn, rather than a source of stress.", category: "Flyer" },
      { text: "I do not believe in mapping out financial scenarios or stress over setbacks - I trust I will adapt as needed.", category: "Flyer" },
      { text: "I make spontaneous spending or investment decisions when an opportunity seems worthwhile, without overanalyzing it.", category: "Risk Taker" },
      { text: "I am aware of and control how much I spend and save each month.", category: "Saver" },
      { text: "Receiving compliments on things I own or experiences I have had feels rewarding.", category: "Spender" },
      { text: "I love mapping out clear, measurable financial goals (e.g., saving for retirement).", category: "Saver" },
      { text: "I often make spontaneous purchases without guilt.", category: "Risk Taker" },
      { text: "Carrying debt makes me uncomfortable, even if it is considered good debt.", category: "Security Seeker" },
      { text: "The lifestyle and choices of my social circle influences what I too value in my life.", category: "Spender" },
      { text: "I measure my success by how many people I can help financially.", category: "Earner" },
      { text: "I believe charitable giving is more important than personal splurges.", category: "Earner" },
      { text: "I actively pursue high-potential, higher-risk financial moves.", category: "Risk Taker" },
      { text: "I track my net worth regularly to stay on course.", category: "Saver" },
      { text: "I prefer stable income and low risk investments over chasing speculative opportunities.", category: "Security Seeker" },
      { text: "I reflect on past money mistakes and adjust my plan to avoid repeating them.", category: "Saver" },
      { text: "I often look to the choices of people I admire as a guide for my own purchases.", category: "Spender" },
      { text: "I compare multiple options (mortgages, credit cards, investments) to find the best deal.", category: "Saver" },
      { text: "I am more motivated by potential gains than worried about potential losses.", category: "Risk Taker" },
      { text: "I feel secure when I maintain an ample cash reserve in my bank for unexpected emergencies.", category: "Security Seeker" },
      { text: "I feel limited by tight financial plans or rules.", category: "Flyer" },
      { text: "I experience greater distress when my investments lose money than the satisfaction I derive from equivalent gains.", category: "Security Seeker" },
      { text: "At times, I spend more to ensure my lifestyle stays comparable to those I spend time with.", category: "Spender" },
      { text: "I often offer to cover expenses or help friends or family in need.", category: "Earner" },
      { text: "I rarely hesitate to lend money to people I trust.", category: "Earner" },
      { text: "I feel more satisfaction when my money benefits others than when it only benefits me.", category: "Earner" },
    ];

    // Seed all 36 questions
    for (const q of originalQuestions) {
      await storage.createQuestion(q);
    }
    console.log("Seeded 36 original WealthIQ questions");
  }
}
