import React, { useEffect, useRef } from 'react';

export const TVStaticAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full width/height of container
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    let animationFrameId: number;
    
    // Function to draw TV static
    const renderStatic = () => {
      // Fill with black
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw static noise
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        // Random gray value for static
        const gray = Math.floor(Math.random() * 255);
        // Only draw some pixels (sparse static)
        if (Math.random() < 0.05) {
          data[i] = data[i + 1] = data[i + 2] = gray;
          data[i + 3] = Math.random() * 255; // Random alpha
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      // Occasional scan line effect
      if (Math.random() < 0.1) {
        const y = Math.floor(Math.random() * canvas.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, y, canvas.width, 2);
      }
      
      // Add some vibrant blue with orange glow
      ctx.fillStyle = 'rgba(42, 99, 224, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Occasional orange flicker
      if (Math.random() < 0.05) {
        ctx.fillStyle = 'rgba(255, 127, 42, 0.03)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Loop animation
      animationFrameId = requestAnimationFrame(renderStatic);
    };
    
    renderStatic();
    
    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
};

// TV Logo with overlay static component
export const TVLogoWithStatic: React.FC<{ showStatic?: boolean }> = ({ showStatic = true }) => {
  return (
    <div className="relative w-56 h-56 mx-auto">
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="w-48 h-40 relative">
          {/* TV Shape with antennas */}
          <svg viewBox="0 0 300 250" className="w-full h-full fill-[#00BCD4]">
            <path d="M256,68.34H43.53c-5.23,0-9.47,4.24-9.47,9.47V202c0,5.23,4.24,9.47,9.47,9.47H256
                    c5.23,0,9.47-4.24,9.47-9.47V77.81C265.47,72.58,261.23,68.34,256,68.34z M238.39,183.07H61.14V96.74h177.25V183.07z
                    M220.23,211.74c0,3.99-3.23,7.22-7.22,7.22s-7.22-3.23-7.22-7.22s3.23-7.22,7.22-7.22S220.23,207.75,220.23,211.74z
                    M244.06,211.74c0,3.99-3.23,7.22-7.22,7.22s-7.22-3.23-7.22-7.22s3.23-7.22,7.22-7.22S244.06,207.75,244.06,211.74z
                    M113.01,46.79l36.51,21.55h-73.02L113.01,46.79z M186.52,46.79l36.51,21.55h-73.02L186.52,46.79z" />
            
            {/* LOOM TV Text */}
            <text x="150" y="150" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold" fontSize="36">LOOM</text>
            <text x="150" y="195" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold" fontSize="32">TV</text>
          </svg>
        </div>
      </div>
      
      {/* Static overlay */}
      {showStatic && (
        <div className="absolute inset-0 overflow-hidden rounded-lg z-20 opacity-40 mix-blend-overlay">
          <TVStaticAnimation />
        </div>
      )}
    </div>
  );
};