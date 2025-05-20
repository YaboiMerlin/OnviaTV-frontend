import React from "react";

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#1F1F1F] overflow-hidden">
      <div className="absolute inset-0 backdrop-blur-[10px]"></div>
      
      {/* Vibrant color accents */}
      <div className="absolute w-full h-full">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-[#00BCD4]/10 blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-[#00BCD4]/10 blur-3xl animate-float-delayed"></div>
        <div className="absolute top-2/3 left-1/2 w-[450px] h-[450px] rounded-full bg-[#00BCD4]/10 blur-3xl animate-float-slow"></div>
      </div>
    </div>
  );
};
