import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useCreateSubmission } from "@/hooks/use-game";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { 
  Loader2, Lock, Mail, Target, Zap, AlertTriangle, CheckCircle,
  TrendingUp, Shield, Heart, Sparkles, Compass, Wind, Send
} from "lucide-react";
import { SiX, SiLinkedin } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";

// Archetype definitions with motivation, superpowers, biases, and icon
const ARCHETYPES: Record<string, {
  motivation: string;
  superpowers: string;
  biases: string;
  color: string;
  icon: typeof TrendingUp;
  recommendations: string[];
}> = {
  "Strategists": {
    motivation: "Long-term success through structure & informed decisions",
    superpowers: "Long-term thinker, loves planning, efficient with resources",
    biases: "May overanalyze decisions, delay action until all the data is in",
    color: "bg-emerald-100 border-emerald-300 text-emerald-800",
    icon: TrendingUp,
    recommendations: [
      "Set a deadline for financial decisions to avoid analysis paralysis",
      "Build in a 'spontaneity fund' for unplanned opportunities",
      "Practice making smaller decisions quickly to build confidence"
    ]
  },
  "Givers": {
    motivation: "Community well-being through generosity",
    superpowers: "Deeply values people and purpose, community-oriented",
    biases: "Take on responsibilities that are not aligned with long-term goals",
    color: "bg-rose-100 border-rose-300 text-rose-800",
    icon: Heart,
    recommendations: [
      "Create a giving budget that protects your own financial security first",
      "Learn to say 'not right now' instead of always saying yes",
      "Set up automatic savings before allocating funds to help others"
    ]
  },
  "Adventurers": {
    motivation: "Seeking excitement, novelty, and freedom",
    superpowers: "Comfortable with risk, visionary, flexible thinker",
    biases: "Prone to impulsive decisions without considering trade offs",
    color: "bg-amber-100 border-amber-300 text-amber-800",
    icon: Compass,
    recommendations: [
      "Implement a 48-hour rule before major financial decisions",
      "Channel your risk tolerance into diversified investments",
      "Create adventure-specific savings to fund experiences responsibly"
    ]
  },
  "Guardians": {
    motivation: "Minimizing uncertainty and ensuring safety",
    superpowers: "Excellent at protecting stability and managing downside risk",
    biases: "Tends to avoid risks or underinvest in growth",
    color: "bg-teal-100 border-teal-300 text-teal-800",
    icon: Shield,
    recommendations: [
      "Set up a 'growth fund' separate from your emergency savings",
      "Start small with investments to build comfort with calculated risks",
      "Review your portfolio annually to ensure you're not being too conservative"
    ]
  },
  "Impressors": {
    motivation: "Enhancing self-worth through display",
    superpowers: "Great at branding, making things look and feel valuable",
    biases: "May spend based on external validation or comparison, rather than alignment",
    color: "bg-purple-100 border-purple-300 text-purple-800",
    icon: Sparkles,
    recommendations: [
      "Before purchases, ask: 'Would I buy this if no one would ever see it?'",
      "Create a 'values list' to check spending decisions against",
      "Redirect some 'impression spending' into wealth-building investments"
    ]
  },
  "Free Spirits": {
    motivation: "Enjoying life's flow and reducing anxiety",
    superpowers: "Intuitive, flow-based, values alignment over optimization",
    biases: "Avoids structure — often due to anxiety or rebellion",
    color: "bg-sky-100 border-sky-300 text-sky-800",
    icon: Wind,
    recommendations: [
      "Set up one automated transfer to savings — 'set it and forget it'",
      "Create a simple, visual spending tracker you'll actually enjoy using",
      "Schedule a quarterly 'money date' to check in without overwhelming yourself"
    ]
  }
};

export default function Results() {
  const [_, setLocation] = useLocation();
  const [scores, setScores] = useState<Record<string, number> | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [shareEmail, setShareEmail] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { mutate: submitResults, isPending } = useCreateSubmission();
  const { toast } = useToast();

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

  // Helper to render archetype card with icon
  const renderArchetypeCard = (archetype: [string, number], isPrimary: boolean) => {
    const [name, score] = archetype;
    const data = ARCHETYPES[name];
    if (!data) return null;
    const IconComponent = data.icon;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: isPrimary ? 0 : 0.2 }}
        className={`rounded-2xl border-2 p-6 md:p-8 ${data.color}`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold uppercase tracking-wider opacity-70">
            {isPrimary ? "Primary Archetype" : "Secondary Archetype"}
          </span>
          <span className="text-sm font-bold px-3 py-1 rounded-full bg-white/50">
            {score} cards
          </span>
        </div>
        
        {/* Icon and Name */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-white/60 flex items-center justify-center">
            <IconComponent className="w-7 h-7" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold">{name}</h2>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white/40 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5" />
              <span className="font-bold text-sm uppercase tracking-wide">Motivation</span>
            </div>
            <p className="text-sm leading-relaxed">{data.motivation}</p>
          </div>
          
          <div className="bg-white/40 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5" />
              <span className="font-bold text-sm uppercase tracking-wide">Superpowers</span>
            </div>
            <p className="text-sm leading-relaxed">{data.superpowers}</p>
          </div>
          
          <div className="bg-white/40 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-bold text-sm uppercase tracking-wide">Biases</span>
            </div>
            <p className="text-sm leading-relaxed">{data.biases}</p>
          </div>
        </div>
      </motion.div>
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

          {/* Strategic Recommendations */}
          <div className="bg-primary/5 p-6 rounded-xl border border-primary/10 mb-8">
            <h3 className="font-bold mb-4 text-primary flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Strategic Recommendations
            </h3>
            <ul className="space-y-4">
              {getRecommendations().map((rec, index) => (
                <li key={index} className="flex gap-3 bg-background/50 p-3 rounded-lg border border-border/50">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  <span className="text-sm leading-relaxed">{rec}</span>
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
            <h3 className="font-bold mb-4 text-center">Share Your Results</h3>
            
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

            {/* Email Sharing */}
            <div className="border-t border-border pt-6">
              <p className="text-sm text-muted-foreground text-center mb-3">
                Or send your results to yourself or someone else
              </p>
              <div className="flex gap-2 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter email address"
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
