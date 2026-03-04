import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { isAuthenticated } from "./auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // === API ROUTES ===

  // Get Questions
  app.get(api.questions.list.path, async (_req, res) => {
    const questions = await storage.getQuestions();
    res.json(questions);
  });

  // Submit Results — saves to DB and triggers email
  app.post(api.submissions.create.path, async (req, res) => {
    try {
      const input = api.submissions.create.input.parse(req.body);
      const submission = await storage.createSubmission(input);

      // Fire-and-forget: send results email (don't block the response)
      sendResultsEmail(
        input.email,
        input.name ?? "there",
        input.results as Record<string, number>,
      ).then(() => console.log(`Results email sent to ${input.email}`))
       .catch((err) => console.error("Email send error:", err?.message ?? err));

      res.status(201).json(submission);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      throw err;
    }
  });

  // Admin: Get Submissions (protected by API key via x-admin-key header)
  app.get(api.submissions.list.path, isAuthenticated, async (_req, res) => {
    const submissions = await storage.getSubmissions();
    res.json(submissions);
  });

  // General-purpose Send Email endpoint (used by Results page "Share" feature)
  app.post("/api/send-email", async (req, res) => {
    try {
      const { toEmails, subject, textBody, htmlBody } = req.body as {
        toEmails: string[];
        subject: string;
        textBody: string;
        htmlBody: string;
      };
      await sendEmail(toEmails, subject, textBody, htmlBody);
      res.json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Error sending email" });
    }
  });

  // Seed questions on first start
  await seedQuestions();

  return httpServer;
}

// ============================================================
// Email helpers
// ============================================================

async function getGraphAccessToken(): Promise<string> {
  const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.CLIENT_ID!,
    client_secret: process.env.CLIENT_SECRET!,
    scope: "https://graph.microsoft.com/.default",
  });
  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  const data = await response.json() as { access_token: string };
  return data.access_token;
}

async function sendEmail(
  toEmails: string[],
  subject: string,
  _textBody: string,
  htmlBody: string,
) {
  if (!process.env.OUTLOOK_USER || !process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.TENANT_ID) {
    console.warn("Email credentials not configured (OUTLOOK_USER / CLIENT_ID / CLIENT_SECRET / TENANT_ID) — skipping send.");
    return;
  }
  const accessToken = await getGraphAccessToken();
  const response = await fetch(
    `https://graph.microsoft.com/v1.0/users/${process.env.OUTLOOK_USER}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject,
          body: { contentType: "HTML", content: htmlBody },
          toRecipients: toEmails.map((addr) => ({ emailAddress: { address: addr } })),
        },
      }),
    }
  );
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Graph API sendMail failed (${response.status}): ${err}`);
  }
}

const ARCHETYPE_META: Record<string, { color: string; motivation: string }> = {
  Guardians:   { color: "#d4edda", motivation: "Minimizing uncertainty and ensuring financial safety." },
  Givers:      { color: "#f8d7da", motivation: "Fostering community well-being through financial generosity." },
  Adventurers: { color: "#d1ecf1", motivation: "Seeking excitement, novelty, and personal freedom in money matters." },
  Impressors:  { color: "#fde8e8", motivation: "Enhancing self-worth or social standing through financial displays." },
  Strategists: { color: "#fff3cd", motivation: "Achieving long-term success through structure and informed decisions." },
  "Free Spirits": { color: "#f8f9fa", motivation: "Enjoying life's flow and reducing anxiety about money details." },
};

function getStrength(score: number): string {
  if (score === 0) return "–";
  if (score <= 2) return "USING";
  if (score <= 4) return "DOMINANT";
  return "STRONG DOMINANT";
}

