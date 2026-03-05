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

      // Send results email before responding (Vercel kills the function after response)
      try {
        await sendResultsEmail(
          input.email,
          input.name ?? "there",
          input.results as Record<string, number>,
        );
        console.log(`Results email sent to ${input.email}`);
      } catch (err: any) {
        console.error("Email send error:", err?.message ?? err);
      }

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

// ============================================================
// Archetype data for email rendering
// ============================================================

const BASE_URL = "https://moneymindsetgame.vercel.app";

interface ArchetypeEmailData {
  motivation: string;
  superpowers: string;
  biases: string;
  barColor: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  imageUrl: string;
  recommendations: string[];
  challenges: string[];
}

const ARCHETYPE_EMAIL_DATA: Record<string, ArchetypeEmailData> = {
  "Strategists": {
    motivation: "Long-term success through structure and intelligent planning",
    superpowers: "Systems thinker, excellent capital allocator, high discipline and patience",
    biases: "Analysis paralysis, over-optimization of small variables, difficulty acting without full information",
    barColor: "#059669", bgColor: "#ecfdf5", borderColor: "#a7f3d0", textColor: "#047857",
    imageUrl: `${BASE_URL}/images/archetype-strategist.png`,
    recommendations: [
      "Use decision frameworks instead of perfect data (e.g., 70% rule: act when 70% confident)",
      "Separate strategic decisions from tactical tweaks — not everything deserves deep analysis",
      "Build a personal 'risk budget' for opportunities that don't fully fit the spreadsheet",
    ],
    challenges: [
      "Make one $5K+ decision this month with incomplete information",
      "Schedule a 'no optimization day' where you intentionally do not research anything financial",
      "Delegate one financial task you normally insist on controlling",
    ],
  },
  "Givers": {
    motivation: "Community impact and supporting the people around them",
    superpowers: "Deep empathy and loyalty, community builder, purpose-driven wealth",
    biases: "Blurred financial boundaries, guilt around prioritizing personal wealth, becoming the default financial safety net",
    barColor: "#e11d48", bgColor: "#fff1f2", borderColor: "#fecdd3", textColor: "#be123c",
    imageUrl: `${BASE_URL}/images/archetype-giver.png`,
    recommendations: [
      "Separate charity, family support, and investment — they are different tools",
      "Build a structured giving strategy (DAF, annual allocation, or legacy planning)",
      "Remember: sustainable generosity requires sustainable wealth",
    ],
    challenges: [
      "Decline one request this month without over-explaining",
      "Design a 10-year giving vision, not just reactive generosity",
      "Identify one area where your support may be preventing someone else's growth",
    ],
  },
  "Adventurers": {
    motivation: "Freedom, exploration, and bold opportunities",
    superpowers: "High tolerance for uncertainty, opportunity spotting, energized by new ventures",
    biases: "Overconfidence in intuition, concentrated bets, underestimating downside risk",
    barColor: "#d97706", bgColor: "#fffbeb", borderColor: "#fde68a", textColor: "#b45309",
    imageUrl: `${BASE_URL}/images/archetype-adventurer.png`,
    recommendations: [
      "Use position sizing — even the best ideas shouldn't dominate your portfolio",
      "Balance adventure capital with compounding capital",
      "Create a system where curiosity is funded but not reckless",
    ],
    challenges: [
      "Write down the downside of your next big idea before acting",
      "Build a 'risk sandbox' portfolio where experimentation is encouraged but capped",
      "Say no to one exciting opportunity this quarter",
    ],
  },
  "Guardians": {
    motivation: "Security, stability, and protecting what has been built",
    superpowers: "Excellent downside protection, strong contingency planning, long-term resilience",
    biases: "Opportunity avoidance, excessive cash or low-risk allocations, overestimating worst-case scenarios",
    barColor: "#0d9488", bgColor: "#f0fdfa", borderColor: "#99f6e4", textColor: "#0f766e",
    imageUrl: `${BASE_URL}/images/archetype-guardian.png`,
    recommendations: [
      "Separate true safety needs from emotional comfort",
      "Build a two-bucket mindset: protection capital vs growth capital",
      "Remember that inflation and stagnation are also risks",
    ],
    challenges: [
      "Increase one allocation toward long-term growth",
      "Review the opportunity cost of safety over the last decade",
      "Identify one financial risk that is actually manageable rather than dangerous",
    ],
  },
  "Impressors": {
    motivation: "Recognition, status, and signaling success",
    superpowers: "Excellent personal branding, ability to influence and inspire, understands perception and value",
    biases: "Lifestyle creep, comparison with elite peer groups, spending driven by external validation",
    barColor: "#7c3aed", bgColor: "#f5f3ff", borderColor: "#ddd6fe", textColor: "#6d28d9",
    imageUrl: `${BASE_URL}/images/archetype-impressor.png`,
    recommendations: [
      "Align spending with identity rather than audience",
      "Invest in assets that appreciate quietly while status depreciates loudly",
      "Build confidence in private wealth, not public display",
    ],
    challenges: [
      "Make one high-value purchase that no one will ever see",
      "Identify three ways your wealth can compound quietly",
      "Spend one month not upgrading anything",
    ],
  },
  "Free Spirits": {
    motivation: "Living authentically and avoiding financial rigidity",
    superpowers: "Intuitive decision-making, values-driven life design, low attachment to status or comparison",
    biases: "Avoidance of financial structure, anxiety around money conversations, delegating too much without oversight",
    barColor: "#0284c7", bgColor: "#f0f9ff", borderColor: "#bae6fd", textColor: "#0369a1",
    imageUrl: `${BASE_URL}/images/archetype-freespirit.png`,
    recommendations: [
      "Use minimalist financial systems (few accounts, automated flows)",
      "Work with advisors or partners who translate complexity into simplicity",
      "Think of structure as guardrails that preserve freedom",
    ],
    challenges: [
      "Define three financial values that guide your decisions",
      "Spend 15 minutes reviewing your net worth without judgment",
      "Create one simple financial rule that protects your freedom",
    ],
  },
};

