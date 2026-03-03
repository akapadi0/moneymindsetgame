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
  const [answerHistory, setAnswerHistory] = useState<Array<{ category: string; direction: "left" | "right" }>>([]);
  const [timerKey, setTimerKey] = useState(0);
  const [timerWarning, setTimerWarning] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  // Reset scores on mount
  useEffect(() => {
    localStorage.removeItem("moneyMindsetResults");
  }, []);

  const handleTimeUp = () => {
    setShowPrompt(true);
  };

  const handlePromptChoice = (direction: "left" | "right") => {
    setShowPrompt(false);
    handleSwipe(direction);
  };

  const handleSwipe = (direction: "left" | "right") => {
    if (!questions) return;
    setShowPrompt(false);
    
    const currentQuestion = questions[currentIndex];
    
    // Track this answer in history
    setAnswerHistory(prev => [
      ...prev.slice(0, currentIndex),
      { category: currentQuestion.category, direction }
    ]);
    
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
      
      {/* Pause & Prompt Overlay - shown when timer hits 0 */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            data-testid="prompt-overlay"
          >
            <motion.div 
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center"
            >
              <Clock className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-foreground mb-1">Time's up!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Please make a choice to continue
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700" 
                  onClick={() => handlePromptChoice("left")}
                  data-testid="button-prompt-disagree"
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Disagree
                </Button>
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white" 
                  onClick={() => handlePromptChoice("right")}
                  data-testid="button-prompt-agree"
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Agree
                </Button>
              </div>
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
            onTimeUp={handleTimeUp}
            resetKey={`${currentIndex}-${timerKey}`}
            onWarning={setTimerWarning}
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
                timerWarning={timerWarning}
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
