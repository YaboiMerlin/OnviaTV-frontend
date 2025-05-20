import React from 'react';

interface OnviaLogoProps {
  className?: string;
  glowEffect?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const OnviaLogo: React.FC<OnviaLogoProps> = ({
  className = '',
  glowEffect = true,
  size = 'md',
  animated = false
}) => {
  // Determine dimensions based on size
  const dimensions = {
    sm: { width: 'w-32', height: 'h-28' },
    md: { width: 'w-48', height: 'h-40' },
    lg: { width: 'w-64', height: 'h-56' }
  };
  
  // Orange color with proper glow
  const logoColor = "#FF7F2A";

  return (
    <div 
      className={`${dimensions[size].width} ${dimensions[size].height} relative ${className} ${
        animated ? 'animate-pulse' : ''
      }`}
    >
      <svg 
        viewBox="0 0 300 300" 
        className="w-full h-full"
        style={{
          filter: glowEffect ? 'drop-shadow(0 0 10px rgba(255, 127, 42, 0.7))' : 'none'
        }}
      >
        {/* TV outline with rounded corners */}
        <rect 
          x="40" 
          y="60" 
          width="220" 
          height="140" 
          rx="20" 
          ry="20" 
          fill="none" 
          stroke={logoColor} 
          strokeWidth="4"
        />
        
        {/* TV stand legs */}
        <rect x="100" y="200" width="10" height="20" fill={logoColor} />
        <rect x="190" y="200" width="10" height="20" fill={logoColor} />
        
        {/* TV antennas */}
        <line x1="80" y1="60" x2="60" y2="30" stroke={logoColor} strokeWidth="4" strokeLinecap="round" />
        <line x1="220" y1="60" x2="240" y2="30" stroke={logoColor} strokeWidth="4" strokeLinecap="round" />
        
        {/* "onvia" text */}
        <text 
          x="150" 
          y="130" 
          textAnchor="middle" 
          fontFamily="Arial, sans-serif" 
          fontSize="36" 
          fontWeight="bold" 
          fill={logoColor}
        >
          onvia
        </text>
        
        {/* "TV" text */}
        <text 
          x="150" 
          y="170" 
          textAnchor="middle" 
          fontFamily="Arial, sans-serif" 
          fontSize="24" 
          fontWeight="bold" 
          fill={logoColor}
        >
          TV
        </text>
      </svg>
    </div>
  );
};