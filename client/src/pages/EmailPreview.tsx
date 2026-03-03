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

export default function EmailPreview() {
  const sorted = Object.entries(SAMPLE_SCORES).sort((a, b) => b[1] - a[1]);
  const [primary, secondary] = sorted;
  const primaryData = ARCHETYPE_DATA[primary[0]];
  const secondaryData = ARCHETYPE_DATA[secondary[0]];
  const maxScore = Math.max(...Object.values(SAMPLE_SCORES));

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

          {/* Section: Complete Profile - compact bar chart */}
          <tr>
            <td style={{ padding: '0 24px' }}>
              <table cellPadding={0} cellSpacing={0} style={{ width: '100%', backgroundColor: '#f9fafb', borderRadius: '10px', overflow: 'hidden' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '16px 20px 8px', textAlign: 'center' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' as const, color: '#9ca3af' }}>Complete Financial Profile</span>
                    </td>
                  </tr>
                  {sorted.map(([name, score], index) => {
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
                                    <div style={{ width: `${(score / maxScore) * 100}%`, backgroundColor: data.barColor, height: '100%', borderRadius: '10px', opacity: index < 2 ? 1 : 0.55 }} />
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
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just discovered my money archetypes: ${primary[0]} & ${secondary[0]}! Take the WealthIQ Assessment to find yours.`)}`}
                        style={{ display: 'inline-block', padding: '10px 20px', borderRadius: '8px', backgroundColor: '#0f1419', color: '#ffffff', fontWeight: 600, fontSize: '12px', textDecoration: 'none', width: '100%', boxSizing: 'border-box' as const, textAlign: 'center' }}
                        data-testid="button-share-twitter"
                      >
                        Share on X
                      </a>
                    </td>
                    <td style={{ textAlign: 'center', paddingLeft: '6px', width: '50%' }}>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://wealthiq.app')}&summary=${encodeURIComponent(`I just discovered my money archetypes: ${primary[0]} & ${secondary[0]}! Take the WealthIQ Assessment to find yours.`)}`}
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
