import { useEffect, useRef, useState, useCallback } from "react";
import { useSocket } from "@/contexts/SocketContext";

export interface UseWebRTCProps {
  onStrangerConnect: () => void;
  onStrangerDisconnect: () => void;
}

export function useWebRTC({ onStrangerConnect, onStrangerDisconnect }: UseWebRTCProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasInitializedMedia, setHasInitializedMedia] = useState(false);
  
  const socket = useSocket();
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  
  // Initialize WebRTC peer connection
  const initializePeerConnection = useCallback(() => {
    const configuration = { 
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" }
      ] 
    };
    
    const peerConnection = new RTCPeerConnection(configuration);
    
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit("ice-candidate", event.candidate);
      }
    };
    
    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
        remoteStreamRef.current = event.streams[0];
        setIsConnected(true);
        onStrangerConnect();
      }
    };
    
    peerConnection.oniceconnectionstatechange = () => {
      if (peerConnection.iceConnectionState === "disconnected" || 
          peerConnection.iceConnectionState === "failed" ||
          peerConnection.iceConnectionState === "closed") {
        setIsConnected(false);
        onStrangerDisconnect();
      }
    };
    
    peerConnectionRef.current = peerConnection;
    return peerConnection;
  }, [socket, onStrangerConnect, onStrangerDisconnect]);
  
  // Initialize the media immediately on component mount
  // This ensures the user's camera shows up right away
  useEffect(() => {
    if (!hasInitializedMedia) {
      const initializeMedia = async () => {
        try {
          const constraints = {
            video: true,
            audio: true
          };
          
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          
          // Store the stream
          localStreamRef.current = stream;
          
          // Set the stream to the video element
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          
          setHasInitializedMedia(true);
          setIsCameraOn(true);
          setIsMicrophoneOn(true);
        } catch (error) {
          console.error("Error accessing media devices:", error);
          setIsCameraOn(false);
          setIsMicrophoneOn(false);
        }
      };
      
      initializeMedia();
    }
  }, [hasInitializedMedia]);
  
  // Start local stream
  const startLocalStream = useCallback(async () => {
    try {
      setLoading(true);
      
      // If stream already exists, just use it
      if (localStreamRef.current) {
        if (peerConnectionRef.current) {
          // Add existing tracks to peer connection
          localStreamRef.current.getTracks().forEach(track => {
            if (peerConnectionRef.current && localStreamRef.current) {
              peerConnectionRef.current.addTrack(track, localStreamRef.current);
            }
          });
        }
        
        setLoading(false);
        return localStreamRef.current;
      }
      
      // Otherwise, get a new stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      localStreamRef.current = stream;
      
      // Add tracks to peer connection
      if (peerConnectionRef.current) {
        stream.getTracks().forEach(track => {
          if (peerConnectionRef.current && localStreamRef.current) {
            peerConnectionRef.current.addTrack(track, localStreamRef.current);
          }
        });
      }
      
      setHasInitializedMedia(true);
      setLoading(false);
      return stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      setLoading(false);
      setIsCameraOn(false);
      setIsMicrophoneOn(false);
      return null;
    }
  }, []);
  
  // Create offer
  const createOffer = useCallback(async () => {
    try {
      if (!peerConnectionRef.current) return;
      
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      
      socket?.emit("offer", offer);
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  }, [socket]);
  
  // Handle offer
  const handleOffer = useCallback(async (offer: RTCSessionDescriptionInit) => {
    try {
      if (!peerConnectionRef.current) {
        initializePeerConnection();
      }
      
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        
        socket?.emit("answer", answer);
      }
    } catch (error) {
      console.error("Error handling offer:", error);
    }
  }, [socket, initializePeerConnection]);
  
  // Handle answer
  const handleAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
    try {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    } catch (error) {
      console.error("Error handling answer:", error);
    }
  }, []);
  
  // Handle ICE candidate
  const handleIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
    try {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (error) {
      console.error("Error handling ICE candidate:", error);
    }
  }, []);
  
  // Disconnect from peer
  const disconnect = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    // Clean up remote connection but preserve local camera
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    remoteStreamRef.current = null;
    
    setIsConnected(false);
    onStrangerDisconnect();
  }, [onStrangerDisconnect]);
  
  // Toggle camera
  const toggleCamera = useCallback(() => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        const videoTrack = videoTracks[0];
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  }, []);
  
  // Toggle microphone
  const toggleMicrophone = useCallback(() => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        const audioTrack = audioTracks[0];
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicrophoneOn(audioTrack.enabled);
      }
    }
  }, []);
  
  // Initialize WebRTC and connect to a new peer
  const findNewPeer = useCallback(async () => {
    // Disconnect from current peer if any
    disconnect();
    setLoading(true);
    
    // Initialize peer connection
    const pc = initializePeerConnection();
    
    // Make sure we have a local stream for webcam
    if (!localStreamRef.current) {
      await startLocalStream();
    } else if (pc && localStreamRef.current) {
      // Add existing tracks to new peer connection
      localStreamRef.current.getTracks().forEach(track => {
        if (pc && localStreamRef.current) {
          pc.addTrack(track, localStreamRef.current);
        }
      });
    }
    
    // Emit looking for peer event
    socket?.emit("find-peer");
    setLoading(false);
  }, [disconnect, initializePeerConnection, startLocalStream, socket]);
  
  // Cleanup resources while preserving WebRTC connection
  const cleanup = useCallback(() => {
    // Disconnect current peer if any
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    // Stop all media tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    if (remoteStreamRef.current) {
      remoteStreamRef.current = null;
    }
    
    // Reset video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    
    setIsConnected(false);
    setHasInitializedMedia(false);
  }, []);
  
  // Set up event listeners
  useEffect(() => {
    if (!socket) return;
    
    // Handle socket events
    socket.on("ready", createOffer);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("peer-disconnected", disconnect);
    
    return () => {
      // Remove listeners
      socket.off("ready", createOffer);
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIceCandidate);
      socket.off("peer-disconnected", disconnect);
    };
  }, [socket, createOffer, handleOffer, handleAnswer, handleIceCandidate, disconnect]);
  
  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);
  
  return {
    localVideoRef,
    remoteVideoRef,
    isConnected,
    isCameraOn,
    isMicrophoneOn,
    loading,
    toggleCamera,
    toggleMicrophone,
    findNewPeer,
    disconnect,
    cleanup
  };
}
