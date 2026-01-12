import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, PieChart, Shield, Zap } from "lucide-react";

// Use a nice gradient overlay on a placeholder image
// Abstract geometric background with wealth-associated colors
const HERO_BG = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2000";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold text-xl">W</span>
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-primary">WealthIQ</span>
          </div>
          <Link href="/admin">
            <Button variant="ghost" size="sm">Coach Login</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/95 to-background z-10" />
          {/* Descriptive comment for Unsplash: Abstract financial growth background */}
          <img src={HERO_BG} alt="Abstract Background" className="w-full h-full object-cover opacity-20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-accent/10 text-accent font-semibold text-sm tracking-wide mb-6">
              The #1 Financial Personality Assessment
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 leading-tight">
              Discover Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
                Money Mindset
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Unlock the hidden psychological patterns driving your financial decisions. 
              Play the 3-minute card game to reveal your unique archetype.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/game">
                <Button size="lg" className="w-full sm:w-auto text-lg px-10 shadow-accent/20">
                  Start Assessment <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Zap className="w-8 h-8 text-accent" />,
                title: "Instant Insights",
                desc: "No long forms. Just swipe left or right to reveal your subconscious biases in minutes."
              },
              {
                icon: <PieChart className="w-8 h-8 text-accent" />,
                title: "Detailed Archetypes",
                desc: "Are you a Saver, Spender, or Investor? Get a breakdown of your unique profile."
              },
              {
                icon: <Shield className="w-8 h-8 text-accent" />,
                title: "Actionable Growth",
                desc: "Use your results to build better habits and achieve true financial freedom."
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="p-8 rounded-2xl bg-background border border-border/50 hover:shadow-xl hover:border-accent/30 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
