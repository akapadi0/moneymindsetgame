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

// Import archetype images
import strategistImg from "@/assets/images/archetype-strategist.png";
import giverImg from "@/assets/images/archetype-giver.png";
import adventurerImg from "@/assets/images/archetype-adventurer.png";
import guardianImg from "@/assets/images/archetype-guardian.png";
import impressorImg from "@/assets/images/archetype-impressor.png";
import freespiritImg from "@/assets/images/archetype-freespirit.png";

// Archetype definitions with motivation, superpowers, biases, image, and challenges
const ARCHETYPES: Record<string, {
  motivation: string;
  superpowers: string;
  biases: string;
  color: string;
  image: string;
  recommendations: string[];
  challenges: string[];
}> = {
  "Strategists": {
    motivation: "Long-term success through structure & informed decisions",
    superpowers: "Long-term thinker, loves planning, efficient with resources",
    biases: "May overanalyze decisions, delay action until all the data is in",
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
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
    color: "bg-rose-50 border-rose-200 text-rose-700",
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
    color: "bg-amber-50 border-amber-200 text-amber-700",
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
    color: "bg-teal-50 border-teal-200 text-teal-700",
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
    color: "bg-violet-50 border-violet-200 text-violet-700",
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
    color: "bg-sky-50 border-sky-200 text-sky-700",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scores) return;
    
    submitResults(
      { ...formData, results: scores },
      {
        onSuccess: () => {
          setIsUnlocked(true);
          toast({ title: "Results Unlocked!", description: "Check your email for your full report." });
        },
        onError: (err) => {
          toast({ title: "Error", description: err.message, variant: "destructive" });
        }
      }
    );
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
            className="absolute inset-0 rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/20 p-6 md:p-8 flex flex-col items-center justify-center"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="w-full h-full rounded-xl border-2 border-dashed border-primary/20 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-4xl font-display font-bold text-primary/40">W</span>
                </div>
                <p className="text-sm font-semibold text-primary/40 uppercase tracking-widest">
                  {isPrimary ? "Primary" : "Secondary"}
                </p>
              </div>
            </div>
          </div>

          {/* Card Front - Archetype Content */}
          <div 
            className={`rounded-2xl border-2 p-6 md:p-8 ${data.color} h-full`}
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="mb-4">
              <span className="text-sm font-semibold uppercase tracking-wider opacity-70">
                {isPrimary ? "Primary Archetype" : "Secondary Archetype"}
              </span>
            </div>
            
            {/* Image and Name */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center overflow-hidden p-2">
                <img src={data.image} alt={name} className="w-full h-full object-contain" />
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold">{name}</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/60 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5" />
                  <span className="font-bold text-sm uppercase tracking-wide">Motivation</span>
                </div>
                <p className="text-sm leading-relaxed">{data.motivation}</p>
              </div>
              
              <div className="bg-white/60 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5" />
                  <span className="font-bold text-sm uppercase tracking-wide">Superpowers</span>
                </div>
                <p className="text-sm leading-relaxed">{data.superpowers}</p>
              </div>
              
              <div className="bg-white/60 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-bold text-sm uppercase tracking-wide">Biases</span>
                </div>
                <p className="text-sm leading-relaxed">{data.biases}</p>
              </div>
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
    // Simulate sending (in production, this would call an API)
    setTimeout(() => {
      setIsSendingEmail(false);
      setShareEmail("");
      toast({ title: "Results Sent!", description: `Your results have been shared with ${shareEmail}` });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background relative">
      
      {/* Content Layer - Blurred when locked */}
      <div className={`transition-all duration-500 ${!isUnlocked ? 'filter blur-lg opacity-30 pointer-events-none' : ''}`}>
        <div className="max-w-4xl mx-auto px-4 py-12">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold mb-2">Your Financial Blueprint</h1>
            <p className="text-muted-foreground">Analysis based on your 36 responses</p>
          </div>

          {/* Top 2 Archetypes */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {primaryArchetype && renderArchetypeCard(primaryArchetype, true)}
            {secondaryArchetype && renderArchetypeCard(secondaryArchetype, false)}
          </div>

          {/* Strategic Recommendations & Challenges */}
          <div className="bg-primary/5 p-6 rounded-xl border border-primary/10 mb-8">
            <h3 className="font-bold mb-4 text-primary flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Strategic Recommendations
            </h3>
            <ul className="space-y-4 mb-8">
              {getRecommendations().map((rec, index) => (
                <li key={index} className="flex gap-3 bg-background/50 p-3 rounded-lg border border-border/50">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  <span className="text-sm leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>

            {/* Challenge Yourself - Same section, different heading */}
            <h3 className="font-bold mb-4 text-primary flex items-center gap-2">
              <Flame className="w-5 h-5" />
              Challenge Yourself
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Based on your unique blueprint, here are personalized challenges to help you grow:
            </p>
            <ul className="space-y-4">
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

          {/* Full Results Notice */}
          <div className="bg-card rounded-xl border border-border p-6 mb-8 text-center">
            <Mail className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-bold mb-2">Full Results Sent to Your Email</h3>
            <p className="text-sm text-muted-foreground">
              Check your inbox for a detailed breakdown of all 6 archetypes, including your complete score analysis.
            </p>
          </div>

          {/* Share Section */}
          <div className="bg-card rounded-xl border border-border p-6 mb-8">
            <h3 className="font-bold mb-4 text-center flex items-center justify-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              Share Your Blueprint
            </h3>
            
            {/* Social Sharing */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  const text = `I just discovered my money archetypes: ${primaryArchetype?.[0]} & ${secondaryArchetype?.[0]}! Take the WealthIQ Assessment to find yours.`;
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
                }}
                data-testid="button-share-twitter"
                className="gap-2"
              >
                <SiX className="w-4 h-4" />
                Share on X
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  const text = `I just discovered my money archetypes: ${primaryArchetype?.[0]} & ${secondaryArchetype?.[0]}! Take the WealthIQ Assessment to find yours.`;
                  const url = window.location.origin;
                  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`, '_blank');
                }}
                data-testid="button-share-linkedin"
                className="gap-2"
              >
                <SiLinkedin className="w-4 h-4" />
                Share on LinkedIn
              </Button>
            </div>

            {/* Compatibility Link */}
            <div className="border-t border-border pt-6 mb-6">
              <p className="text-sm text-muted-foreground text-center mb-3">
                Compare money mindsets with a partner, friend, or family member
              </p>
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={copyCompatibilityLink}
                  className="gap-2"
                  data-testid="button-copy-compatibility"
                >
                  <Users className="w-4 h-4" />
                  Copy Compatibility Link
                </Button>
              </div>
            </div>

            {/* Email Sharing */}
            <div className="border-t border-border pt-6">
              <p className="text-sm text-muted-foreground text-center mb-3">
                Send your blueprint to family, friends, or a financial advisor
              </p>
              <div className="flex gap-2 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter their email address"
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
                    <Send className="w-4 h-4" />
                  )}
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lock Overlay */}
      {!isUnlocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card w-full max-w-md relative z-10 rounded-2xl shadow-2xl border border-border p-8"
          >
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-accent" />
            </div>
            
            <h2 className="text-2xl font-display font-bold text-center mb-2">Your Results Are Ready</h2>
            <p className="text-center text-muted-foreground mb-8">
              Enter your details below to unlock your personalized archetype report and recommendations.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Full Name</label>
                <input 
                  required
                  type="text"
                  placeholder="Jane Doe"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input 
                    required
                    type="email"
                    placeholder="jane@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-lg mt-2" 
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin w-5 h-5" /> Analyzing...
                  </span>
                ) : (
                  "Unlock My Results"
                )}
              </Button>
            </form>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              We respect your privacy. No spam, ever.
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
