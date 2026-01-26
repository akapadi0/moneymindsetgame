import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useCreateSubmission } from "@/hooks/use-game";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Loader2, Lock, Mail, Target, Zap, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Archetype definitions with motivation, superpowers, and biases
const ARCHETYPES: Record<string, {
  motivation: string;
  superpowers: string;
  biases: string;
  color: string;
}> = {
  "Strategists": {
    motivation: "Long-term success through structure & informed decisions",
    superpowers: "Long-term thinker, loves planning, efficient with resources",
    biases: "May overanalyze decisions, delay action until all the data is in",
    color: "bg-emerald-100 border-emerald-300 text-emerald-800"
  },
  "Givers": {
    motivation: "Community well-being through generosity",
    superpowers: "Deeply values people and purpose, community-oriented",
    biases: "Take on responsibilities that are not aligned with long-term goals",
    color: "bg-rose-100 border-rose-300 text-rose-800"
  },
  "Adventurers": {
    motivation: "Seeking excitement, novelty, and freedom",
    superpowers: "Comfortable with risk, visionary, flexible thinker",
    biases: "Prone to impulsive decisions without considering trade offs",
    color: "bg-amber-100 border-amber-300 text-amber-800"
  },
  "Guardians": {
    motivation: "Minimizing uncertainty and ensuring safety",
    superpowers: "Excellent at protecting stability and managing downside risk",
    biases: "Tends to avoid risks or underinvest in growth",
    color: "bg-teal-100 border-teal-300 text-teal-800"
  },
  "Impressors": {
    motivation: "Enhancing self-worth through display",
    superpowers: "Great at branding, making things look and feel valuable",
    biases: "May spend based on external validation or comparison, rather than alignment",
    color: "bg-purple-100 border-purple-300 text-purple-800"
  },
  "Free Spirits": {
    motivation: "Enjoying life's flow and reducing anxiety",
    superpowers: "Intuitive, flow-based, values alignment over optimization",
    biases: "Avoids structure — often due to anxiety or rebellion",
    color: "bg-sky-100 border-sky-300 text-sky-800"
  }
};

export default function Results() {
  const [_, setLocation] = useLocation();
  const [scores, setScores] = useState<Record<string, number> | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ name: "", email: "" });
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

  // Helper to render archetype card
  const renderArchetypeCard = (archetype: [string, number], isPrimary: boolean) => {
    const [name, score] = archetype;
    const data = ARCHETYPES[name];
    if (!data) return null;

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
        
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">{name}</h2>
        
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

  return (
    <div className="min-h-screen bg-background relative">
      
      {/* Content Layer - Blurred when locked */}
      <div className={`transition-all duration-500 ${!isUnlocked ? 'filter blur-lg opacity-30 pointer-events-none' : ''}`}>
        <div className="max-w-4xl mx-auto px-4 py-12">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold mb-2">Your Money Mindset</h1>
            <p className="text-muted-foreground">Your top 2 archetypes based on 36 responses</p>
          </div>

          {/* Top 2 Archetypes */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {primaryArchetype && renderArchetypeCard(primaryArchetype, true)}
            {secondaryArchetype && renderArchetypeCard(secondaryArchetype, false)}
          </div>

          {/* Full Results Notice */}
          <div className="bg-card rounded-xl border border-border p-6 mb-8 text-center">
            <Mail className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-bold mb-2">Full Results Sent to Your Email</h3>
            <p className="text-sm text-muted-foreground">
              Check your inbox for a detailed breakdown of all 6 archetypes, including your complete score analysis and personalized recommendations.
            </p>
          </div>

          {/* Share & Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => {
                const text = `My top money archetypes are ${primaryArchetype?.[0]} and ${secondaryArchetype?.[0]}! Take the WealthIQ Assessment to find yours.`;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
              }}
              data-testid="button-share-twitter"
            >
              Share on X
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast({ title: "Link Copied", description: "Share your results with others!" });
              }}
              data-testid="button-copy-link"
            >
              Copy Link
            </Button>
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
