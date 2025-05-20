import React from "react";
import { AnimatedBackground } from "./AnimatedBackground";
import { COUNTRIES, type Country } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TVStaticAnimation, TVLogoWithStatic } from "./TVStaticAnimation";

interface LoadingScreenProps {
  onCancel: () => void;
  onStart?: () => void;
  localVideoRef?: React.RefObject<HTMLVideoElement>;
  onUpdateCountry?: (country: Country) => void;
  currentCountry?: Country;
  isWaiting?: boolean;
  isSearching?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  onCancel, 
  onStart,
  localVideoRef,
  onUpdateCountry,
  currentCountry = "any",
  isWaiting = false,
  isSearching = false
}) => {
  // Handle country change
  const handleCountryChange = (value: string) => {
    if (onUpdateCountry) {
      onUpdateCountry(value);
    }
  };

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Top half: Loading animation or waiting screen (50%) */}
      <div className="relative h-1/2 bg-[#0A1525] flex items-center justify-center">
        {isSearching ? (
          <div className="flex flex-col items-center justify-center absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm">
            {/* TV Static animation */}
            <div className="absolute inset-0 z-0">
              <TVStaticAnimation />
            </div>
            
            <div className="z-10 relative">
              <div className="animate-pulse mb-4">
                <svg viewBox="0 0 300 250" className="w-48 h-40 mx-auto fill-[#00BCD4]">
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
              
              <p className="text-white text-lg text-center px-4 mb-2">
                Looking for someone to connect you with...
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="mb-6">
              <svg viewBox="0 0 300 250" className="w-48 h-40 mx-auto fill-[#00BCD4]">
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
            
            <p className="text-white/80 text-base text-center px-6">
              Press <span className="text-[#00BCD4] font-semibold">Start</span> when you're ready to find someone to chat with.
            </p>
          </div>
        )}
        
        {/* Report button at top (for UI consistency, disabled during loading) */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            disabled
            className="w-10 h-10 rounded-full bg-black/30 text-white/50 flex items-center justify-center"
          >
            <i className="ri-flag-line text-lg"></i>
          </button>
        </div>
        
        {/* Transparent buttons at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center">
            {/* Country selection button - takes up half the width */}
            <div className="w-1/2 pr-2">
              <Select value={currentCountry} onValueChange={handleCountryChange}>
                <SelectTrigger className="bg-black/30 border border-white/30 text-white h-12 focus:ring-0 focus:ring-offset-0 rounded-md w-full">
                  <div className="flex items-center">
                    <i className="ri-global-line mr-2"></i>
                    <SelectValue placeholder="Select country" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#0A1525] text-white border border-white/30">
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.value} value={country.value} className="text-white hover:bg-[#1E1E1E]">
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Dynamic button - takes up half the width */}
            <div className="w-1/2 pl-2">
              <button 
                onClick={isSearching ? onCancel : onStart}
                className={`w-full h-12 rounded-md flex items-center justify-center shadow-md text-white font-medium
                  ${isSearching 
                    ? "bg-black/40 border border-red-500/50 text-red-400 hover:bg-black/50" 
                    : "bg-black/40 border border-[#00BCD4]/50 text-[#00BCD4] hover:bg-black/50"}
                `}
              >
                {isSearching ? (
                  <>
                    <i className="ri-stop-line mr-2 text-lg"></i>
                    Stop
                  </>
                ) : (
                  <>
                    <i className="ri-play-line mr-2 text-lg"></i>
                    Start
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom half: User's camera feed always visible (50%) */}
      <div className="relative h-1/2 bg-[#0A1525] flex items-center justify-center">
        {/* User's webcam - takes up full width/height of bottom half */}
        {localVideoRef ? (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#081020]"></div>
        )}
        
        {/* Settings button */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            disabled
            className="w-10 h-10 rounded-full bg-black/30 text-white/50 flex items-center justify-center"
          >
            <i className="ri-settings-3-line text-lg"></i>
          </button>
        </div>
        
        {/* Simple message overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 py-2 px-4">
          <p className="text-white text-sm text-center">
            {isSearching 
              ? "Searching for partner..." 
              : "Camera active - Select country and press Start"}
          </p>
        </div>
      </div>
    </div>
  );
};
