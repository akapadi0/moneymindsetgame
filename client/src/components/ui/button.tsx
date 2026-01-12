import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none active:scale-95",
          
          // Variants
          variant === "primary" && 
            "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5",
          variant === "secondary" && 
            "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          variant === "outline" && 
            "border-2 border-primary/20 bg-background hover:bg-accent/5 hover:border-primary/40 text-primary",
          variant === "ghost" && 
            "hover:bg-accent/10 text-primary hover:text-accent",
            
          // Sizes
          size === "sm" && "h-9 px-4 text-sm",
          size === "md" && "h-12 px-6 text-base",
          size === "lg" && "h-14 px-8 text-lg font-semibold",
          size === "icon" && "h-12 w-12",
          
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, cn };
