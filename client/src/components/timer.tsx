import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  resetKey: any;
}

export function Timer({ duration, onTimeUp, resetKey }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const onTimeUpRef = useRef(onTimeUp);
  const hasCalledRef = useRef(false);
  
  // Keep callback ref updated
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // Reset timer when resetKey changes
  useEffect(() => {
    setTimeLeft(duration);
    hasCalledRef.current = false;
  }, [resetKey, duration]);

  // Countdown effect
  useEffect(() => {
    if (timeLeft <= 0) {
      if (!hasCalledRef.current) {
        hasCalledRef.current = true;
        onTimeUpRef.current();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const percentage = (timeLeft / duration) * 100;
  const isUrgent = timeLeft <= 5;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-muted/20"
          />
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray="175.9"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: 175.9 * (1 - timeLeft / duration) }}
            className={isUrgent ? "text-destructive" : "text-primary"}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center font-bold text-lg ${isUrgent ? "text-destructive" : "text-primary"}`}>
          {timeLeft}
        </div>
      </div>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Seconds Left</span>
    </div>
  );
}
