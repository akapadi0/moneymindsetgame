import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuestions } from "@/hooks/use-game";
import { GameCard } from "@/components/game-card";
import { ProgressBar } from "@/components/progress-bar";
import { Timer } from "@/components/timer";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, AlertCircle, Undo2, Clock, ThumbsDown, ThumbsUp } from "lucide-react";


export default function Game() {
  const [_, setLocation] = useLocation();
  const { data: questions, isLoading, isError } = useQuestions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [answerHistory, setAnswerHistory] = useState<Array<{ category: string; direction: "left" | "right" | "timeout" }>>([]);
  const [timerKey, setTimerKey] = useState(0);
  const [showTimeoutFlash, setShowTimeoutFlash] = useState(false);

  // Reset scores on mount
  useEffect(() => {
    localStorage.removeItem("moneyMindsetResults");
  }, []);

  const handleSwipe = (direction: "left" | "right", isTimeout = false) => {
    if (!questions) return;
    
    const currentQuestion = questions[currentIndex];
    
    // Show timeout flash if time ran out
    if (isTimeout) {
      setShowTimeoutFlash(true);
      setTimeout(() => setShowTimeoutFlash(false), 800);
    }
    
    // Track this answer in history
    setAnswerHistory(prev => [
      ...prev.slice(0, currentIndex), // Replace any future history if going back
      { category: currentQuestion.category, direction: isTimeout ? "timeout" : direction }
    ]);
    
    if (direction === "right") {
      setScores(prev => ({
        ...prev,
        [currentQuestion.category]: (prev[currentQuestion.category] || 0) + 1
      }));
    }

    // Delay slightly longer for timeout to show flash
    const delay = isTimeout ? 600 : 200;
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
    }, delay);
  };

  const handleGoBack = () => {
    if (currentIndex === 0 || !questions) return;
    
    const prevIndex = currentIndex - 1;
    const prevAnswer = answerHistory[prevIndex];
    
    // If previous answer was "right" (agree), undo that score
    if (prevAnswer && prevAnswer.direction === "right") {
      setScores(prev => ({
        ...prev,
        [prevAnswer.category]: Math.max(0, (prev[prevAnswer.category] || 0) - 1)
      }));
    }
    
    // Remove that answer from history so they can re-answer
    setAnswerHistory(prev => prev.slice(0, prevIndex));
    setCurrentIndex(prevIndex);
    setTimerKey(prev => prev + 1); // Reset timer for the question
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
      
      {/* Timeout Flash Overlay */}
      <AnimatePresence>
        {showTimeoutFlash && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-amber-500/20 z-50 flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-6 shadow-xl flex items-center gap-3"
            >
              <Clock className="w-8 h-8 text-amber-500" />
              <span className="text-lg font-bold text-amber-700">Time's up! Moving on...</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative z-10 flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-4">
        {/* Header */}
        <div className="text-center mb-2">

          <ProgressBar current={currentIndex + 1} total={questions.length} />
        </div>

        <div className="flex justify-center mb-2">
          <Timer 
            duration={35} 
            onTimeUp={() => handleSwipe("left", true)} 
            resetKey={`${currentIndex}-${timerKey}`} 
          />
        </div>

        {/* Swipe instruction - above card */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <motion.div 
            animate={{ x: [-5, 0, -5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-destructive/60 text-lg"
          >
            ←
          </motion.div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
            Swipe or tap to answer
          </p>
          <motion.div 
            animate={{ x: [5, 0, 5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-green-600/60 text-lg"
          >
            →
          </motion.div>
        </div>

        {/* Card container */}
        <div className="w-full">
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

        {/* Action buttons */}
        <div className="mt-12 flex justify-center gap-4 w-full">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => handleSwipe("left")}
            className="flex-1 border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive gap-2"
            data-testid="button-disagree"
          >
            <ThumbsDown className="w-4 h-4" />
            Disagree
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => handleSwipe("right")}
            className="flex-1 border-green-500/20 text-green-600 hover:bg-green-500/10 hover:border-green-500 gap-2"
            data-testid="button-agree"
          >
            Agree
            <ThumbsUp className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Go Back button - below action buttons */}
        <div className="mt-3 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            disabled={currentIndex === 0}
            className="gap-2 text-muted-foreground hover:text-primary"
            data-testid="button-go-back"
          >
            <Undo2 className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
