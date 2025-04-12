import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedGradientProps {
  children: ReactNode;
  className?: string;
  intensity?: "light" | "medium" | "strong";
  color1?: string;
  color2?: string;
  duration?: number;
}

export default function AnimatedGradient({
  children,
  className = "",
  intensity = "medium",
  color1 = "rgba(30, 64, 175, 0.7)",  // Darker blue
  color2 = "rgba(0, 0, 0, 0.9)",      // Nearly black
  duration = 10,
}: AnimatedGradientProps) {
  const intensityValues = {
    light: 0.6,
    medium: 0.8,
    strong: 1,
  };

  const opacityValue = intensityValues[intensity];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ backgroundPosition: "0% 0%" }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: `linear-gradient(135deg, ${color1}, ${color2}, ${color1})`,
          backgroundSize: "400% 400%",
          opacity: opacityValue,
          filter: "blur(80px)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}