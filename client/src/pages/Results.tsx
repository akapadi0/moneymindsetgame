import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useCreateSubmission } from "@/hooks/use-game";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, Lock, Mail, Target, Zap, AlertTriangle, CheckCircle, Share2, Send,
  Users, Flame, Copy
} from "lucide-react";
import { SiX, SiLinkedin } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";
import wealthIqLogo from "@assets/fulllogo_1772556379287.png";
import { Footer } from "@/components/footer";

// Import archetype images
import strategistImg from "@/assets/images/archetype-strategist.png";
import giverImg from "@/assets/images/archetype-giver.png";
import adventurerImg from "@/assets/images/archetype-adventurer.png";
import guardianImg from "@/assets/images/archetype-guardian.png";
import impressorImg from "@/assets/images/archetype-impressor.png";
import freespiritImg from "@/assets/images/archetype-freespirit.png";

// Archetype definitions with motivation, superpowers, biases, image, challenges, and growth insight
const ARCHETYPES: Record<string, {
  motivation: string;
  superpowers: string[];
  biases: string[];
  color: string;
  image: string;
  recommendations: string[];
  challenges: string[];
  growthInsight: string;
}> = {
  "Strategists": {
    motivation: "Long-term success through structure and intelligent planning",
    superpowers: [
      "Systems thinker",
      "Excellent capital allocator",
      "High discipline and patience"
    ],
    biases: [
      "Analysis paralysis",
      "Over-optimization of small variables",
      "Difficulty acting without full information"
    ],
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
    image: strategistImg,
    recommendations: [
      "Use decision frameworks instead of perfect data (e.g., 70% rule: act when 70% confident)",
      "Separate strategic decisions from tactical tweaks — not everything deserves deep analysis",
      "Build a personal \"risk budget\" for opportunities that don't fully fit the spreadsheet"
    ],
    challenges: [
      "Make one $5K+ decision this month with incomplete information",
      "Schedule a \"no optimization day\" where you intentionally do not research anything financial",
      "Delegate one financial task you normally insist on controlling"
    ],
    growthInsight: "Your biggest returns may come from speed and delegation, not better models."
  },
  "Givers": {
    motivation: "Community impact and supporting the people around them",
    superpowers: [
      "Deep empathy and loyalty",
      "Community builder",
      "Purpose-driven wealth"
    ],
    biases: [
      "Blurred financial boundaries",
      "Guilt around prioritizing personal wealth",
      "Becoming the default financial safety net"
    ],
    color: "bg-rose-50 border-rose-200 text-rose-700",
    image: giverImg,
    recommendations: [
      "Separate charity, family support, and investment — they are different tools",
      "Build a structured giving strategy (DAF, annual allocation, or legacy planning)",
      "Remember: sustainable generosity requires sustainable wealth"
    ],
    challenges: [
      "Decline one request this month without over-explaining",
      "Design a 10-year giving vision, not just reactive generosity",
      "Identify one area where your support may be preventing someone else's growth"
    ],
    growthInsight: "Your generosity becomes more powerful when it's intentional rather than reactive."
  },
  "Adventurers": {
    motivation: "Freedom, exploration, and bold opportunities",
    superpowers: [
      "High tolerance for uncertainty",
      "Opportunity spotting",
      "Energized by new ventures"
    ],
    biases: [
      "Overconfidence in intuition",
      "Concentrated bets",
      "Underestimating downside risk"
    ],
    color: "bg-amber-50 border-amber-200 text-amber-700",
    image: adventurerImg,
    recommendations: [
      "Use position sizing — even the best ideas shouldn't dominate your portfolio",
      "Balance adventure capital with compounding capital",
      "Create a system where curiosity is funded but not reckless"
    ],
    challenges: [
      "Write down the downside of your next big idea before acting",
      "Build a \"risk sandbox\" portfolio where experimentation is encouraged but capped",
      "Say no to one exciting opportunity this quarter"
    ],
    growthInsight: "Your edge isn't risk-taking — it's knowing which risks deserve your capital."
  },
  "Guardians": {
    motivation: "Security, stability, and protecting what has been built",
    superpowers: [
      "Excellent downside protection",
      "Strong contingency planning",
      "Long-term resilience"
    ],
    biases: [
      "Opportunity avoidance",
      "Excessive cash or low-risk allocations",
      "Overestimating worst-case scenarios"
    ],
    color: "bg-teal-50 border-teal-200 text-teal-700",
    image: guardianImg,
    recommendations: [
      "Separate true safety needs from emotional comfort",
      "Build a two-bucket mindset: protection capital vs growth capital",
      "Remember that inflation and stagnation are also risks"
    ],
    challenges: [
      "Increase one allocation toward long-term growth",
      "Review the opportunity cost of safety over the last decade",
      "Identify one financial risk that is actually manageable rather than dangerous"
    ],
    growthInsight: "The goal isn't avoiding risk — it's choosing the right risks."
  },
  "Impressors": {
    motivation: "Recognition, status, and signaling success",
    superpowers: [
      "Excellent personal branding",
      "Ability to influence and inspire",
      "Understands perception and value"
    ],
    biases: [
      "Lifestyle creep",
      "Comparison with elite peer groups",
      "Spending driven by external validation"
    ],
    color: "bg-violet-50 border-violet-200 text-violet-700",
    image: impressorImg,
    recommendations: [
      "Align spending with identity rather than audience",
      "Invest in assets that appreciate quietly while status depreciates loudly",
      "Build confidence in private wealth, not public display"
    ],
    challenges: [
      "Make one high-value purchase that no one will ever see",
      "Identify three ways your wealth can compound quietly",
      "Spend one month not upgrading anything"
    ],
    growthInsight: "The most powerful wealth signals are often invisible."
  },
  "Free Spirits": {
    motivation: "Living authentically and avoiding financial rigidity",
    superpowers: [
      "Intuitive decision-making",
      "Values-driven life design",
      "Low attachment to status or comparison"
    ],
    biases: [
      "Avoidance of financial structure",
      "Anxiety around money conversations",
      "Delegating too much without oversight"
    ],
    color: "bg-sky-50 border-sky-200 text-sky-700",
    image: freespiritImg,
    recommendations: [
      "Use minimalist financial systems (few accounts, automated flows)",
      "Work with advisors or partners who translate complexity into simplicity",
      "Think of structure as guardrails that preserve freedom"
    ],
    challenges: [
      "Define three financial values that guide your decisions",
      "Spend 15 minutes reviewing your net worth without judgment",
      "Create one simple financial rule that protects your freedom"
    ],
    growthInsight: "A small amount of structure can protect a lifetime of freedom."
  }
};