const COMPATIBILITY_INSIGHTS: Record<string, string> = {
  "Guardians + Strategists": "As a Strategist-Guardian, you combine meticulous planning with a security-first mindset. You're exceptional at building long-term wealth through careful, well-researched decisions. Your superpower is creating bulletproof financial plans — but watch out for being so cautious that you miss timely opportunities. Challenge yourself to act on your research faster.",
  "Givers + Strategists": "As a Strategist-Giver, you blend analytical thinking with a deep desire to help others. You're the person who creates smart systems for giving — budgeted generosity with maximum impact. Your challenge is balancing your natural impulse to help with the data-driven part of you that knows you need to secure your own future first.",
  "Adventurers + Strategists": "As a Strategist-Adventurer, you have a rare combination: the ability to plan ahead AND take bold risks when the moment is right. You're the calculated risk-taker — someone who does their homework before making exciting moves. Your edge is knowing when to follow the plan and when to trust your instinct for opportunity.",
  "Impressors + Strategists": "As a Strategist-Impressor, you combine analytical precision with an eye for quality and presentation. You don't just build wealth — you build it with style. Your strength is making strategic decisions that also reflect your values and image. Just make sure your desire for the best doesn't override your excellent planning instincts.",
  "Free Spirits + Strategists": "As a Strategist-Free Spirit, you hold two powerful but opposing forces: a love of structure and a need for freedom. When balanced, this makes you incredibly adaptable — you can create plans that leave room for spontaneity. The key is building systems that run on autopilot so your free-spirited side can thrive without financial stress.",
  "Givers + Guardians": "As a Guardian-Giver, you're driven by protecting both your own security and the well-being of those you care about. You're the person who builds a strong financial foundation AND extends that safety net to others. Your challenge is knowing where your responsibility ends — you can't protect everyone without risking your own stability.",
  "Adventurers + Guardians": "As a Guardian-Adventurer, you live with an interesting inner tension: one part of you craves safety, while another yearns for excitement. This actually makes you a balanced decision-maker — you know how to take risks without betting the farm. Your sweet spot is creating a rock-solid safety net that frees you to take calculated adventures.",
  "Guardians + Impressors": "As a Guardian-Impressor, you value both security and quality. You want the finer things in life, but not at the expense of your financial safety. This makes you a smart spender — you save diligently but also invest in things that truly matter to you. Watch for the tension between wanting to display success and wanting to keep your reserves strong.",
  "Free Spirits + Guardians": "As a Guardian-Free Spirit, you balance a need for security with a desire to live freely. You might resist traditional financial structures, but deep down you want the peace of mind that comes from stability. Your path forward is creating simple, low-maintenance financial systems that protect you without making you feel trapped.",
  "Adventurers + Givers": "As a Giver-Adventurer, you're generous, spontaneous, and driven by experiences. You're the person who buys the group dinner on a whim or donates to a cause that moves you in the moment. Your heart is in the right place, but your wallet needs guardrails. Channel your adventurous energy into creative ways to give that don't drain your resources.",
  "Givers + Impressors": "As a Giver-Impressor, you're motivated by both generosity and recognition. You want to make a difference AND be seen doing it. This isn't a bad thing — it can drive you to make big, visible contributions. Just ensure your giving comes from genuine values rather than social pressure, and protect your own financial health along the way.",
  "Free Spirits + Givers": "As a Giver-Free Spirit, you're led by your heart and intuition. You give freely and live in the moment, which makes you wonderfully generous and adaptable. The flip side is that neither side of your personality loves budgets or structure. Finding one simple financial habit — like automatic savings — will give you the freedom to keep being generous sustainably.",
  "Adventurers + Impressors": "As an Adventurer-Impressor, you love exciting experiences and looking good while having them. You're drawn to the bold, the new, and the impressive. This combination makes you magnetic and ambitious, but it can also lead to spending that prioritizes appearances and thrills over long-term goals. Your challenge is channeling that energy into adventures that build real wealth.",
  "Adventurers + Free Spirits": "As an Adventurer-Free Spirit, you're the ultimate spontaneous soul. You follow your instincts, embrace new experiences, and resist anything that feels restrictive. Your relationship with money is likely intuitive rather than structured. The good news: you're adaptable and resilient. The growth area: building just enough structure to support your freedom long-term.",
  "Free Spirits + Impressors": "As an Impressor-Free Spirit, you value both self-expression and flow. You want to look and feel successful, but you don't want rigid systems to get there. This combination thrives when you find financial approaches that feel natural and aligned with your identity — not forced or formulaic. Automate the basics so you can focus on what inspires you.",
};

