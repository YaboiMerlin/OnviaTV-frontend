import React, { createContext, useContext, useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children: React.ReactNode;
}

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  
  useEffect(() => {
    // Determine the WebSocket URL based on current protocol and host
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    // Create a WebSocket connection
    const socketConnection = io(window.location.origin, {
      path: "/ws/socket.io",
      transports: ["websocket"]
    });
    
    setSocket(socketConnection);
    
    // Log connection status
    socketConnection.on("connect", () => {
      console.log("Connected to WebSocket server");
    });
    
    socketConnection.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });
    
    // Clean up on unmount
    return () => {
      socketConnection.disconnect();
    };
  }, []);
  
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
