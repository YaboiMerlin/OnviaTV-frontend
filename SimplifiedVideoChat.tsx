import React, { useEffect, useState, useRef } from "react";
import { AnimatedBackground } from "./AnimatedBackground";
import { COUNTRIES, type Country } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TVStaticAnimation } from "./TVStaticAnimation";
import { useChat } from "@/contexts/ChatContext";

// Color palette
const COLORS = {
  mainOrange: "#FF7F2A",
  accentOrange: "#FF6B1A",
  darkBlue: "#0A1525",
  lightGray: "#E5E5E5",
};

// Main component for the video chat interface
export const SimplifiedVideoChat: React.FC = () => {
  // State
  const [isSearching, setIsSearching] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>("any");
  const [cameraOn, setCameraOn] = useState(false);
  const [microphoneOn, setMicrophoneOn] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  
  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  
  // Chat messages
  const { messages, sendMessage, clearMessages } = useChat();
  const messagesRef = useRef<HTMLDivElement>(null);
  
  // Only request camera permissions when user clicks Start
  // NOT on component mount
  useEffect(() => {
    // Don't automatically initialize camera
    // We'll wait for the user to press Start
    
    // Cleanup on unmount
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
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
    
    setMicrophoneOn(audioTracks[0]?.enabled || false);
  };
  
  // Start searching for a partner
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
  
  // Store timeout reference
  const connectionTimerRef = useRef<number | null>(null);
  
  // Stop searching
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
    clearMessages();
    
    // After a brief delay, start search again
    setTimeout(() => {
      setIsSearching(true);
      
      // Simulate finding a new partner
      setTimeout(() => {
        setIsSearching(false);
        setIsConnected(true);
      }, 2000);
    }, 500);
  };
  
  // Handle country change
  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
  };
  
  // Update scroll position when new messages are added
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);
  
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
              {/* TV logo animation - cleaner design */}
              <div className={isSearching ? "animate-pulse mb-4" : "mb-6"}>
                <svg viewBox="0 0 300 200" className="w-48 h-36 mx-auto">
                  {/* TV outline - thinner, cleaner */}
                  <rect x="40" y="40" width="220" height="140" rx="10" ry="10" fill="none" stroke={COLORS.mainOrange} strokeWidth="4"/>
                  
                  {/* TV stand */}
                  <rect x="120" y="180" width="60" height="10" fill={COLORS.mainOrange} />
                  <rect x="130" y="160" width="40" height="20" fill={COLORS.mainOrange} />
                  
                  {/* Antenna */}
                  <line x1="80" y1="40" x2="110" y2="10" stroke={COLORS.mainOrange} strokeWidth="4" />
                  <line x1="220" y1="40" x2="190" y2="10" stroke={COLORS.mainOrange} strokeWidth="4" />
                  
                  {/* Screen */}
                  <rect x="50" y="50" width="200" height="120" rx="5" ry="5" fill={COLORS.darkBlue} fillOpacity="0.7" />
                  
                  {/* LOOM TV Text */}
                  <text x="150" y="110" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontWeight="bold" fontSize="32" fill={COLORS.mainOrange}>LOOM</text>
                  <text x="150" y="150" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontWeight="bold" fontSize="24" fill="white">TV</text>
                </svg>
              </div>
              
              <p className="text-white text-lg text-center px-4 mb-2">
                {isSearching ? "Looking for someone to chat with..." : "Ready to start chatting?"}
              </p>
            </div>
          </div>
        )}
        
        {/* Report button at top */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            className="w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50"
            onClick={() => setReportOpen(true)}
            disabled={!isConnected}
          >
            <i className="ri-flag-line text-lg"></i>
          </button>
        </div>
        
        {/* Transparent buttons at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center">
            {/* Country selection button - takes up half width */}
            <div className="w-1/2 pr-2">
              <Select value={selectedCountry} onValueChange={handleCountryChange}>
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
            
            {/* Dynamic button - takes up half width */}
            <div className="w-1/2 pl-2">
              {isConnected ? (
                // Skip button
                <button 
                  onClick={skipPartner}
                  className="w-full h-12 rounded-md bg-black/40 border border-[#FF7F2A]/50 text-[#FF7F2A] hover:bg-black/50 flex items-center justify-center shadow-md font-medium"
                >
                  <i className="ri-skip-right-line mr-2 text-lg"></i>
                  Skip
                </button>
              ) : isSearching ? (
                // Stop button
                <button 
                  onClick={stopSearch}
                  className="w-full h-12 rounded-md bg-black/40 border border-red-500/50 text-red-400 hover:bg-black/50 flex items-center justify-center shadow-md font-medium"
                >
                  <i className="ri-stop-line mr-2 text-lg"></i>
                  Stop
                </button>
              ) : (
                // Start button
                <button 
                  onClick={startSearch}
                  className="w-full h-12 rounded-md bg-black/40 border border-[#2A63E0]/50 text-[#2A63E0] hover:bg-black/50 flex items-center justify-center shadow-md font-medium"
                >
                  <i className="ri-play-line mr-2 text-lg"></i>
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
        
        {/* Settings button */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={() => setSettingsOpen(true)}
            className="w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50"
          >
            <i className="ri-settings-3-line text-lg"></i>
          </button>
        </div>
        
        {/* Camera/Mic controls */}
        <div className="absolute top-4 left-4 z-10 flex space-x-2">
          <button 
            onClick={toggleCamera}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              cameraOn 
                ? "bg-[#2A63E0] text-white" 
                : "bg-black/30 text-white/60"
            }`}
          >
            <i className={cameraOn ? "ri-vidicon-line" : "ri-vidicon-off-line"}></i>
          </button>
          
          <button 
            onClick={toggleMicrophone}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              microphoneOn 
                ? "bg-[#2A63E0] text-white" 
                : "bg-black/30 text-white/60"
            }`}
          >
            <i className={microphoneOn ? "ri-mic-line" : "ri-mic-off-line"}></i>
          </button>
        </div>
        
        {/* Message overlay at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2">
          <div 
            ref={messagesRef}
            className="max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-white scrollbar-track-[#0A1525]"
          >
            {messages.map((message) => (
              <div key={message.id} className={`mb-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block px-2 py-1 rounded ${
                  message.sender === 'user' 
                    ? 'bg-[#2A63E0] text-white' 
                    : 'bg-[#333333] text-white'
                }`}>
                  {message.text}
                </span>
                <span className="text-xs text-gray-400 ml-1">
                  {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                </span>
              </div>
            ))}
          </div>
          
          {/* Message input */}
          <div className="relative mt-1">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full bg-transparent border-none text-white text-sm py-1 pl-2 pr-8 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim() !== '' && isConnected) {
                  sendMessage(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
              disabled={!isConnected}
            />
            <button 
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                isConnected ? 'text-[#FF7F2A] cursor-pointer' : 'text-gray-500 cursor-not-allowed'
              }`}
              onClick={() => {
                if (!isConnected) return;
                
                const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (input && input.value.trim() !== '') {
                  sendMessage(input.value);
                  input.value = '';
                }
              }}
              disabled={!isConnected}
            >
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1F1F1F] rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <i className="ri-settings-3-line mr-2 text-[#2A63E0]"></i>
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
                        ? "bg-[#2A63E0] text-white"
                        : "bg-black/40 text-white/70 border border-white/20"
                    }`}
                  >
                    <i className={`${cameraOn ? "ri-vidicon-line" : "ri-vidicon-off-line"} mr-2`}></i>
                    {cameraOn ? "Camera On" : "Camera Off"}
                  </button>
                  
                  <button
                    onClick={toggleMicrophone}
                    className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center ${
                      microphoneOn
                        ? "bg-[#2A63E0] text-white"
                        : "bg-black/40 text-white/70 border border-white/20"
                    }`}
                  >
                    <i className={`${microphoneOn ? "ri-mic-line" : "ri-mic-off-line"} mr-2`}></i>
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
                      <SelectTrigger className="bg-black/30 border border-white/30 text-white focus:ring-0 focus:ring-offset-0 rounded-md w-full">
                        <SelectValue placeholder="Select country" />
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
              <i className="ri-flag-line mr-2 text-red-500"></i>
              Report User
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-white/70 text-sm block mb-1">Reason</label>
                <select className="w-full bg-black/30 border border-white/30 text-white rounded-md p-2">
                  <option value="inappropriate">Inappropriate Content</option>
                  <option value="abuse">Abuse or Harassment</option>
                  <option value="spam">Spam</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="text-white/70 text-sm block mb-1">Details (optional)</label>
                <textarea 
                  className="w-full h-24 bg-black/30 border border-white/30 text-white rounded-md p-2"
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
    </div>
  );
};