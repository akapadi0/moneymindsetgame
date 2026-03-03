import wealthIqLogo from "@assets/fulllogo_1772556379287.png";

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

export default function EmailPreview() {
  const sorted = Object.entries(SAMPLE_SCORES).sort((a, b) => b[1] - a[1]);
  const [primary, secondary] = sorted;
  const primaryData = ARCHETYPE_DATA[primary[0]];
  const secondaryData = ARCHETYPE_DATA[secondary[0]];
  const maxScore = Math.max(...Object.values(SAMPLE_SCORES));

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-[600px] mx-auto">
        <p className="text-center text-sm text-muted-foreground mb-4">Email Template Preview</p>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ fontFamily: "'DM Sans', Arial, sans-serif" }}>

          <div className="text-center pt-10 pb-6" style={{ background: 'linear-gradient(180deg, #fdf2f4 0%, #ffffff 100%)' }}>
            <img src={wealthIqLogo} alt="WealthIQ" className="h-20 mx-auto mix-blend-multiply" data-testid="img-logo-email" />
          </div>

          <div className="px-8 pb-8">

            <div className="text-center mb-8">
              <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
                Hi {SAMPLE_NAME}, your Financial Blueprint is ready!
              </h1>
              <p className="text-gray-500 text-sm">
                Based on your responses to the WealthIQ assessment, here's your personalized money mindset profile.
              </p>
            </div>

            <div className="mb-10">
              <div className="text-center mb-6">
                <span className="inline-block text-xs font-semibold tracking-widest uppercase text-gray-400 border-b-2 border-gray-200 pb-1">
                  Your Top Archetypes
                </span>
              </div>

              {[
                { entry: primary, data: primaryData, label: "Primary Archetype", rank: "#1" },
                { entry: secondary, data: secondaryData, label: "Secondary Archetype", rank: "#2" },
              ].map(({ entry, data, label, rank }) => (
                <div
                  key={entry[0]}
                  className="rounded-xl mb-5 overflow-hidden"
                  style={{ border: `1px solid ${data.borderColor}`, backgroundColor: data.bgColor }}
                >
                  <div className="px-6 py-4" style={{ borderBottom: `1px solid ${data.borderColor}` }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: data.textColor }}>
                          {label}
                        </span>
                        <h2 className="text-xl font-display font-bold text-gray-900 mt-1">
                          {rank} {entry[0]}
                        </h2>
                      </div>
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: data.barColor }}
                      >
                        {entry[1]}%
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 space-y-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Motivation</p>
                      <p className="text-sm text-gray-700">{data.motivation}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Superpowers</p>
                      <p className="text-sm text-gray-700">{data.superpowers}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Watch Out For</p>
                      <p className="text-sm text-gray-700">{data.biases}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-10">
              <div className="text-center mb-6">
                <span className="inline-block text-xs font-semibold tracking-widest uppercase text-gray-400 border-b-2 border-gray-200 pb-1">
                  Your Complete Financial Profile
                </span>
              </div>
              <p className="text-sm text-gray-500 text-center mb-5">
                Here's how you scored across all six money archetypes.
              </p>

              <div className="space-y-3">
                {sorted.map(([name, score], index) => {
                  const data = ARCHETYPE_DATA[name];
                  return (
                    <div key={name} className="flex items-center gap-3">
                      <div className="w-24 flex-shrink-0 text-right">
                        <span className="text-sm font-semibold text-gray-700">{name}</span>
                      </div>
                      <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${(score / maxScore) * 100}%`,
                            backgroundColor: data.barColor,
                            opacity: index < 2 ? 1 : 0.6,
                          }}
                        />
                      </div>
                      <div className="w-10 text-right">
                        <span className="text-sm font-bold" style={{ color: data.barColor }}>{score}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 space-y-2">
                {sorted.slice(2).map(([name, score]) => {
                  const data = ARCHETYPE_DATA[name];
                  return (
                    <div key={name} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="font-semibold" style={{ color: data.textColor }}>{name}:</span>
                      <span>{data.motivation}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mb-10">
              <div className="text-center mb-6">
                <span className="inline-block text-xs font-semibold tracking-widest uppercase text-gray-400 border-b-2 border-gray-200 pb-1">
                  Strategic Recommendations
                </span>
              </div>
              <p className="text-sm text-gray-500 text-center mb-5">
                Based on your {primary[0]} + {secondary[0]} profile, here's how to make the most of your money mindset.
              </p>

              <div className="grid grid-cols-1 gap-3">
                {[...primaryData.recommendations, ...secondaryData.recommendations].map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-lg px-4 py-3">
                    <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                    <p className="text-sm text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <div className="text-center mb-6">
                <span className="inline-block text-xs font-semibold tracking-widest uppercase text-gray-400 border-b-2 border-gray-200 pb-1">
                  Growth Challenges
                </span>
              </div>
              <p className="text-sm text-gray-500 text-center mb-5">
                Small steps to stretch beyond your comfort zone this week.
              </p>

              <div className="grid grid-cols-1 gap-3">
                {[...primaryData.challenges, ...secondaryData.challenges].map((challenge, i) => (
                  <div key={i} className="flex items-start gap-3 bg-amber-50 rounded-lg px-4 py-3">
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">⚡</span>
                    <p className="text-sm text-gray-700">{challenge}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mb-8">
              <a
                href="/"
                className="inline-block px-8 py-3 rounded-full text-white font-semibold text-sm"
                style={{ backgroundColor: '#b5546a' }}
                data-testid="button-view-results"
              >
                View Your Full Interactive Results →
              </a>
              <p className="text-xs text-gray-400 mt-3">
                See your detailed charts and compare with friends
              </p>
            </div>

          </div>

          <div className="px-8 py-6 text-center" style={{ backgroundColor: '#faf5f6' }}>
            <img src={wealthIqLogo} alt="WealthIQ" className="h-10 mx-auto mb-3 mix-blend-multiply opacity-60" />
            <p className="text-xs text-gray-400 leading-relaxed">
              WealthIQ — Conscious Prosperity<br />
              This email was sent because you completed the WealthIQ Money Mindset Assessment.<br />
              Your results are confidential and never shared with third parties.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
