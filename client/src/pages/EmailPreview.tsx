import wealthIqLogo from "@assets/fulllogo_1772556379287.png";
import strategistImg from "@/assets/images/archetype-strategist.png";
import giverImg from "@/assets/images/archetype-giver.png";
import adventurerImg from "@/assets/images/archetype-adventurer.png";
import guardianImg from "@/assets/images/archetype-guardian.png";
import impressorImg from "@/assets/images/archetype-impressor.png";
import freespiritImg from "@/assets/images/archetype-freespirit.png";

const SAMPLE_NAME = "Sarah";
const SAMPLE_SCORES: Record<string, number> = {
  "Strategists": 85,
  "Guardians": 72,
  "Free Spirits": 55,
  "Givers": 65,
  "Impressors": 45,
  "Adventurers": 38,
};

const ARCHETYPE_DATA: Record<string, {
  motivation: string;
  superpowers: string;
  biases: string;
  barColor: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  image: string;
  recommendations: string[];
  challenges: string[];
}> = {
  "Strategists": {
    motivation: "Long-term success through structure & informed decisions",
    superpowers: "Long-term thinker, loves planning, efficient with resources",
    biases: "May overanalyze decisions, delay action until all the data is in",
    barColor: "#059669",
    bgColor: "#ecfdf5",
    borderColor: "#a7f3d0",
    textColor: "#047857",
    image: strategistImg,
    recommendations: [
      "Set a deadline for financial decisions to avoid analysis paralysis",
      "Build in a 'spontaneity fund' for unplanned opportunities",
      "Practice making smaller decisions quickly to build confidence"
    ],
    challenges: [
      "Make one financial decision this week in under 10 minutes",
      "Spend $50 on something fun without researching it first",
      "Skip one spreadsheet review this month and trust your gut"
    ]
  },
  "Givers": {
    motivation: "Community well-being through generosity",
    superpowers: "Deeply values people and purpose, community-oriented",
    biases: "Take on responsibilities that are not aligned with long-term goals",
    barColor: "#e11d48",
    bgColor: "#fff1f2",
    borderColor: "#fecdd3",
    textColor: "#be123c",
    image: giverImg,
    recommendations: [
      "Create a giving budget that protects your own financial security first",
      "Learn to say 'not right now' instead of always saying yes",
      "Set up automatic savings before allocating funds to help others"
    ],
    challenges: [
      "Say 'let me think about it' before agreeing to any financial help this week",
      "Transfer 10% of your next paycheck to your own savings before giving",
      "Write down 3 ways to help others that don't involve money"
    ]
  },
  "Adventurers": {
    motivation: "Seeking excitement, novelty, and freedom",
    superpowers: "Comfortable with risk, visionary, flexible thinker",
    biases: "Prone to impulsive decisions without considering trade offs",
    barColor: "#d97706",
    bgColor: "#fffbeb",
    borderColor: "#fde68a",
    textColor: "#b45309",
    image: adventurerImg,
    recommendations: [
      "Implement a 48-hour rule before major financial decisions",
      "Channel your risk tolerance into diversified investments",
      "Create adventure-specific savings to fund experiences responsibly"
    ],
    challenges: [
      "Wait 48 hours before your next purchase over $100",
      "Create a dedicated 'adventure fund' and only use that for spontaneous buys",
      "Track every impulse purchase for 2 weeks — no judgment, just awareness"
    ]
  },
  "Guardians": {
    motivation: "Minimizing uncertainty and ensuring safety",
    superpowers: "Excellent at protecting stability and managing downside risk",
    biases: "Tends to avoid risks or underinvest in growth",
    barColor: "#0d9488",
    bgColor: "#f0fdfa",
    borderColor: "#99f6e4",
    textColor: "#0f766e",
    image: guardianImg,
    recommendations: [
      "Set up a 'growth fund' separate from your emergency savings",
      "Start small with investments to build comfort with calculated risks",
      "Review your portfolio annually to ensure you're not being too conservative"
    ],
    challenges: [
      "Invest $25 in something new this month — even if it feels uncomfortable",
      "Research one 'risky' investment and learn why others find it appealing",
      "Calculate how much extra you'd have if you'd taken more growth risk"
    ]
  },
  "Impressors": {
    motivation: "Enhancing self-worth through display",
    superpowers: "Great at branding, making things look and feel valuable",
    biases: "May spend based on external validation or comparison, rather than alignment",
    barColor: "#7c3aed",
    bgColor: "#f5f3ff",
    borderColor: "#ddd6fe",
    textColor: "#6d28d9",
    image: impressorImg,
    recommendations: [
      "Before purchases, ask: 'Would I buy this if no one would ever see it?'",
      "Create a 'values list' to check spending decisions against",
      "Redirect some 'impression spending' into wealth-building investments"
    ],
    challenges: [
      "Before any purchase this week, ask: 'Would I buy this if no one knew?'",
      "Unfollow 3 accounts that trigger comparison spending",
      "Redirect one 'impression purchase' into your investment account"
    ]
  },
  "Free Spirits": {
    motivation: "Enjoying life's flow and reducing anxiety",
    superpowers: "Intuitive, flow-based, values alignment over optimization",
    biases: "Avoids structure — often due to anxiety or rebellion",
    barColor: "#0284c7",
    bgColor: "#f0f9ff",
    borderColor: "#bae6fd",
    textColor: "#0369a1",
    image: freespiritImg,
    recommendations: [
      "Set up one automated transfer to savings — 'set it and forget it'",
      "Create a simple, visual spending tracker you'll actually enjoy using",
      "Schedule a quarterly 'money date' to check in without overwhelming yourself"
    ],
    challenges: [
      "Set up one automatic savings transfer — just $20 — and forget about it",
      "Spend 5 minutes looking at your bank balance (no stress, just awareness)",
      "Create one simple money rule for yourself that feels freeing, not limiting"
    ]
  }
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
  "Free Spirits + Impressors": "As an Impressor-Free Spirit, you value both self-expression and flow. You want to look and feel successful, but you don't want rigid systems to get there. This combination thrives when you find financial approaches that feel natural and aligned with your identity — not forced or formulaic. Automate the basics so you can focus on what inspires you."
};