async function sendResultsEmail(
  userEmail: string,
  userName: string,
  results: Record<string, number>,
) {
  const sorted = Object.entries(results).sort((a, b) => b[1] - a[1]);
  const dominant = sorted.filter(([, s]) => s > 0);
  const quickGlance = dominant.map(([cat, s]) => `${cat} (${s})`).join(", ");

  const textBody = [
    `Hi ${userName},`,
    "",
    `Thanks for completing the Money Mindset Game. Quick glance: ${quickGlance}`,
    "",
    "MONEY MINDSET | # OF 'ME' CARDS | STRENGTH",
    ...sorted.map(([cat, score]) => `${cat}: ${score} cards — ${getStrength(score)}`),
    "",
    `Tip: "USING" = light influence, "DOMINANT" = strong theme, "STRONG DOMINANT" = very strong theme.`,
    "",
    "— Wealth IQ",
  ].join("\n");

  const tableRows = sorted.map(([cat, score]) => {
    const meta = ARCHETYPE_META[cat] ?? { color: "#ffffff", motivation: "" };
    const strength = getStrength(score);
    return `
      <tr style="background-color: ${meta.color};">
        <td style="padding: 10px 14px; font-weight: 600; border-bottom: 1px solid #e0e0e0;">${cat}</td>
        <td style="padding: 10px 14px; text-align: center; border-bottom: 1px solid #e0e0e0;">${score}</td>
        <td style="padding: 10px 14px; font-weight: 600; border-bottom: 1px solid #e0e0e0;">${strength}</td>
        <td style="padding: 10px 14px; color: #444; border-bottom: 1px solid #e0e0e0;">${meta.motivation}</td>
      </tr>`;
  }).join("");

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #1a1a1a;">
      <p>Hi ${userName},</p>
      <p>Thanks for completing the Money Mindset Game. Quick glance: <strong>${quickGlance}</strong></p>

      <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
        <thead>
          <tr style="background-color: #f3d6e4;">
            <th style="padding: 10px 14px; text-align: left; border-bottom: 2px solid #ccc;">Money Mindset</th>
            <th style="padding: 10px 14px; text-align: center; border-bottom: 2px solid #ccc;"># of "Me" Cards</th>
            <th style="padding: 10px 14px; text-align: left; border-bottom: 2px solid #ccc;">Strength</th>
            <th style="padding: 10px 14px; text-align: left; border-bottom: 2px solid #ccc;">Core Motivation</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>

      <p style="font-size: 13px; color: #555;">
        Tip: "USING" = light influence, "DOMINANT" = strong theme, "STRONG DOMINANT" = very strong theme.
      </p>
      <p>— Wealth IQ</p>
    </div>
  `;

  await sendEmail(
    ["hello@wealthiqco.com", userEmail],
    "Your Money Mindset Results",
    textBody,
    htmlBody,
  );
}

// ============================================================
// Database seeding
// ============================================================

async function seedQuestions() {
  const existing = await storage.getQuestions();
  if (existing.length === 0) {
    const originalQuestions = [
      { text: "I am okay with taking on debt to fund new experiences or travel.", category: "Adventurers" },
      { text: "I do not enjoy creating budgets, preferring to handle money more flexibly.", category: "Free Spirits" },
      { text: "I make saving a top priority, setting aside funds for future security before indulging in discretionary spending.", category: "Strategists" },
      { text: "I research thoroughly before making big money decisions (e.g., purchasing a home, car).", category: "Guardians" },
      { text: "I consider potential financial setbacks well in advance to be prepared.", category: "Guardians" },
      { text: "I enjoy giving gifts or donating money, even if it means a tighter budget for myself.", category: "Givers" },
      { text: "I find myself engaging in new side hustles and income streams for the thrill of it.", category: "Adventurers" },
      { text: "I make deliberate financial choices to build and reinforce the image I want to project to others.", category: "Impressors" },
      { text: "I rarely worry about money details, trusting everything will balance out in the end.", category: "Free Spirits" },
      { text: "I believe money is just a tool; I don't obsess over it.", category: "Free Spirits" },
      { text: "I find myself drawn to purchases or experiences that others view positively or recommend.", category: "Impressors" },
      { text: "I view unexpected costs as a normal part of life and see them as opportunities to learn, rather than a source of stress.", category: "Free Spirits" },
      { text: "I do not believe in mapping out financial scenarios or stress over setbacks - I trust I will adapt as needed.", category: "Free Spirits" },
      { text: "I make spontaneous spending or investment decisions when an opportunity seems worthwhile, without overanalyzing it.", category: "Adventurers" },
      { text: "I am aware of and control how much I spend and save each month.", category: "Strategists" },
      { text: "Receiving compliments on things I own or experiences I have had feels rewarding.", category: "Impressors" },
      { text: "I love mapping out clear, measurable financial goals (e.g., saving for retirement).", category: "Strategists" },
      { text: "I often make spontaneous purchases without guilt.", category: "Adventurers" },
      { text: "Carrying debt makes me uncomfortable, even if it is considered good debt.", category: "Guardians" },
      { text: "The lifestyle and choices of my social circle influences what I too value in my life.", category: "Impressors" },
      { text: "I measure my success by how many people I can help financially.", category: "Givers" },
      { text: "I believe charitable giving is more important than personal splurges.", category: "Givers" },
      { text: "I actively pursue high-potential, higher-risk financial moves.", category: "Adventurers" },
      { text: "I track my net worth regularly to stay on course.", category: "Strategists" },
      { text: "I prefer stable income and low risk investments over chasing speculative opportunities.", category: "Guardians" },
      { text: "I reflect on past money mistakes and adjust my plan to avoid repeating them.", category: "Strategists" },
      { text: "I often look to the choices of people I admire as a guide for my own purchases.", category: "Impressors" },
      { text: "I compare multiple options (mortgages, credit cards, investments) to find the best deal.", category: "Strategists" },
      { text: "I am more motivated by potential gains than worried about potential losses.", category: "Adventurers" },
      { text: "I feel secure when I maintain an ample cash reserve in my bank for unexpected emergencies.", category: "Guardians" },
      { text: "I feel limited by tight financial plans or rules.", category: "Free Spirits" },
      { text: "I experience greater distress when my investments lose money than the satisfaction I derive from equivalent gains.", category: "Guardians" },
      { text: "At times, I spend more to ensure my lifestyle stays comparable to those I spend time with.", category: "Impressors" },
      { text: "I often offer to cover expenses or help friends or family in need.", category: "Givers" },
      { text: "I rarely hesitate to lend money to people I trust.", category: "Givers" },
      { text: "I feel more satisfaction when my money benefits others than when it only benefits me.", category: "Givers" },
    ];

    for (const q of originalQuestions) {
      await storage.createQuestion(q);
    }
    console.log("Seeded 36 WealthIQ questions");
  }
}