function archetypeCardHtml(label: string, name: string, pct: number, d: ArchetypeEmailData): string {
  return `
    <table cellpadding="0" cellspacing="0" width="100%" style="border-radius:10px;overflow:hidden;border:1.5px solid ${d.borderColor};background-color:${d.bgColor};">
      <tbody>
        <tr>
          <td style="padding:16px 16px 12px;text-align:center;">
            <span style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${d.textColor};">${label}</span>
            <img src="${d.imageUrl}" alt="${name}" width="80" height="80" style="display:block;margin:10px auto;object-fit:contain;" />
            <div style="font-size:20px;font-weight:700;color:rgba(0,0,0,0.9);margin:6px 0 4px;">${name}</div>
            <span style="font-size:18px;font-weight:700;color:${d.barColor};">${pct}%</span>
          </td>
        </tr>
        <tr>
          <td style="padding:0 16px 16px;font-size:13px;color:rgba(0,0,0,0.7);line-height:1.5;">
            <p style="margin:0 0 10px;"><span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:rgba(0,0,0,0.4);">Motivation</span><br/>${d.motivation}</p>
            <p style="margin:0 0 10px;"><span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:rgba(0,0,0,0.4);">Superpowers</span><br/>${d.superpowers}</p>
            <p style="margin:0;"><span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:rgba(0,0,0,0.4);">Watch Out</span><br/>${d.biases}</p>
          </td>
        </tr>
      </tbody>
    </table>`;
}

