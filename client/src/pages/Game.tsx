import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuestions } from "@/hooks/use-game";
import { GameCard } from "@/components/game-card";
import { ProgressBar } from "@/components/progress-bar";
import { Timer } from "@/components/timer";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";

export default function Game() {
  const [_, setLocation] = useLocation();
  const { data: questions, isLoading, isError } = useQuestions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});

  // Reset scores on mount
  useEffect(() => {
    localStorage.removeItem("moneyMindsetResults");
  }, []);

  const handleSwipe = (direction: "left" | "right") => {
    if (!questions) return;
    
    const currentQuestion = questions[currentIndex];
    
    if (direction === "right") {
      setScores(prev => ({
        ...prev,
        [currentQuestion.category]: (prev[currentQuestion.category] || 0) + 1
      }));
    }

    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= questions.length) {
        const finalScores = direction === "right" 
          ? { ...scores, [currentQuestion.category]: (scores[currentQuestion.category] || 0) + 1 }
          : scores;
          
        localStorage.setItem("moneyMindsetResults", JSON.stringify(finalScores));
        setLocation("/results");
      } else {
        setCurrentIndex(nextIndex);
      }
    }, 200);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (isError || !questions) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">We couldn't load the assessment cards.</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-primary/5 rounded-b-[3rem] -z-0" />
      
      <div className="relative z-10 flex-1 flex flex-col max-w-lg mx-auto w-full px-4 pt-8 pb-12">
        <div className="text-center mb-6">
          <h2 className="text-xl font-display font-semibold text-primary mb-4">
            WealthIQ Assessment
          </h2>
          <ProgressBar current={currentIndex + 1} total={questions.length} />
        </div>

        <div className="flex justify-center mb-8">
          <Timer 
            duration={35} 
            onTimeUp={() => handleSwipe("left")} 
            resetKey={currentIndex} 
          />
        </div>

        <div className="flex-1 relative flex items-center justify-center min-h-[400px]">
          <AnimatePresence mode="wait">
            {currentQuestion && (
              <GameCard 
                key={currentQuestion.id} 
                question={currentQuestion} 
                onSwipe={handleSwipe} 
                active={true}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-between gap-6 px-4">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => handleSwipe("left")}
            className="flex-1 border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive"
            data-testid="button-disagree"
          >
            Disagree
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => handleSwipe("right")}
            className="flex-1 border-green-500/20 text-green-600 hover:bg-green-500/10 hover:border-green-500"
            data-testid="button-agree"
          >
            Agree
          </Button>
        </div>
        
        <p className="text-center text-xs text-muted-foreground mt-6 uppercase tracking-widest opacity-60">
          Decide quickly • No going back
        </p>
      </div>
    </div>
  );
}
