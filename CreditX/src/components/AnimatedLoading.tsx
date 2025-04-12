
import { motion } from "framer-motion";

interface AnimatedLoadingProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

export default function AnimatedLoading({
  size = "md",
  color = "primary",
  className = "",
}: AnimatedLoadingProps) {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const circleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({
      opacity: [0, 1, 0],
      scale: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        delay: i * 0.2,
      },
    }),
  };

  const containerSize = sizeMap[size];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`relative ${containerSize}`}>
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            custom={i}
            variants={circleVariants}
            initial="hidden"
            animate="visible"
            className={`absolute rounded-full bg-${color}`}
            style={{
              width: "30%",
              height: "30%",
              top: i === 0 || i === 1 ? "0" : "70%",
              left: i === 0 || i === 3 ? "0" : "70%",
              filter: `blur(1px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
