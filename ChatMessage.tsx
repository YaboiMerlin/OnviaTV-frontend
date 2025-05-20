import React from "react";
import { cn } from "@/lib/utils";
import { type Message } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUserMessage = message.sender === "user";
  
  return (
    <div className={cn("flex mb-3", isUserMessage ? "justify-end" : "")}>
      <div
        className={cn(
          "px-4 py-2 max-w-[75%]",
          isUserMessage
            ? "bg-transparent border border-[#40E0D0] text-[#40E0D0]"
            : "bg-transparent border border-gray-400 text-gray-300"
        )}
      >
        <p className="text-sm">{message.text}</p>
      </div>
    </div>
  );
};
