import React, { createContext, useContext, useState, useCallback } from "react";
import { getRandomId, type Message } from "@/lib/utils";
import { useSocket } from "./SocketContext";

interface ChatContextType {
  messages: Message[];
  sendMessage: (text: string) => void;
  clearMessages: () => void;
}

interface ChatProviderProps {
  children: React.ReactNode;
}

const ChatContext = createContext<ChatContextType>({
  messages: [],
  sendMessage: () => {},
  clearMessages: () => {}
});

export const useChat = () => useContext(ChatContext);

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const socket = useSocket();
  
  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    
    const newMessage: Message = {
      id: getRandomId(),
      text,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Send message to the server to relay to the peer
    socket?.emit("chat-message", text);
  }, [socket]);
  
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);
  
  // Listen for incoming messages from strangers
  React.useEffect(() => {
    if (!socket) return;
    
    const handleMessage = (text: string) => {
      const newMessage: Message = {
        id: getRandomId(),
        text,
        sender: "stranger",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
    };
    
    socket.on("chat-message", handleMessage);
    
    return () => {
      socket.off("chat-message", handleMessage);
    };
  }, [socket]);
  
  return (
    <ChatContext.Provider value={{ messages, sendMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
};
