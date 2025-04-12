import React from 'react';

const ButtonLoader = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative h-5 w-5">
        {/* Spinning circle */}
        <div className="absolute inset-0 rounded-full border-2 border-blue-200 border-t-blue-500 animate-spin" />
        
        {/* Inner dot */}
        <div className="absolute inset-1 rounded-full bg-blue-400 animate-pulse" />
      </div>
    </div>
  );
};

export default ButtonLoader;