export default function Results() {
  const [_, setLocation] = useLocation();
  const [scores, setScores] = useState<Record<string, number> | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [cardsRevealed, setCardsRevealed] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [shareEmail, setShareEmail] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { mutate: submitResults, isPending } = useCreateSubmission();
  const { toast } = useToast();

  // Trigger card reveal animation after unlock
  useEffect(() => {
    if (isUnlocked && !cardsRevealed) {
      const timer = setTimeout(() => {
        setCardsRevealed(true);
      }, 400); // Quick delay then flip
      return () => clearTimeout(timer);
    }
  }, [isUnlocked, cardsRevealed]);

  useEffect(() => {
    const saved = localStorage.getItem("moneyMindsetResults");
    if (!saved) {
      setLocation("/game");
      return;
    }
    setScores(JSON.parse(saved));
  }, [setLocation]);

  const handleSubmit = () => {
    if (!scores || !formData.name || !formData.email) return;

    // Unlock immediately — don't gate on API response
    setIsUnlocked(true);
    toast({ title: "Results Unlocked!", description: "Check your email for your full report." });

    // Submit in background for email delivery
    submitResults({ ...formData, results: scores });
  };

  if (!scores) return null;

  // Get top 2 archetypes sorted by score
  const sortedArchetypes = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);
  
  const [primaryArchetype, secondaryArchetype] = sortedArchetypes;

  // Helper to render archetype card with flip animation
  const renderArchetypeCard = (archetype: [string, number], isPrimary: boolean) => {
    const [name] = archetype;
    const data = ARCHETYPES[name];
    if (!data) return null;

    return (
      <div className="perspective-1000 h-full">
        <motion.div 
          initial={{ rotateY: 0 }}
          animate={{ rotateY: cardsRevealed ? 180 : 0 }}
          transition={{ 
            duration: 0.6, 
            delay: isPrimary ? 0.1 : 0.25,
            ease: "easeOut"
          }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative h-full"
        >
          {/* Card Back - Pattern Design */}
          <div 
            className={`absolute inset-0 rounded-2xl border-2 border-primary/20 p-4 md:p-6 ${isPrimary ? 'bg-emerald-50' : 'bg-rose-50'}`}
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="w-full h-full rounded-xl border border-primary/10 flex items-center justify-center relative overflow-hidden">
              {/* Decorative pattern - circles */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-4 left-4 w-16 h-16 rounded-full border-2 border-primary/30" />
                <div className="absolute top-8 right-8 w-12 h-12 rounded-full border-2 border-accent/30" />
                <div className="absolute bottom-6 left-1/4 w-20 h-20 rounded-full border-2 border-primary/20" />
                <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full border-2 border-accent/40" />
                <div className="absolute top-1/3 left-1/2 w-8 h-8 rounded-full border-2 border-primary/25" />
                <div className="absolute bottom-1/3 right-1/3 w-14 h-14 rounded-full border-2 border-accent/20" />
              </div>
              {/* Decorative lines */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
                <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-accent/40 to-transparent" />
                <div className="absolute left-0 top-1/3 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="absolute left-0 bottom-1/4 w-full h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
              </div>
            </div>
          </div>

          {/* Card Front - Archetype Content */}
          <div 
            className={`rounded-2xl border-2 p-5 md:p-6 ${data.color} h-full`}
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            {/* Header row: Label + Name/Icon */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden p-1.5 flex-shrink-0">
                  <img src={data.image} alt={name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-black/50 block">
                    {isPrimary ? "Primary Archetype" : "Secondary Archetype"}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-black">{name}</h2>
                </div>
              </div>
            </div>
            
            {/* Content: 3 boxes - horizontal on desktop, vertical on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1.5 text-black">
                  <Target className="w-4 h-4 text-indigo-500" />
                  <span className="font-bold text-xs uppercase tracking-wide">Motivation</span>
                </div>
                <p className="text-xs leading-relaxed text-black/80">{data.motivation}</p>
              </div>

              <div className="bg-white rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1.5 text-black">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-xs uppercase tracking-wide">Superpowers</span>
                </div>
                <ul className="space-y-1">
                  {data.superpowers.map((s, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-black/80">
                      <span className="text-amber-500 mt-0.5">✦</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1.5 text-black">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span className="font-bold text-xs uppercase tracking-wide">Biases</span>
                </div>
                <ul className="space-y-1">
                  {data.biases.map((b, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-black/80">
                      <span className="text-rose-400 mt-0.5">▲</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Growth Insight */}
            <div className="mt-3 bg-white/70 rounded-xl px-4 py-2.5 border border-black/10">
              <p className="text-xs text-black/70 italic text-center">
                <span className="font-semibold not-italic text-black/50 uppercase tracking-wide text-[10px] mr-2">Growth Insight</span>
                {data.growthInsight}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // Get combined recommendations from top 2 archetypes
  const getRecommendations = () => {
    const recs: string[] = [];
    if (primaryArchetype) {
      const data = ARCHETYPES[primaryArchetype[0]];
      if (data) recs.push(...data.recommendations.slice(0, 2));
    }
    if (secondaryArchetype) {
      const data = ARCHETYPES[secondaryArchetype[0]];
      if (data) recs.push(data.recommendations[0]);
    }
    return recs;
  };

  // Get challenges based on top 2 archetypes
  const getChallenges = () => {
    const challenges: string[] = [];
    if (primaryArchetype) {
      const data = ARCHETYPES[primaryArchetype[0]];
      if (data) challenges.push(...data.challenges.slice(0, 2));
    }
    if (secondaryArchetype) {
      const data = ARCHETYPES[secondaryArchetype[0]];
      if (data) challenges.push(data.challenges[0]);
    }
    return challenges;
  };

  // Generate compatibility link
  const getCompatibilityLink = () => {
    return `${window.location.origin}/game?compare=${encodeURIComponent(JSON.stringify({ 
      name: formData.name, 
      archetypes: [primaryArchetype?.[0], secondaryArchetype?.[0]] 
    }))}`;
  };

  const copyCompatibilityLink = async () => {
    try {
      await navigator.clipboard.writeText(getCompatibilityLink());
      toast({ 
        title: "Link Copied!", 
        description: "Share this link with someone to compare money mindsets." 
      });
    } catch (err) {
      toast({ 
        title: "Could not copy link", 
        description: "Please try again or manually copy the link.",
        variant: "destructive"
      });
    }
  };

  // Handle sharing results via email
  const handleEmailShare = async () => {
    if (!shareEmail) {
      toast({ title: "Enter an email", description: "Please enter an email address to share results.", variant: "destructive" });
      return;
    }
    setIsSendingEmail(true);
    try {
      const sorted = Object.entries(scores ?? {}).sort((a, b) => b[1] - a[1]);
      const [primary, secondary] = sorted;

      const textBody = [
        "Money Mindset Assessment Results",
        "",
        `Primary Archetype:   ${primary?.[0]}`,
        `Secondary Archetype: ${secondary?.[0]}`,
        "",
        "Full Breakdown:",
        ...sorted.map(([cat, score]) => `• ${cat}: ${score}`),
        "",
        "Take the assessment at: " + window.location.origin,
      ].join("\n");

      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <h2>Money Mindset Assessment Results</h2>
          <p><strong>Primary:</strong> ${primary?.[0]}</p>
          <p><strong>Secondary:</strong> ${secondary?.[0]}</p>
          <h3>Full Breakdown</h3>
          <ul>${sorted.map(([cat, score]) => `<li><strong>${cat}:</strong> ${score}</li>`).join("")}</ul>
          <p><a href="${window.location.origin}">Take the assessment yourself →</a></p>
        </div>
      `;

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmails: [shareEmail, "hello@wealthiqco.com"],
          subject: "My WealthIQ Money Mindset Results",
          textBody,
          htmlBody,
        }),
      });

      if (!response.ok) throw new Error("Email send failed");

      setShareEmail("");
      toast({ title: "Results Sent!", description: `Your results have been shared with ${shareEmail}` });
    } catch {
      toast({ title: "Error", description: "Failed to send email. Please try again.", variant: "destructive" });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      
      {/* Content Layer - Subtle blur when locked, still visible as preview */}
      <div className={`transition-all duration-500 ${!isUnlocked ? 'filter blur-sm opacity-60 pointer-events-none' : ''}`}>
        <div className="max-w-4xl mx-auto px-4 py-12">
          
          {/* Header */}
          <div className="text-center mb-12">
            <img src={wealthIqLogo} alt="WealthIQ - Conscious Prosperity" className="h-20 mix-blend-multiply mx-auto mb-6" data-testid="img-logo-results" />
            <h1 className="text-4xl font-display font-bold mb-2">Your Money Mindset</h1>
            <p className="text-muted-foreground">Analysis based on your 36 responses</p>
          </div>

          {/* Top 2 Archetypes - stacked for better horizontal content */}
          <div className="space-y-6 mb-12">
            {primaryArchetype && renderArchetypeCard(primaryArchetype, true)}
            {secondaryArchetype && renderArchetypeCard(secondaryArchetype, false)}
          </div>

          {/* Strategic Recommendations & Challenges - Side by Side */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Strategic Recommendations */}
            <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
              <h3 className="font-bold mb-4 text-primary flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Strategic Recommendations
              </h3>
              <ul className="space-y-3">
                {getRecommendations().map((rec, index) => (
                  <li key={index} className="flex gap-3 bg-background/50 p-3 rounded-lg border border-border/50">
                    <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Challenge Yourself */}
            <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
              <h3 className="font-bold mb-4 text-primary flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                Challenge Yourself
              </h3>
              <ul className="space-y-3">
                {getChallenges().map((challenge, index) => (
                  <li key={index} className="flex gap-3 bg-background/50 p-3 rounded-lg border border-border/50">
                    <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-sm leading-relaxed">{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Full Results Notice */}
          <div className="bg-card rounded-xl border border-border p-6 mb-8 text-center">
            <Mail className="w-8 h-8 mx-auto mb-3 text-rose-500" />
            <h3 className="font-bold mb-2">Full Results Sent to Your Email</h3>
            <p className="text-sm text-muted-foreground">
              Check your inbox for a detailed breakdown of all 6 archetypes, including your complete score analysis.
            </p>
          </div>

          {/* Share Section */}
          <div className="bg-card rounded-xl border border-border p-6 mb-8">
            <h3 className="font-bold mb-6 text-center flex items-center justify-center gap-2">
              <Share2 className="w-5 h-5 text-violet-500" />
              Share Your Blueprint
            </h3>
            
            {/* Social Sharing - Centered */}
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              <Button 
                variant="outline" 
                onClick={() => {
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
                  const xComboKey = `${primaryArchetype?.[0]}+${secondaryArchetype?.[0]}`;
                  const text = xPosts[xComboKey] || "Took the WealthIQ assessment — it reveals your money personality based on how you actually think about money.\n\nThe blind spots were the real surprise.\n\nWhat's yours?";
                  const url = window.location.origin;
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                }}
                data-testid="button-share-twitter"
                className="gap-2"
              >
                <SiX className="w-4 h-4 text-foreground" />
                Share on X
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
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
                  const comboKey = `${primaryArchetype?.[0]}+${secondaryArchetype?.[0]}`;
                  const linkedInText = linkedInPosts[comboKey] || `💡 I just took the WealthIQ Money Mindset Assessment\n\nIt breaks down your money personality — the patterns behind how you earn, save, spend, and invest.\n\n━━━━━━━━━━━━\n🔍 My result?\n━━━━━━━━━━━━\n\nI discovered something surprising about my relationship with money.\n\nThe blind spots were the real eye-opener.\n\n💬 What's yours?`;
                  const url = window.location.origin;
                  const fullText = `${linkedInText}\n\n${url}`;
                  window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(fullText)}`, '_blank');
                }}
                data-testid="button-share-linkedin"
                className="gap-2"
              >
                <SiLinkedin className="w-4 h-4 text-[#0A66C2]" />
                Share on LinkedIn
              </Button>
            </div>

            {/* Two Column Layout for Invite & Email */}
            <div className="grid md:grid-cols-2 gap-6 border-t border-border pt-6">
              {/* Invite to Compare */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Invite someone such as a partner, spouse, or family member to take the quiz and compare
                </p>
                <Button 
                  variant="outline" 
                  onClick={copyCompatibilityLink}
                  className="gap-2"
                  data-testid="button-copy-compatibility"
                >
                  <Users className="w-4 h-4 text-cyan-500" />
                  Copy Quiz Invite Link
                </Button>
              </div>

              {/* Send Results via Email */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Send results to someone such as a friend, family member, or financial advisor
                </p>
                <div className="flex gap-2 max-w-sm mx-auto">
                  <Input
                    type="email"
                    placeholder="Their email"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    className="flex-1"
                    data-testid="input-share-email"
                  />
                  <Button 
                    onClick={handleEmailShare}
                    disabled={isSendingEmail}
                    data-testid="button-send-email"
                    className="gap-2"
                  >
                    {isSendingEmail ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 text-emerald-500" />
                    )}
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Final Step Overlay - Feels like completion, not a gate */}
      {!isUnlocked && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-card w-full max-w-md relative z-10 rounded-2xl shadow-2xl border border-border p-6 sm:p-8 mb-4 sm:mb-0"
          >
            {/* Success indicator */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-emerald-600">Assessment Complete</span>
            </div>
            
            <h2 className="text-2xl font-display font-bold text-center mb-2">Almost There!</h2>
            <p className="text-center text-muted-foreground mb-6">
              Enter your details to reveal your personalized Money Mindset and receive a copy via email.
            </p>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground ml-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  data-testid="input-full-name"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    data-testid="input-email"
                  />
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full h-12 text-base mt-2"
                disabled={!formData.name || !formData.email}
                data-testid="button-reveal-results"
              >
                Reveal My Money Mindset
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
