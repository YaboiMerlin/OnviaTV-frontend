import React, { useEffect, useState, useRef } from "react";
import { AnimatedBackground } from "./AnimatedBackground";
import { COUNTRIES, type Country } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TVStaticAnimation } from "./TVStaticAnimation";
import { useChat } from "@/contexts/ChatContext";
import { OnviaLogo } from "./OnviaLogo";
import { UserProfileComponent, useUserProfile } from "./UserProfile";

// Color palette
const COLORS = {
  orange: "#FF7F2A",
  darkOrange: "#F06000",
  darkBlue: "#0A1525",
  lightGray: "#E5E5E5",
};

// Main component for the LOOM TV video chat interface
export const LoomTV: React.FC = () => {
  // Use the user profile hook for persistent settings
  const { 
    profile, 
    updateProfile, 
    isProfileOpen, 
    openProfile, 
    closeProfile 
  } = useUserProfile();
  
  // State
  const [isSearching, setIsSearching] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(profile.preferredCountry || "any");
  const [cameraOn, setCameraOn] = useState(true); // Always keep camera on as requested
  const [microphoneOn, setMicrophoneOn] = useState(profile.microphoneEnabled);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [showChatPopup, setShowChatPopup] = useState(false);
  
  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const connectionTimerRef = useRef<number | null>(null);
  
  // Chat messages
  const { messages, sendMessage, clearMessages } = useChat();
  const messagesRef = useRef<HTMLDivElement>(null);
  
  // Initialize the camera
  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      // Store stream to prevent it from being garbage collected
      mediaStreamRef.current = stream;
      
      // Set stream to video element
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setCameraOn(true);
      setMicrophoneOn(true);
      return true;
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setCameraOn(false);
      setMicrophoneOn(false);
      return false;
    }
  };
  
  // Toggle camera
  const toggleCamera = () => {
    if (!mediaStreamRef.current) return;
    
    const videoTracks = mediaStreamRef.current.getVideoTracks();
    videoTracks.forEach(track => {
      track.enabled = !track.enabled;
    });
    
    setCameraOn(videoTracks[0]?.enabled || false);
  };
  
  // Toggle microphone
  const toggleMicrophone = () => {
    if (!mediaStreamRef.current) return;
    
    const audioTracks = mediaStreamRef.current.getAudioTracks();
    audioTracks.forEach(track => {
      track.enabled = !track.enabled;
    });
    
    const newState = audioTracks[0]?.enabled || false;
    setMicrophoneOn(newState);
    
    // Update persistent settings
    updateProfile({ microphoneEnabled: newState });
  };
  
  // Start searching for a partner - only when user explicitly clicks Start
  const startSearch = async () => {
    // First, ensure we have camera access
    if (!mediaStreamRef.current) {
      const success = await initializeCamera();
      if (!success) {
        // Failed to get camera access
        return;
      }
    }
    
    setIsSearching(true);
    clearMessages();
    
    // Simulate finding a partner after a delay
    connectionTimerRef.current = window.setTimeout(() => {
      if (isSearching) { // Only proceed if still searching
        setIsSearching(false);
        setIsConnected(true);
      }
    }, 3000);
  };
  
  // Stop searching - clears timer to prevent auto-connecting
  const stopSearch = () => {
    setIsSearching(false);
    
    // Make sure we're not setting a connected state after stopping
    if (connectionTimerRef.current) {
      window.clearTimeout(connectionTimerRef.current);
      connectionTimerRef.current = null;
    }
  };
  
  // Skip current partner
  const skipPartner = () => {
    setIsConnected(false);
    setShowChatPopup(false); // Close chat popup when skipping
    clearMessages();
    
    // After a brief delay, start search again
    setTimeout(() => {
      setIsSearching(true);
      
      // Simulate finding a new partner
      connectionTimerRef.current = window.setTimeout(() => {
        if (isSearching) { // Only if still searching
          setIsSearching(false);
          setIsConnected(true);
        }
      }, 2000);
    }, 500);
  };
  
  // Handle country change
  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    // Also update the persistent profile
    updateProfile({ preferredCountry: country });
  };
  
  // Update scroll position when new messages are added
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (connectionTimerRef.current) {
        window.clearTimeout(connectionTimerRef.current);
      }
      
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Top half: Stranger or waiting/searching screen */}
      <div className="relative h-1/2 bg-[#0A1525] flex items-center justify-center">
        {isConnected ? (
          // Connected to stranger
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          // Waiting or searching state
          <div className="flex flex-col items-center justify-center absolute inset-0 bg-black/70 backdrop-blur-sm">
            {/* TV Static overlay during search */}
            {isSearching && (
              <div className="absolute inset-0 z-0">
                <TVStaticAnimation />
              </div>
            )}
            
            <div className="z-10 relative">
              {/* New Onvia TV logo */}
              <div className={isSearching ? "animate-pulse mb-4" : "mb-6"}>
                <OnviaLogo 
                  size="md" 
                  glowEffect={true} 
                  animated={isSearching} 
                  className="mx-auto"
                />
              </div>
              
              <p className="text-white text-lg text-center px-4 mb-2">
                {isSearching ? "Looking for someone to chat with..." : "Ready to start chatting?"}
              </p>
            </div>
          </div>
        )}
        
        {/* Report button at top with clear icon */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isConnected 
                ? "bg-black/50 text-white hover:bg-[#FF7F2A]/70" 
                : "bg-black/30 text-white/50 cursor-not-allowed"
            }`}
            onClick={() => isConnected && setReportOpen(true)}
            disabled={!isConnected}
            title="Report User"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
              <line x1="4" y1="22" x2="4" y2="15"></line>
            </svg>
          </button>
        </div>
        
        {/* Transparent buttons at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center">
            {/* Country selection button - takes up half width */}
            <div className="w-1/2 pr-2">
              <Select value={selectedCountry} onValueChange={handleCountryChange}>
                <SelectTrigger className="bg-black/30 border border-[#FF7F2A]/30 text-white h-12 focus:ring-0 focus:ring-offset-0 rounded-md w-full">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    <SelectValue placeholder="Select country" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#0A1525] text-white border border-[#FF7F2A]/30">
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.value} value={country.value} className="text-white hover:bg-[#FF7F2A]/20">
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Dynamic button - takes up half width */}
            <div className="w-1/2 pl-2">
              {isConnected ? (
                // Skip button
                <button 
                  onClick={skipPartner}
                  className="w-full h-12 rounded-md bg-black/40 border border-[#FF7F2A]/50 text-[#FF7F2A] hover:bg-black/50 flex items-center justify-center shadow-md font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <polygon points="5 4 15 12 5 20 5 4"></polygon>
                    <line x1="19" y1="5" x2="19" y2="19"></line>
                  </svg>
                  Skip
                </button>
              ) : isSearching ? (
                // Stop button
                <button 
                  onClick={stopSearch}
                  className="w-full h-12 rounded-md bg-black/40 border border-[#FF7F2A]/50 text-[#FF7F2A] hover:bg-black/50 flex items-center justify-center shadow-md font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                  Stop
                </button>
              ) : (
                // Start button
                <button 
                  onClick={startSearch}
                  className="w-full h-12 rounded-md bg-black/40 border border-[#FF7F2A]/50 text-[#FF7F2A] hover:bg-black/50 flex items-center justify-center shadow-md font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  Start
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom half: User's camera feed */}
      <div className="relative h-1/2 bg-[#0A1525] flex items-center justify-center">
        {/* User's webcam */}
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {/* Controls at top-right: Profile and Settings */}
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          {/* User Profile Button */}
          <button 
            onClick={openProfile}
            className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-[#FF7F2A]/70"
            title="My Profile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
          
          {/* Settings Button */}
          <button 
            onClick={() => setSettingsOpen(true)}
            className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-[#FF7F2A]/70"
            title="Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
        </div>
        
        {/* Only Mic control - no camera control */}
        <div className="absolute top-4 left-4 z-10">
          <button 
            onClick={toggleMicrophone}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              microphoneOn 
                ? "bg-[#FF7F2A] text-white" 
                : "bg-black/50 text-white/60"
            }`}
            title={microphoneOn ? "Mute Microphone" : "Unmute Microphone"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {microphoneOn ? (
                <>
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </>
              ) : (
                <>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                  <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                  <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </>
              )}
            </svg>
          </button>
        </div>
        
        {/* Chat button in bottom right */}
        <div className="absolute bottom-4 right-4 z-20">
          <button 
            onClick={() => setShowChatPopup(prev => !prev)}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isConnected 
                ? "bg-[#FF7F2A] text-white hover:bg-[#FF7F2A]/80" 
                : "bg-black/30 text-white/50 cursor-not-allowed"
            }`}
            disabled={!isConnected}
            title={showChatPopup ? "Close Chat" : "Open Chat"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </div>
        
        {/* Floating chat popup window */}
        {showChatPopup && isConnected && (
          <div className="absolute right-4 bottom-20 z-30 bg-[#0A1525]/95 border border-[#FF7F2A]/30 rounded-lg shadow-lg w-72 max-w-[80vw]">
            <div className="flex justify-between items-center p-2 border-b border-[#FF7F2A]/20">
              <p className="text-white font-medium">Chat</p>
              <button 
                onClick={() => setShowChatPopup(false)}
                className="text-white/70 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            {/* Messages area */}
            <div 
              ref={messagesRef}
              className="p-2 h-60 overflow-y-auto"
            >
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div key={message.id} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className="flex flex-col">
                      <span className={`inline-block px-3 py-2 rounded-lg max-w-[85%] ${
                        message.sender === 'user' 
                          ? 'bg-[#FF7F2A] text-white ml-auto rounded-br-none' 
                          : 'bg-[#333333] text-white mr-auto rounded-bl-none'
                      }`}>
                        {message.text}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-white/50 mt-6 mb-6">
                  <p>No messages yet</p>
                  <p className="text-xs mt-2">Start chatting with your new friend</p>
                </div>
              )}
            </div>
            
            {/* Message input */}
            <div className="relative p-2 border-t border-[#FF7F2A]/20">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full bg-black/30 border border-[#FF7F2A]/30 rounded-full text-white text-sm py-2 pl-4 pr-10 focus:outline-none focus:border-[#FF7F2A]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                    sendMessage(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#FF7F2A] hover:text-[#FF7F2A]/80"
                onClick={() => {
                  const input = document.querySelector('.relative input[type="text"]') as HTMLInputElement;
                  if (input && input.value.trim() !== '') {
                    sendMessage(input.value);
                    input.value = '';
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13"></path>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1F1F1F] rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-medium mb-2">Camera & Microphone</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={toggleCamera}
                    className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center ${
                      cameraOn
                        ? "bg-[#FF7F2A] text-white"
                        : "bg-black/40 text-white/70 border border-white/20"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      {cameraOn ? (
                        <>
                          <path d="M23 7l-7 5 7 5V7z"></path>
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                        </>
                      ) : (
                        <>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                          <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l7 5v11"></path>
                        </>
                      )}
                    </svg>
                    {cameraOn ? "Camera On" : "Camera Off"}
                  </button>
                  
                  <button
                    onClick={toggleMicrophone}
                    className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center ${
                      microphoneOn
                        ? "bg-[#FF7F2A] text-white"
                        : "bg-black/40 text-white/70 border border-white/20"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      {microphoneOn ? (
                        <>
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                          <line x1="12" y1="19" x2="12" y2="23"></line>
                          <line x1="8" y1="23" x2="16" y2="23"></line>
                        </>
                      ) : (
                        <>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                          <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                          <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                          <line x1="12" y1="19" x2="12" y2="23"></line>
                          <line x1="8" y1="23" x2="16" y2="23"></line>
                        </>
                      )}
                    </svg>
                    {microphoneOn ? "Mic On" : "Mic Off"}
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-2">Preferences</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-white/70 text-sm block mb-1">Country</label>
                    <Select value={selectedCountry} onValueChange={handleCountryChange}>
                      <SelectTrigger className="bg-black/30 border border-[#FF7F2A]/30 text-white focus:ring-0 focus:ring-offset-0 rounded-md w-full">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0A1525] text-white border border-[#FF7F2A]/30">
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country.value} value={country.value} className="text-white hover:bg-[#FF7F2A]/20">
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSettingsOpen(false)}
                className="bg-[#FF7F2A] text-white py-2 px-4 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Report Modal */}
      {reportOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1F1F1F] rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
              Report User
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-white/70 text-sm block mb-1">Reason</label>
                <select className="w-full bg-black/30 border border-[#FF7F2A]/30 text-white rounded-md p-2">
                  <option value="inappropriate">Inappropriate Content</option>
                  <option value="abuse">Abuse or Harassment</option>
                  <option value="spam">Spam</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="text-white/70 text-sm block mb-1">Details (optional)</label>
                <textarea 
                  className="w-full h-24 bg-black/30 border border-[#FF7F2A]/30 text-white rounded-md p-2"
                  placeholder="Please provide any additional details"
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setReportOpen(false)}
                className="bg-transparent border border-white/30 text-white py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              
              <button
                onClick={() => {
                  setReportOpen(false);
                  // Reset connection after report
                  setIsConnected(false);
                  clearMessages();
                }}
                className="bg-red-500 text-white py-2 px-4 rounded-md"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* User Profile Component */}
      <UserProfileComponent
        isOpen={isProfileOpen}
        onClose={closeProfile}
        initialProfile={profile}
        onSave={(newProfile) => {
          updateProfile(newProfile);
          // Apply microphone setting immediately
          if (newProfile.microphoneEnabled !== microphoneOn && mediaStreamRef.current) {
            const audioTracks = mediaStreamRef.current.getAudioTracks();
            audioTracks.forEach(track => {
              track.enabled = newProfile.microphoneEnabled;
            });
            setMicrophoneOn(newProfile.microphoneEnabled);
          }
          // Apply country setting immediately
          if (newProfile.preferredCountry !== selectedCountry) {
            setSelectedCountry(newProfile.preferredCountry);
          }
        }}
      />
    </div>
  );
};