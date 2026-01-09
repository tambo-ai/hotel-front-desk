"use client";

import { useState, useEffect, useCallback } from "react";
import { Dashboard } from "@/components/hotel/Dashboard";
import { MessageThreadPanel } from "@/components/tambo/message-thread-panel";
import { ResetButton } from "@/components/hotel/ResetButton";
import { HotelProvider } from "@/lib/hotel-store";
import { NavigationTabs } from "@/components/hotel/NavigationTabs";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = useCallback(() => {
    setIsChatOpen((prev) => !prev);
  }, []);

  // Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        toggleChat();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggleChat]);

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      contextHelpers={{
        browserLanguage: () => ({
          language: typeof navigator !== "undefined" ? navigator.language : "en-US",
          instruction: "Always respond in this language and generate suggestions in this language.",
        }),
      }}
    >
      <HotelProvider>
        <div className="flex flex-col h-screen overflow-hidden">
          {/* Full-width nav bar */}
          <NavigationTabs onSearchClick={toggleChat} isChatOpen={isChatOpen} />

          {/* Content area below nav */}
          <div className="flex flex-1 min-h-0 overflow-hidden">
            <main className="flex-1 min-w-0 overflow-auto">
              <Dashboard />
            </main>
            {isChatOpen && (
              <MessageThreadPanel onClose={() => setIsChatOpen(false)} />
            )}
          </div>
        </div>
        <ResetButton />
      </HotelProvider>
    </TamboProvider>
  );
}
