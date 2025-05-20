import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { SocketProvider } from "./contexts/SocketContext";
import { ChatProvider } from "./contexts/ChatContext";
import App from "./App";
import "./index.css";
import "./styles/animations.css";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SocketProvider>
        <ChatProvider>
          <App />
          <Toaster />
        </ChatProvider>
      </SocketProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
