import React, { useRef, useState } from "react";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { useChat } from "@/contexts/ChatContext";
import { AnimatedBackground } from "./AnimatedBackground";
import { COUNTRIES, type Country } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChatInterfaceProps {
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  onSkip: () => void;
  onEnd: () => void;
  onOpenSettings: () => void;
  onOpenReport: () => void;
  onUpdateCountry?: (country: Country) => void;
  currentCountry?: Country;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  localVideoRef,
  remoteVideoRef,
  onSkip,
  onEnd,
  onOpenSettings,
  onOpenReport,
  onUpdateCountry,
  currentCountry = "any"
}) => {
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage } = useChat();
  const [country, setCountry] = useState<Country>(currentCountry);
  
  const { handlers } = useSwipeGesture({
    onSwipeLeft: onSkip,
    onSwipeRight: onEnd
  });
  
  // Handle country change
  const handleCountryChange = (value: string) => {
    setCountry(value);
    if (onUpdateCountry) {
      onUpdateCountry(value);
    }
  };
  
  // Scroll to bottom when new messages are added
  React.useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);
  
  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Top half: Stranger video (50% of screen) */}
      <div 
        className="relative h-1/2 bg-[#0A1525] flex items-center justify-center swipe-area"
        {...handlers}
      >
        {/* Stranger webcam feed */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* Report button at top */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={onOpenReport}
            className="w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50"
          >
            <i className="ri-flag-line text-lg"></i>
          </button>
        </div>
        
        {/* Transparent buttons at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center">
            {/* Country selection button - takes up half width */}
            <div className="w-1/2 pr-2">
              <Select value={country} onValueChange={handleCountryChange}>
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
            
            {/* Skip button - takes up half width */}
            <div className="w-1/2 pl-2">
              <button 
                onClick={onSkip}
                className="w-full h-12 rounded-md bg-black/40 border border-[#00BCD4]/50 text-[#00BCD4] hover:bg-black/50 flex items-center justify-center shadow-md font-medium"
              >
                <i className="ri-skip-right-line mr-2 text-lg"></i>
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom half: User's feed (50% of screen) */}
      <div className="relative h-1/2 bg-[#0A1525] flex items-center justify-center">
        {/* User's webcam - takes up full width/height of bottom half */}
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {/* Settings button */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50"
          >
            <i className="ri-settings-3-line text-lg"></i>
          </button>
        </div>
        
        {/* Message overlay at the bottom of user camera */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2">
          <div 
            ref={chatMessagesRef}
            className="max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-white scrollbar-track-[#0A1525]"
          >
            {messages.map((message) => (
              <ChatMessage 
                key={message.id}
                message={message}
              />
            ))}
          </div>
          
          {/* Message input */}
          <div className="relative mt-1">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full bg-transparent border-none text-white text-sm py-1 pl-2 pr-8 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                  sendMessage(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#00BCD4]"
              onClick={() => {
                const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (input && input.value.trim() !== '') {
                  sendMessage(input.value);
                  input.value = '';
                }
              }}
            >
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
