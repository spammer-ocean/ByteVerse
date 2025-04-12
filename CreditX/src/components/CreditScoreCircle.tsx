
import { getScoreColor, getScoreRating } from "@/data/mockData";
import { CreditReport } from "@/types/credit";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CreditScoreCircleProps {
  report: CreditReport;
  size?: "sm" | "md" | "lg";
}

export default function CreditScoreCircle({ report, size = "md" }: CreditScoreCircleProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const score = report.creditScore;
  const scoreColor = getScoreColor(score);
  const scoreRating = getScoreRating(score);
  const { min, max } = report.scoreRange;
  
  // Calculate percentage for the circle
  const percentage = ((score - min) / (max - min)) * 100;
  
  // Determine size based on prop
  const sizeClasses = {
    sm: "w-24 h-24 text-2xl",
    md: "w-44 h-44 text-5xl",
    lg: "w-56 h-56 text-6xl"
  };
  
  const textSizeClasses = {
    sm: "text-xs",
    md: "text-base",
    lg: "text-lg"
  };
  
  const circleSize = sizeClasses[size];
  const textSize = textSizeClasses[size];

  // Animate the score
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    const countIncrement = score / totalFrames;
    
    let currentFrame = 0;
    
    const counter = setInterval(() => {
      currentFrame++;
      const currentCount = Math.round(countIncrement * currentFrame);
      
      setAnimatedScore(currentCount > score ? score : currentCount);
      
      if (currentFrame === totalFrames) {
        clearInterval(counter);
      }
    }, frameDuration);
    
    return () => clearInterval(counter);
  }, [score]);

  // Calculate stroke-dasharray and stroke-dashoffset for the circle
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div 
      className={`relative credit-score-circle ${circleSize} transition-all duration-500`}
      style={{ 
        filter: `drop-shadow(0 0 10px ${scoreColor === 'credit-excellent' ? '#22c55e40' : 
                                       scoreColor === 'credit-good' ? '#3b82f640' : 
                                       scoreColor === 'credit-fair' ? '#f59e0b40' : '#ef444440'})` 
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
    >
      {/* Background Circle */}
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          className="fill-none stroke-secondary/60"
          strokeWidth="8"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          className={`fill-none stroke-${scoreColor}`}
          strokeWidth="8"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Centered Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div 
          className={`font-bold ${circleSize.includes('text')}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {animatedScore}
        </motion.div>
        <motion.div 
          className={`${textSize} font-medium text-${scoreColor}`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          {scoreRating}
        </motion.div>
      </div>
    </motion.div>
  );
}
