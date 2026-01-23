import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { Question } from "@shared/schema";

interface GameCardProps {
  question: Question;
  onSwipe: (direction: "left" | "right") => void;
  active: boolean;
}

export function GameCard({ question, onSwipe, active }: GameCardProps) {
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
      </motion.div>
    </motion.div>
  );
}
