import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="absolute bottom-0 left-0 w-full p-4">
      <div className="relative">
        <Input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="bg-transparent border border-white text-white py-3 pl-5 pr-12 w-full focus:outline-none focus:border-[#40E0D0] focus:text-[#40E0D0]"
        />
        <Button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-9 h-9 bg-transparent border border-white text-white flex items-center justify-center p-0 hover:border-[#40E0D0] hover:text-[#40E0D0]"
          disabled={!message.trim()}
        >
          <i className="ri-send-plane-fill"></i>
        </Button>
      </div>
    </form>
  );
};
