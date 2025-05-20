import React from "react";

interface RippleAnimationProps {
  className?: string;
  showLogo?: boolean;
}

export const RippleAnimation: React.FC<RippleAnimationProps> = ({ 
  className = "", 
  showLogo = true 
}) => {
  return (
    <div className={`ripple-container relative w-32 h-32 ${className}`}>
      <div className="ripple-circle"></div>
      <div className="ripple-circle"></div>
      <div className="ripple-circle"></div>
      
      {showLogo && (
        <div className="flex items-center justify-center h-full z-10 relative">
          <div className="w-20 h-20 relative">
            <div className="absolute inset-0 border-4 border-[#00BCD4] rounded-md transform rotate-2"></div>
            <div className="absolute inset-0 bg-black/50 rounded-md flex flex-col items-center justify-center p-1">
              <span className="text-white font-['Orbitron'] text-[8px] tracking-wider">ripple</span>
              <span className="text-[#00BCD4] font-['Orbitron'] font-bold text-xl tracking-wider">TV</span>
            </div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-[#00BCD4]/80 rounded-sm"></div>
          </div>
        </div>
      )}
    </div>
  );
};