async function sendResultsEmail(
  userEmail: string,
  userName: string,
  results: Record<string, number>,
) {
  const MAX_SCORE = 6;
  const sorted = Object.entries(results)
    .map(([name, score]) => ({ name, score, pct: Math.round(score / MAX_SCORE * 100) }))
    .sort((a, b) => b.score - a.score);

  const [primary, secondary, ...others] = sorted;
  const primaryData = ARCHETYPE_EMAIL_DATA[primary?.name] ?? ARCHETYPE_EMAIL_DATA["Strategists"];
  const secondaryData = ARCHETYPE_EMAIL_DATA[secondary?.name] ?? ARCHETYPE_EMAIL_DATA["Guardians"];

  const comboKey = [primary?.name, secondary?.name].sort().join(" + ");
  const compatibilityInsight = COMPATIBILITY_INSIGHTS[comboKey]
    ?? `As a ${primary?.name}-${secondary?.name}, you bring together ${primaryData.motivation.toLowerCase()} with ${secondaryData.motivation.toLowerCase()}. This unique blend shapes how you think about, earn, and grow your wealth.`;

  const recommendations = [...primaryData.recommendations, secondaryData.recommendations[0], secondaryData.recommendations[1]].slice(0, 5);
  const challenges = [...primaryData.challenges, secondaryData.challenges[0], secondaryData.challenges[1]].slice(0, 5);

  const otherTraitBars = others.map(({ name, pct }) => {
    const d = ARCHETYPE_EMAIL_DATA[name];
    if (!d) return "";
    return `
      <tr>
        <td style="padding:5px 20px;">
          <table cellpadding="0" cellspacing="0" width="100%"><tbody><tr>
            <td style="width:28px;padding-right:6px;"><img src="${d.imageUrl}" alt="${name}" width="24" height="24" style="display:block;object-fit:contain;" /></td>
            <td style="width:105px;font-size:13px;font-weight:600;color:rgba(0,0,0,0.9);padding-right:10px;white-space:nowrap;">${name}</td>
            <td>
              <table cellpadding="0" cellspacing="0" width="100%" style="background-color:#e5e7eb;border-radius:10px;height:14px;"><tbody><tr>
                <td width="${pct}%" style="background-color:${d.barColor};height:14px;border-radius:10px;"></td>
                <td></td>
              </tr></tbody></table>
            </td>
            <td style="width:44px;font-size:13px;font-weight:700;color:${d.barColor};text-align:right;padding-left:10px;">${pct}%</td>
          </tr></tbody></table>
        </td>
      </tr>`;
  }).join("");

  const recItems = recommendations.map(r => `
    <tr>
      <td style="padding:5px 16px;font-size:13px;color:rgba(0,0,0,0.7);line-height:1.5;">
        <table cellpadding="0" cellspacing="0"><tbody><tr>
          <td style="vertical-align:top;padding-right:8px;color:#16a34a;font-weight:700;font-size:16px;">+</td>
          <td>${r}</td>
        </tr></tbody></table>
      </td>
    </tr>`).join("");

  const challengeItems = challenges.map(c => `
    <tr>
      <td style="padding:5px 16px;font-size:13px;color:rgba(0,0,0,0.7);line-height:1.5;">
        <table cellpadding="0" cellspacing="0"><tbody><tr>
          <td style="vertical-align:top;padding-right:8px;color:#d97706;font-weight:700;font-size:14px;">&#9733;</td>
          <td>${c}</td>
        </tr></tbody></table>
      </td>
    </tr>`).join("");

  const textBody = [
    `Hi ${userName},`,
    "",
    "Your Financial Blueprint is ready! Here's your personalized Wealth IQ Money Mindset profile.",
    "",
    "YOUR TOP ARCHETYPES",
    `Primary:   ${primary?.name} (${primary?.pct}%)`,
    `Secondary: ${secondary?.name} (${secondary?.pct}%)`,
    "",
    "WHAT DOES THIS MEAN?",
    compatibilityInsight,
    "",
    "YOUR OTHER TRAITS",
    ...others.map(({ name, pct }) => `${name}: ${pct}%`),
    "",
    "RECOMMENDATIONS",
    ...recommendations.map((r, i) => `${i + 1}. ${r}`),
    "",
    "GROWTH CHALLENGES",
    ...challenges.map((c, i) => `${i + 1}. ${c}`),
    "",
    "— Wealth IQ",
  ].join("\n");

  const htmlBody = `
    <div style="background-color:#f3f4f6;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
      <table cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07);">
        <tbody>
          <tr>
            <td style="text-align:center;padding:32px 24px 16px;background:linear-gradient(180deg,#fdf2f4 0%,#ffffff 100%);">
              <div style="font-size:22px;font-weight:800;letter-spacing:3px;color:#9ca3af;">WEALTH IQ</div>
            </td>
          </tr>
          <tr>
            <td style="text-align:center;padding:8px 32px 24px;">
              <h1 style="font-size:24px;font-weight:600;color:rgba(0,0,0,0.9);margin:0 0 8px;line-height:1.25;">Hi ${userName}, your Financial Blueprint is ready!</h1>
              <p style="font-size:14px;color:rgba(0,0,0,0.6);margin:0;line-height:1.5;">Based on your Wealth IQ assessment responses, here&#39;s your personalized money mindset profile.</p>
            </td>
          </tr>
          <tr><td style="padding:0 32px;"><hr style="border:none;border-top:1px solid #e5e7eb;margin:0;"/></td></tr>

          <tr>
            <td style="padding:24px 24px 8px;text-align:center;">
              <span style="font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(0,0,0,0.4);">Your Top Archetypes</span>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 24px 24px;">
              <table cellpadding="0" cellspacing="0" width="100%"><tbody><tr>
                <td width="48%" valign="top" style="padding-right:8px;">
                  ${archetypeCardHtml("PRIMARY", primary?.name ?? "", primary?.pct ?? 0, primaryData)}
                </td>
                <td width="48%" valign="top" style="padding-left:8px;">
                  ${archetypeCardHtml("SECONDARY", secondary?.name ?? "", secondary?.pct ?? 0, secondaryData)}
                </td>
              </tr></tbody></table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 24px 16px;">
              <table cellpadding="0" cellspacing="0" width="100%" style="background-color:#fdf2f4;border-radius:10px;border:1px solid #fce7f3;"><tbody>
                <tr><td style="padding:18px 24px 8px;text-align:center;">
                  <span style="font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#b5546a;">What Does This Mean?</span>
                </td></tr>
                <tr><td style="padding:0 24px 18px;font-size:14px;color:rgba(0,0,0,0.7);line-height:1.5;text-align:center;">${compatibilityInsight}</td></tr>
              </tbody></table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 24px;">
              <table cellpadding="0" cellspacing="0" width="100%" style="background-color:#f9fafb;border-radius:10px;overflow:hidden;"><tbody>
                <tr><td style="padding:18px 20px 10px;text-align:center;">
                  <span style="font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(0,0,0,0.4);">Your Other Traits</span>
                </td></tr>
                ${otherTraitBars}
                <tr><td style="padding:10px;"></td></tr>
              </tbody></table>
            </td>
          </tr>

          <tr><td style="padding:14px;"></td></tr>

          <tr>
            <td style="padding:0 24px;">
              <table cellpadding="0" cellspacing="0" width="100%"><tbody><tr>
                <td width="48%" valign="top" style="padding-right:8px;">
                  <table cellpadding="0" cellspacing="0" width="100%" style="background-color:#f0fdf4;border-radius:10px;border:1px solid #bbf7d0;"><tbody>
                    <tr><td style="padding:16px 16px 8px;text-align:center;">
                      <span style="font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#16a34a;">Recommendations</span>
                    </td></tr>
                    ${recItems}
                    <tr><td style="padding:10px;"></td></tr>
                  </tbody></table>
                </td>
                <td width="48%" valign="top" style="padding-left:8px;">
                  <table cellpadding="0" cellspacing="0" width="100%" style="background-color:#fffbeb;border-radius:10px;border:1px solid #fde68a;"><tbody>
                    <tr><td style="padding:16px 16px 8px;text-align:center;">
                      <span style="font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#d97706;">Growth Challenges</span>
                    </td></tr>
                    ${challengeItems}
                    <tr><td style="padding:10px;"></td></tr>
                  </tbody></table>
                </td>
              </tr></tbody></table>
            </td>
          </tr>

          <tr><td style="padding:24px;"></td></tr>

          <tr>
            <td style="background-color:#faf5f6;padding:24px 32px;text-align:center;">
              <div style="font-size:16px;font-weight:800;letter-spacing:2px;color:rgba(0,0,0,0.3);margin-bottom:10px;">WEALTH IQ</div>
              <p style="font-size:13px;margin:0 0 12px;">
                <a href="https://www.wealthiqco.com" style="color:#b5546a;font-weight:600;text-decoration:none;">www.wealthiqco.com</a>
              </p>
              <p style="font-size:12px;color:rgba(0,0,0,0.4);line-height:1.5;margin:0;">
                Wealth IQ &#8226; Conscious Prosperity<br/>
                This email was sent because you completed the Wealth IQ Money Mindset Assessment.<br/>
                Your results are confidential and never shared with third parties.
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>`;

  await sendEmail(
    ["hello@wealthiqco.com", userEmail],
    `${userName}, your Wealth IQ Financial Blueprint is ready`,
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
    console.log("Seeded 36 Wealth IQ questions");
  }
}
