import React from "react";
import { Helmet } from "react-helmet";
import { VideoChat } from "@/components/VideoChat";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>RIPPLETV - Video Chat</title>
        <meta name="description" content="Connect with random people via video chat. RIPPLETV offers a modern, safe way to meet new friends from around the world." />
        <meta property="og:title" content="RIPPLETV - Random Video Chat" />
        <meta property="og:description" content="Connect with random people via video chat. RIPPLETV offers a modern, safe way to meet new friends from around the world." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rippletv.com" />
        
        {/* Load Orbitron font for logo */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet" />
        
        {/* RemixIcon for icons */}
        <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet" />
      </Helmet>
      
      <VideoChat />
    </>
  );
}
