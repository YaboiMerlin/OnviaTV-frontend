import React, { useEffect, useState, useRef } from "react";
import { LandingPage } from "./LandingPage";
import { LoadingScreen } from "./LoadingScreen";
import { ChatInterface } from "./ChatInterface";
import { SettingsModal } from "./SettingsModal";
import { ReportModal } from "./ReportModal";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useSocket } from "@/contexts/SocketContext";
import { useChat } from "@/contexts/ChatContext";
import { type UserPreferences, type Country } from "@/lib/utils";

export const VideoChat: React.FC = () => {
  // Start directly in waiting screen
  const [currentScreen, setCurrentScreen] = useState<"waiting" | "loading" | "chat">("waiting");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    gender: "both",
    country: "any"
  });
  
  // Create a ref to store our media stream independently
  const mediaStreamRef = useRef<MediaStream | null>(null);
  
  // Ref for video elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  // Track webcam state
  const [cameraOn, setCameraOn] = useState(false);
  const [microphoneOn, setMicrophoneOn] = useState(false);
  
  const socket = useSocket();
  const { messages, sendMessage, clearMessages } = useChat();
  
  // Initialize camera only when user clicks Start Chat
  const initializeCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        
        // Store the stream in our ref to prevent garbage collection
        mediaStreamRef.current = stream;
        
        // Connect stream to the video element
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
    }
    return false;
  };
  
  // Toggle camera on/off
  const toggleCamera = () => {
    if (mediaStreamRef.current) {
      const videoTracks = mediaStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setCameraOn(videoTracks[0]?.enabled || false);
    }
  };
  
  // Toggle microphone on/off
  const toggleMicrophone = () => {
    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setMicrophoneOn(audioTracks[0]?.enabled || false);
    }
  };
  
  // Cleanup function to stop all tracks when component unmounts
  const cleanup = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };
  
  // Handle WebRTC connections
  const startConnection = () => {
    // In a real implementation, this would establish the WebRTC connection
    setIsSearching(true);
    setCurrentScreen("loading");
    
    // Simulating a connection after a delay
    setTimeout(() => {
      setIsSearching(false);
      setCurrentScreen("chat");
    }, 3000);
  };
  
  // Disconnect from current peer
  const disconnect = () => {
    // This would actually disconnect the WebRTC connection
    // but we'll just update our UI state
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };
  
  // Handle start chat from landing page
  const handleStartChat = async (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    
    // Initialize camera when user decides to chat
    const success = await initializeCamera();
    
    if (success) {
      setCurrentScreen("waiting");
      // Update preferences in the socket if we had a real backend
      // socket?.emit("update-preferences", preferences);
    }
  };
  
  // Handle start search button click
  const handleStartSearch = () => {
    startConnection();
  };
  
  // Handle stop search button click
  const handleStopSearch = () => {
    setIsSearching(false);
    disconnect();
    setCurrentScreen("waiting");
  };
  
  // Handle cancel search (go back to waiting)
  const handleCancelSearch = () => {
    setIsSearching(false);
    disconnect();
    setCurrentScreen("waiting");
  };
  
  // Handle skip to next stranger
  const handleSkip = () => {
    clearMessages();
    setIsSearching(true);
    setCurrentScreen("loading");
    
    // Simulating finding a new peer after a delay
    setTimeout(() => {
      setIsSearching(false);
      setCurrentScreen("chat");
    }, 2000);
  };
  
  // Handle end chat and return to waiting
  const handleEndChat = () => {
    setIsSearching(false);
    disconnect();
    clearMessages();
    setCurrentScreen("waiting");
  };
  
  // Update preferences when settings change
  const handleSettingsChange = (newPreferences: UserPreferences) => {
    setUserPreferences(newPreferences);
    // socket?.emit("update-preferences", newPreferences);
  };
  
  // Update just the country preference
  const handleCountryChange = (country: Country) => {
    const newPreferences = { ...userPreferences, country };
    setUserPreferences(newPreferences);
    // socket?.emit("update-preferences", newPreferences);
  };
  
  // Initialize camera on component mount
  useEffect(() => {
    // Auto-initialize the camera when component mounts
    initializeCamera();
    
    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, []);
  
  return (
    <>
      {currentScreen === "waiting" && (
        <LoadingScreen 
          isWaiting={true}
          onCancel={handleCancelSearch}
          onStart={handleStartSearch}
          localVideoRef={localVideoRef}
          onUpdateCountry={handleCountryChange}
          currentCountry={userPreferences.country}
        />
      )}
      
      {currentScreen === "loading" && (
        <LoadingScreen 
          isWaiting={false}
          onCancel={handleStopSearch}
          onStart={handleStopSearch}
          localVideoRef={localVideoRef}
          onUpdateCountry={handleCountryChange}
          currentCountry={userPreferences.country}
          isSearching={true}
        />
      )}
      
      {currentScreen === "chat" && (
        <ChatInterface
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          onSkip={handleSkip}
          onEnd={handleEndChat}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenReport={() => setIsReportOpen(true)}
          onUpdateCountry={handleCountryChange}
          currentCountry={userPreferences.country}
        />
      )}
      
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        preferences={userPreferences}
        onSave={handleSettingsChange}
        isCameraOn={cameraOn}
        isMicrophoneOn={microphoneOn}
        onToggleCamera={toggleCamera}
        onToggleMicrophone={toggleMicrophone}
      />
      
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onReport={(reason, details) => {
          // socket?.emit("report-user", { reason, details });
          setIsReportOpen(false);
          handleEndChat();
        }}
      />
    </>
  );
};
