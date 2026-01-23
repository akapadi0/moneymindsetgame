import { motion, PanInfo, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Question } from "@shared/schema";
import { CheckCircle, XCircle, ArrowLeftRight } from "lucide-react";

interface GameCardProps {
  question: Question;
  onSwipe: (direction: "left" | "right") => void;
  active: boolean;
  showTutorial?: boolean;
}

export function GameCard({ question, onSwipe, active, showTutorial }: GameCardProps) {
  // Motion values for drag interaction
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  // Visual indicators based on drag position
  const rightOpacity = useTransform(x, [0, 100], [0, 1]);
  const leftOpacity = useTransform(x, [0, -100], [0, 1]);
  const borderColor = useTransform(
    x,
    [-200, 0, 200],
    ["rgba(239, 68, 68, 1)", "rgba(0,0,0,0)", "rgba(34, 197, 94, 1)"]
  );

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      const direction = info.offset.x > 0 ? "right" : "left";
      onSwipe(direction);
    }
  };

  if (!active) return null;

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
    >
      <motion.div 
        style={{ borderColor }}
        className="w-full h-full bg-card rounded-3xl shadow-2xl border-4 border-transparent p-8 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden"
      >
        {/* Category Tag */}
        <div className="absolute top-8 text-sm font-bold tracking-widest text-muted-foreground uppercase opacity-50">
          Statement
        </div>

        {/* Swipe Indicators */}
        <motion.div 
          style={{ opacity: rightOpacity }} 
          className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-green-500/20 to-transparent flex items-center justify-center pointer-events-none"
        >
          <div className="text-green-500 transform rotate-90 border-4 border-green-500 rounded-lg px-4 py-2 font-bold text-2xl uppercase tracking-widest bg-card/80 backdrop-blur-sm">
            Agree
          </div>
        </motion.div>
        <motion.div 
          style={{ opacity: leftOpacity }} 
          className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-red-500/20 to-transparent flex items-center justify-center pointer-events-none"
        >
          <div className="text-red-500 transform -rotate-90 border-4 border-red-500 rounded-lg px-4 py-2 font-bold text-2xl uppercase tracking-widest bg-card/80 backdrop-blur-sm">
            Disagree
          </div>
        </motion.div>

        {/* Card Content */}
        <h3 className="text-2xl md:text-4xl font-display font-medium text-foreground leading-snug">
          "{question.text}"
        </h3>

        <AnimatePresence>
          {showTutorial && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-[200px] bg-primary text-primary-foreground p-3 rounded-2xl shadow-xl text-xs font-bold z-50 pointer-events-none text-center flex flex-col items-center gap-2"
            >
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 animate-bounce" />
                <span>Swipe Left or Right</span>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-primary" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-8 text-sm text-muted-foreground flex gap-4 items-center opacity-50">
          <span className="flex items-center gap-1"><XCircle size={16} /> Swipe Left</span>
          <span className="w-1 h-1 bg-current rounded-full" />
          <span className="flex items-center gap-1">Swipe Right <CheckCircle size={16} /></span>
        </div>
      </motion.div>
    </motion.div>
  );
}