export default function EmailPreview() {
  const sorted = Object.entries(SAMPLE_SCORES).sort((a, b) => b[1] - a[1]);
  const [primary, secondary] = sorted;
  const primaryData = ARCHETYPE_DATA[primary[0]];
  const secondaryData = ARCHETYPE_DATA[secondary[0]];
  const maxScore = Math.max(...Object.values(SAMPLE_SCORES));

  const comboKey = [primary[0], secondary[0]].sort().join(" + ");
  const compatibilityInsight = COMPATIBILITY_INSIGHTS[comboKey] || "Your unique combination of archetypes gives you a distinctive approach to money that blends multiple perspectives.";

  const linkedInPosts: Record<string, string> = {
    "Strategists+Guardians": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI plan every dollar like a chess move — and then double-check it's protected.\n\nApparently we all have financial blind spots we can't see on our own. Mine was eye-opening.\n\n💬 Curious what yours might be?",
    "Strategists+Givers": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI build detailed financial plans… and then quietly give more than I probably should.\n\nThe tension between my head and my heart with money? Finally makes sense.\n\n💬 What patterns are running your money decisions?",
    "Strategists+Adventurers": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI build a spreadsheet… and then make a bold move anyway.\n\nCalculated risk-taker? Apparently that's a real thing.\n\n💬 What money habits are hiding in your blind spot?",
    "Strategists+Impressors": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI plan everything down to the last detail — but I also want the best of the best.\n\nPrecision meets taste. That tracks.\n\n💬 What's your money personality hiding from you?",
    "Strategists+Free Spirits": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nPart of me wants a perfect plan — the other part wants to throw it out the window.\n\nThe tug-of-war between structure and freedom? It's real.\n\n💬 What's your hidden money pattern?",
    "Guardians+Strategists": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nMy first instinct with money is to protect it — and my second is to plan how to grow it.\n\nSecurity first, strategy second. No wonder I sleep well at night.\n\n💬 But apparently I have blind spots too. What are yours?",
    "Guardians+Givers": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI guard my money carefully — except when someone I care about needs help.\n\nThe protector who can't say no? That hit different.\n\n💬 What money patterns are running in your background?",
    "Guardians+Adventurers": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nOne side of me wants a safety net — the other wants to jump without one.\n\nCautious thrill-seeker? Apparently that's me.\n\n💬 What's your money personality hiding from you?",
    "Guardians+Impressors": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI want financial security — but I also want the finer things in life.\n\nThe saver who appreciates quality? That tension is real.\n\n💬 What financial habits do you never question?",
    "Guardians+Free Spirits": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI want to feel financially safe — but I also resist anything that feels too rigid.\n\nCraving security and freedom at the same time? That explained a lot.\n\n💬 What does your money personality say about you?",
    "Givers+Strategists": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nMy first impulse is to help others — and then my brain kicks in with a plan for it.\n\nGenerous but strategic? I'll take that.\n\n💬 What money patterns do you not realize you have?",
    "Givers+Guardians": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI give freely — but I also worry about having enough.\n\nThe generous worrier? Yeah, that tracks.\n\n💬 What money habits are running in your background?",
    "Givers+Adventurers": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI'm the person who picks up the tab on a spontaneous night out — every time.\n\nGenerous and impulsive? No wonder my wallet has feelings.\n\n💬 What does your money personality say about you?",
    "Givers+Impressors": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI love helping people — and I want it to mean something visible.\n\nGiving with impact? That's apparently my thing.\n\n💬 What financial patterns are hiding in your blind spot?",
    "Givers+Free Spirits": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI follow my heart with money — whether that means giving it away or going with the flow.\n\nLed by feelings, not formulas. That explains a lot.\n\n💬 What's driving your money decisions?",
    "Adventurers+Strategists": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI chase bold opportunities — but I do my homework first.\n\nReady, research, leap? Apparently that's my approach.\n\n💬 What money instincts do you never question?",
    "Adventurers+Guardians": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI crave excitement — but only after I know the safety net is there.\n\nAdrenaline with insurance? That's me.\n\n💬 What financial patterns are you not seeing?",
    "Adventurers+Givers": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI jump into new experiences — and I bring everyone along for the ride.\n\nSpontaneous and generous? My bank account isn't surprised.\n\n💬 What's your money personality hiding?",
    "Adventurers+Impressors": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI chase new experiences — especially the ones that look incredible.\n\nThrill-seeker with taste? Guilty.\n\n💬 What money habits do you never examine?",
    "Adventurers+Free Spirits": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI follow my gut, take the leap, and figure out the rest later.\n\nSpontaneous to the core? Not even a little surprised.\n\n💬 But the blind spots it revealed? Those surprised me. What are yours?",
    "Impressors+Strategists": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI want the best — and I have a plan to get it.\n\nQuality-driven with a strategy? That tracks perfectly.\n\n💬 What financial patterns are running your decisions?",
    "Impressors+Guardians": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI value quality and success — but I'm not reckless about it.\n\nHigh standards with a safety net? Makes sense.\n\n💬 What are your money blind spots?",
    "Impressors+Givers": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI care about how things look — and I care about people even more.\n\nImage-conscious and generous? That combination has a cost.\n\n💬 What's your money personality costing you?",
    "Impressors+Adventurers": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI want bold experiences — and I want them to be impressive.\n\nGo big and look good doing it? Yeah, that's me.\n\n💬 What money patterns are you not seeing?",
    "Impressors+Free Spirits": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI want to look successful — but I don't want a rigid plan to get there.\n\nStyle without the spreadsheet? That hit home.\n\n💬 What does your relationship with money actually look like?",
    "Free Spirits+Strategists": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI resist financial rules — but deep down I know a good plan when I see one.\n\nFree-flowing with a strategic side? That contradiction is real.\n\n💬 What money contradictions are you carrying?",
    "Free Spirits+Guardians": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI want total freedom — but I also want to know I'm safe.\n\nThe free spirit with a safety net? That explains my savings account.\n\n💬 What's your money personality not telling you?",
    "Free Spirits+Givers": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI go with the flow — and I bring people along generously.\n\nEasy-going and giving? My bank account has thoughts.\n\n💬 What money patterns are running your life?",
    "Free Spirits+Adventurers": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI follow my instincts and chase what excites me — with money and everything else.\n\nUntamed? Apparently yes.\n\n💬 But the blind spots were the real surprise. What are yours?",
    "Free Spirits+Impressors": "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI want life to feel effortless — and look good while I'm at it.\n\nLow-key with high standards? That's a vibe.\n\n💬 What does your money personality reveal about you?"
  };
  const linkedInComboKey = `${primary[0]}+${secondary[0]}`;
  const linkedInShareText = linkedInPosts[linkedInComboKey] || "💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI discovered something surprising about my relationship with money.\n\nThe blind spots were the real eye-opener.\n\n💬 What's yours?";

  const xPosts: Record<string, string> = {
    "Strategists+Guardians": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? I plan every dollar and then guard it like a dragon.\n\nWhat's yours?",
    "Strategists+Givers": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? I build financial plans… and then quietly give more than I should.\n\nWhat's yours?",
    "Strategists+Adventurers": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? I build a spreadsheet, then throw caution to the wind.\n\nWhat's yours?",
    "Strategists+Impressors": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? I plan obsessively and spend on quality.\n\nWhat's yours?",
    "Strategists+Free Spirits": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? Half of me wants a 10-year plan. The other half wants to wing it.\n\nWhat's yours?",
    "Guardians+Strategists": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? Protect first, plan second.\n\nWhat's yours?",
    "Guardians+Givers": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? I save carefully… unless someone needs help.\n\nWhat's yours?",
    "Guardians+Adventurers": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? I want a safety net AND an adventure.\n\nWhat's yours?",
    "Guardians+Impressors": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? I save like my life depends on it, then splurge on something beautiful.\n\nWhat's yours?",
    "Guardians+Free Spirits": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? I crave security but hate being boxed in.\n\nWhat's yours?",
    "Givers+Strategists": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? I give first, strategize second.\n\nWhat's yours?",
    "Givers+Guardians": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? Generous but anxious about it.\n\nWhat's yours?",
    "Givers+Adventurers": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? I pick up the tab on a spontaneous trip I didn't plan.\n\nWhat's yours?",
    "Givers+Impressors": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? I give generously and want it to mean something.\n\nWhat's yours?",
    "Givers+Free Spirits": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? I follow my heart with money — giving, flowing, vibing.\n\nWhat's yours?",
    "Adventurers+Strategists": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? I research thoroughly, then leap.\n\nWhat's yours?",
    "Adventurers+Guardians": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? Thrill-seeker with a savings account.\n\nWhat's yours?",
    "Adventurers+Givers": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? I chase experiences and bring everyone along.\n\nWhat's yours?",
    "Adventurers+Impressors": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? Go big and make it look good.\n\nWhat's yours?",
    "Adventurers+Free Spirits": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? Spontaneous. Instinctive. Zero regrets.\n\nWhat's yours?",
    "Impressors+Strategists": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? I want the best and I have a plan to afford it.\n\nWhat's yours?",
    "Impressors+Guardians": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? High standards, strong savings.\n\nWhat's yours?",
    "Impressors+Givers": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? I care about image and people equally.\n\nWhat's yours?",
    "Impressors+Adventurers": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? Bold moves that look incredible.\n\nWhat's yours?",
    "Impressors+Free Spirits": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? I want success to look effortless.\n\nWhat's yours?",
    "Free Spirits+Strategists": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? I resist rules but respect a good plan.\n\nWhat's yours?",
    "Free Spirits+Guardians": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? I want freedom AND security.\n\nWhat's yours?",
    "Free Spirits+Givers": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? Go with the flow and give along the way.\n\nWhat's yours?",
    "Free Spirits+Adventurers": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? Instinct over spreadsheets. Always.\n\nWhat's yours?",
    "Free Spirits+Impressors": "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nMine? Effortless vibes, high standards.\n\nWhat's yours?"
  };
  const xComboKey = `${primary[0]}+${secondary[0]}`;
  const xShareText = xPosts[xComboKey] || "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nThe blind spots were the real surprise.\n\nWhat's yours?";

  return (
    <div style={{ backgroundColor: '#f3f4f6', padding: '32px 16px', minHeight: '100vh', fontFamily: "'DM Sans', Arial, Helvetica, sans-serif" }}>
      <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', marginBottom: '16px' }}>Email Template Preview</p>

      {/* Email container - 600px max like real emails */}
      <table cellPadding={0} cellSpacing={0} style={{ maxWidth: '600px', margin: '0 auto', width: '100%', backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}>
        <tbody>

          {/* Header with logo */}
          <tr>
            <td style={{ textAlign: 'center', padding: '32px 24px 16px', background: 'linear-gradient(180deg, #fdf2f4 0%, #ffffff 100%)' }}>
              <img src={wealthIqLogo} alt="WealthIQ" style={{ height: '64px', margin: '0 auto', display: 'block' }} data-testid="img-logo-email" />
            </td>
          </tr>

          {/* Greeting */}
          <tr>
            <td style={{ textAlign: 'center', padding: '8px 32px 24px' }}>
              <h1 style={{ fontSize: '22px', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>
                Hi {SAMPLE_NAME}, your Financial Blueprint is ready!
              </h1>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
                Based on your WealthIQ assessment responses, here's your personalized money mindset profile.
              </p>
            </td>
          </tr>

          {/* Divider */}
          <tr><td style={{ padding: '0 32px' }}><hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: 0 }} /></td></tr>

          {/* Section: Top 2 Archetypes side by side */}
          <tr>
            <td style={{ padding: '24px 24px 8px', textAlign: 'center' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' as const, color: '#9ca3af' }}>
                Your Top Archetypes
              </span>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '12px 24px 24px' }}>
              <table cellPadding={0} cellSpacing={0} style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    {/* Primary Archetype */}
                    <td style={{ width: '48%', verticalAlign: 'top', padding: '0 4px 0 0' }}>
                      <table cellPadding={0} cellSpacing={0} style={{ width: '100%', borderRadius: '10px', overflow: 'hidden', border: `1px solid ${primaryData.borderColor}`, backgroundColor: primaryData.bgColor }}>
                        <tbody>
                          <tr>
                            <td style={{ padding: '14px 14px 10px', textAlign: 'center' }}>
                              <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: primaryData.textColor }}>Primary</span>
                              <img src={primaryData.image} alt={primary[0]} style={{ width: '80px', height: '80px', objectFit: 'contain', display: 'block', margin: '8px auto' }} />
                              <h2 style={{ fontSize: '16px', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, color: '#111827', margin: '4px 0 2px' }}>
                                {primary[0]}
                              </h2>
                              <span style={{ fontSize: '14px', fontWeight: 700, color: primaryData.barColor }}>{primary[1]}%</span>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ padding: '0 14px 12px', fontSize: '11px', color: '#4b5563', lineHeight: 1.5 }}>
                              <p style={{ margin: '0 0 6px' }}><strong style={{ color: '#9ca3af', fontSize: '9px', textTransform: 'uppercase' as const, letterSpacing: '1px' }}>Motivation</strong><br />{primaryData.motivation}</p>
                              <p style={{ margin: '0 0 6px' }}><strong style={{ color: '#9ca3af', fontSize: '9px', textTransform: 'uppercase' as const, letterSpacing: '1px' }}>Superpowers</strong><br />{primaryData.superpowers}</p>
                              <p style={{ margin: 0 }}><strong style={{ color: '#9ca3af', fontSize: '9px', textTransform: 'uppercase' as const, letterSpacing: '1px' }}>Watch Out</strong><br />{primaryData.biases}</p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>

                    {/* Spacer */}
                    <td style={{ width: '4%' }}></td>

                    {/* Secondary Archetype */}
                    <td style={{ width: '48%', verticalAlign: 'top', padding: '0 0 0 4px' }}>
                      <table cellPadding={0} cellSpacing={0} style={{ width: '100%', borderRadius: '10px', overflow: 'hidden', border: `1px solid ${secondaryData.borderColor}`, backgroundColor: secondaryData.bgColor }}>
                        <tbody>
                          <tr>
                            <td style={{ padding: '14px 14px 10px', textAlign: 'center' }}>
                              <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: secondaryData.textColor }}>Secondary</span>
                              <img src={secondaryData.image} alt={secondary[0]} style={{ width: '80px', height: '80px', objectFit: 'contain', display: 'block', margin: '8px auto' }} />
                              <h2 style={{ fontSize: '16px', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, color: '#111827', margin: '4px 0 2px' }}>
                                {secondary[0]}
                              </h2>
                              <span style={{ fontSize: '14px', fontWeight: 700, color: secondaryData.barColor }}>{secondary[1]}%</span>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ padding: '0 14px 12px', fontSize: '11px', color: '#4b5563', lineHeight: 1.5 }}>
                              <p style={{ margin: '0 0 6px' }}><strong style={{ color: '#9ca3af', fontSize: '9px', textTransform: 'uppercase' as const, letterSpacing: '1px' }}>Motivation</strong><br />{secondaryData.motivation}</p>
                              <p style={{ margin: '0 0 6px' }}><strong style={{ color: '#9ca3af', fontSize: '9px', textTransform: 'uppercase' as const, letterSpacing: '1px' }}>Superpowers</strong><br />{secondaryData.superpowers}</p>
                              <p style={{ margin: 0 }}><strong style={{ color: '#9ca3af', fontSize: '9px', textTransform: 'uppercase' as const, letterSpacing: '1px' }}>Watch Out</strong><br />{secondaryData.biases}</p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* Section: Compatibility Insight */}
          <tr>
            <td style={{ padding: '0 24px 16px' }}>
              <table cellPadding={0} cellSpacing={0} style={{ width: '100%', backgroundColor: '#fdf2f4', borderRadius: '10px', border: '1px solid #fce7f3' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '16px 20px 8px', textAlign: 'center' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' as const, color: '#b5546a' }}>What Does This Mean?</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0 20px 16px', fontSize: '13px', color: '#374151', lineHeight: 1.7, textAlign: 'center' }}>
                      {compatibilityInsight}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* Section: Complete Profile - compact bar chart */}
          <tr>
            <td style={{ padding: '0 24px' }}>
              <table cellPadding={0} cellSpacing={0} style={{ width: '100%', backgroundColor: '#f9fafb', borderRadius: '10px', overflow: 'hidden' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '16px 20px 8px', textAlign: 'center' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' as const, color: '#9ca3af' }}>Your Other Traits</span>
                    </td>
                  </tr>
                  {sorted.slice(2).map(([name, score]) => {
                    const data = ARCHETYPE_DATA[name];
                    return (
                      <tr key={name}>
                        <td style={{ padding: '4px 20px' }}>
                          <table cellPadding={0} cellSpacing={0} style={{ width: '100%' }}>
                            <tbody>
                              <tr>
                                <td style={{ width: '24px', paddingRight: '4px' }}>
                                  <img src={data.image} alt="" style={{ width: '22px', height: '22px', objectFit: 'contain', display: 'block' }} />
                                </td>
                                <td style={{ width: '80px', fontSize: '12px', fontWeight: 600, color: '#374151', paddingRight: '8px' }}>
                                  {name}
                                </td>
                                <td style={{ padding: '3px 0' }}>
                                  <div style={{ backgroundColor: '#e5e7eb', borderRadius: '10px', height: '14px', overflow: 'hidden' }}>
                                    <div style={{ width: `${(score / maxScore) * 100}%`, backgroundColor: data.barColor, height: '100%', borderRadius: '10px' }} />
                                  </div>
                                </td>
                                <td style={{ width: '40px', fontSize: '12px', fontWeight: 700, color: data.barColor, textAlign: 'right', paddingLeft: '8px' }}>
                                  {score}%
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    );
                  })}
                  <tr><td style={{ padding: '8px' }}></td></tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* Spacer */}
          <tr><td style={{ padding: '12px' }}></td></tr>

          {/* Section: Recommendations + Challenges side by side */}
          <tr>
            <td style={{ padding: '0 24px' }}>
              <table cellPadding={0} cellSpacing={0} style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    {/* Recommendations */}
                    <td style={{ width: '48%', verticalAlign: 'top', padding: '0 4px 0 0' }}>
                      <table cellPadding={0} cellSpacing={0} style={{ width: '100%', backgroundColor: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                        <tbody>
                          <tr>
                            <td style={{ padding: '14px 14px 6px', textAlign: 'center' }}>
                              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: '#16a34a' }}>Recommendations</span>
                            </td>
                          </tr>
                          {[...primaryData.recommendations, ...secondaryData.recommendations].slice(0, 5).map((rec, i) => (
                            <tr key={`r-${i}`}>
                              <td style={{ padding: '4px 14px', fontSize: '11px', color: '#374151', lineHeight: 1.5 }}>
                                <table cellPadding={0} cellSpacing={0}><tbody><tr>
                                  <td style={{ verticalAlign: 'top', paddingRight: '6px', color: '#16a34a', fontWeight: 700 }}>+</td>
                                  <td>{rec}</td>
                                </tr></tbody></table>
                              </td>
                            </tr>
                          ))}
                          <tr><td style={{ padding: '8px' }}></td></tr>
                        </tbody>
                      </table>
                    </td>

                    {/* Spacer */}
                    <td style={{ width: '4%' }}></td>

                    {/* Challenges */}
                    <td style={{ width: '48%', verticalAlign: 'top', padding: '0 0 0 4px' }}>
                      <table cellPadding={0} cellSpacing={0} style={{ width: '100%', backgroundColor: '#fffbeb', borderRadius: '10px', border: '1px solid #fde68a' }}>
                        <tbody>
                          <tr>
                            <td style={{ padding: '14px 14px 6px', textAlign: 'center' }}>
                              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: '#d97706' }}>Growth Challenges</span>
                            </td>
                          </tr>
                          {[...primaryData.challenges, ...secondaryData.challenges].slice(0, 5).map((ch, i) => (
                            <tr key={`c-${i}`}>
                              <td style={{ padding: '4px 14px', fontSize: '11px', color: '#374151', lineHeight: 1.5 }}>
                                <table cellPadding={0} cellSpacing={0}><tbody><tr>
                                  <td style={{ verticalAlign: 'top', paddingRight: '6px', color: '#d97706', fontWeight: 700 }}>*</td>
                                  <td>{ch}</td>
                                </tr></tbody></table>
                              </td>
                            </tr>
                          ))}
                          <tr><td style={{ padding: '8px' }}></td></tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* Share Section */}
          <tr>
            <td style={{ padding: '24px 24px 8px', textAlign: 'center' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' as const, color: '#9ca3af' }}>
                Share Your Blueprint
              </span>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '12px 32px 8px' }}>
              <table cellPadding={0} cellSpacing={0} style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td style={{ textAlign: 'center', paddingRight: '6px', width: '50%' }}>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(xShareText)}&url=${encodeURIComponent('https://wealthiq.app')}`}
                        style={{ display: 'inline-block', padding: '10px 20px', borderRadius: '8px', backgroundColor: '#0f1419', color: '#ffffff', fontWeight: 600, fontSize: '12px', textDecoration: 'none', width: '100%', boxSizing: 'border-box' as const, textAlign: 'center' }}
                        data-testid="button-share-twitter"
                      >
                        Share on X
                      </a>
                    </td>
                    <td style={{ textAlign: 'center', paddingLeft: '6px', width: '50%' }}>
                      <a
                        href={`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(linkedInShareText + '\n\nhttps://wealthiq.app')}`}
                        style={{ display: 'inline-block', padding: '10px 20px', borderRadius: '8px', backgroundColor: '#0A66C2', color: '#ffffff', fontWeight: 600, fontSize: '12px', textDecoration: 'none', width: '100%', boxSizing: 'border-box' as const, textAlign: 'center' }}
                        data-testid="button-share-linkedin"
                      >
                        Share on LinkedIn
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '12px 32px 24px', textAlign: 'center' }}>
              <table cellPadding={0} cellSpacing={0} style={{ width: '100%', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 10px', lineHeight: 1.5 }}>
                        Invite a partner, spouse, or family member to take the quiz and compare your money mindsets
                      </p>
                      <a
                        href="/"
                        style={{ display: 'inline-block', padding: '10px 24px', borderRadius: '8px', backgroundColor: '#b5546a', color: '#ffffff', fontWeight: 600, fontSize: '12px', textDecoration: 'none' }}
                        data-testid="button-invite-compare"
                      >
                        Send Quiz Invite
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* Footer */}
          <tr>
            <td style={{ backgroundColor: '#faf5f6', padding: '20px 32px', textAlign: 'center' }}>
              <img src={wealthIqLogo} alt="WealthIQ" style={{ height: '36px', margin: '0 auto 8px', display: 'block', opacity: 0.5 }} />
              <p style={{ fontSize: '10px', color: '#9ca3af', lineHeight: 1.6, margin: 0 }}>
                WealthIQ - Conscious Prosperity<br />
                This email was sent because you completed the WealthIQ Money Mindset Assessment.<br />
                Your results are confidential and never shared with third parties.
              </p>
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  );
}
