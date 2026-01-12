import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useCreateSubmission } from "@/hooks/use-game";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Loader2, Lock, CheckCircle, Mail } from "lucide-react";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from "recharts";
import { useToast } from "@/hooks/use-toast";

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
          toast({ title: "Results Unlocked!", description: "Welcome to your financial profile." });
        },
        onError: (err) => {
          toast({ title: "Error", description: err.message, variant: "destructive" });
        }
      }
    );
  };

  if (!scores) return null;

  // Transform scores for Recharts
  const chartData = Object.entries(scores).map(([category, value]) => ({
    subject: category,
    A: value,
    fullMark: 10 // Assuming max 10 per category roughly
  }));

  // Find Archetype
  const topArchetype = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b, ["Unknown", 0]);

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

          {/* Archetype Card */}
          <div className="bg-card rounded-2xl shadow-xl p-8 mb-12 border border-border/50">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <span className="text-sm font-semibold text-accent uppercase tracking-wider mb-2 block">Primary Archetype</span>
                <h2 className="text-5xl font-display font-bold text-primary mb-4">{topArchetype[0]}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your dominant style indicates a strong focus on stability and future planning. 
                  You likely find comfort in watching your savings grow but may struggle with 
                  spending on experiences that bring joy in the present moment.
                </p>
              </div>
              <div className="w-full md:w-1/3 aspect-square relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                    <Radar
                      name="Profile"
                      dataKey="A"
                      stroke="hsl(160, 40%, 30%)"
                      strokeWidth={3}
                      fill="hsl(160, 40%, 30%)"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
              <h3 className="font-bold mb-6">Category Breakdown</h3>
              <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="subject" type="category" width={80} tick={{ fontSize: 12 }} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="A" radius={[0, 4, 4, 0]} barSize={24}>
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "hsl(160, 40%, 30%)" : "hsl(35, 70%, 50%)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
              <h3 className="font-bold mb-4 text-primary">Recommendations</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Set up a "Fun Fund" to practice guilt-free spending on experiences.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Automate your investments to reduce decision fatigue.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Schedule a quarterly review to align spending with core values.</span>
                </li>
              </ul>
              <Button className="w-full mt-6" variant="outline">Book Coaching Session</Button>
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
