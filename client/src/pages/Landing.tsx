import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, PieChart, Shield, Zap } from "lucide-react";
import wealthIqLogo from "@assets/Screenshot_2026-03-03_at_10.30.37_AM_1772555440489.png";

// Use a nice gradient overlay on a placeholder image
// Abstract geometric background with wealth-associated colors
const HERO_BG = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2000";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <img src={wealthIqLogo} alt="WealthIQ - Conscious Prosperity" className="h-10" style={{ filter: 'invert(1) hue-rotate(180deg)' }} data-testid="img-logo" />
          </div>
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
              Play the 5-minute card game to reveal your unique archetype.
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-border/50 hover-elevate transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">36 Precise Cards</h3>
              <p className="text-muted-foreground text-sm">A fast-paced psychological assessment designed to reveal your core spending behavior in under 5 minutes.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-border/50 hover-elevate transition-all">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 text-accent">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Instant Blueprint</h3>
              <p className="text-muted-foreground text-sm">Receive a data-driven breakdown of your financial archetype with personalized strategic recommendations.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-border/50 hover-elevate transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Break Hidden Patterns</h3>
              <p className="text-muted-foreground text-sm">Uncover the subconscious beliefs shaping your financial life - the first step to lasting wealth transformation.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
