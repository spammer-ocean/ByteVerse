
import React from 'react';
import { cn } from '@/lib/utils';

interface GradientLoaderProps {
  className?: string;
  text?: string;
}

const GradientLoader = ({ className, text = "Processing your application" }: GradientLoaderProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-6", className)}>
      {/* Animated orbital loader */}
      <div className="relative w-20 h-20">
        {/* Outer orbit */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-300 animate-[spin_3s_linear_infinite]" />
        
        {/* Middle orbit */}
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-cyan-400 border-l-cyan-400 animate-[spin_2s_linear_infinite_reverse]" />
        
        {/* Inner orbit with glowing ball */}
        <div className="absolute inset-4 rounded-full border-2 border-transparent border-b-blue-400 animate-[spin_1.5s_linear_infinite]">
          <div className="absolute w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 -top-1.5 blur-[1px]" />
        </div>
        
        {/* Center core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full animate-pulse shadow-lg shadow-blue-500/30" />
        </div>
      </div>
      
      {/* Text with animated gradient */}
      <div className="relative flex justify-center items-center">
        <div className="text-sm font-medium tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 animate-pulse">
          {text}
        </div>
        
        {/* Animated dots */}
        <div className="absolute -right-10 flex space-x-1">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-[bounce_1.4s_infinite_0.1s]"></span>
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-[bounce_1.4s_infinite_0.2s]"></span>
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-[bounce_1.4s_infinite_0.3s]"></span>
        </div>
      </div>
    </div>
  );
};

export default GradientLoader;