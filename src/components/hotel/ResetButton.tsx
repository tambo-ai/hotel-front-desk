"use client";

import { useState } from "react";
import { RotateCcw, AlertTriangle, X } from "lucide-react";
import { useHotel } from "@/lib/hotel-store";

export function ResetButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { resetState } = useHotel();

  const handleReset = async () => {
    setIsResetting(true);

    // Clear Tambo-related localStorage
    try {
      // Clear any Tambo thread data
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          (key.startsWith("tambo") ||
            key.startsWith("thread") ||
            key === "mcp-servers")
        ) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch (e) {
      console.warn("Failed to clear localStorage:", e);
    }

    // Reset hotel state
    resetState();

    // Small delay to show feedback
    await new Promise((resolve) => setTimeout(resolve, 300));

    setIsResetting(false);
    setShowConfirm(false);

    // Reload the page to fully reinitialize
    window.location.reload();
  };

  return (
    <>
      {/* Subtle reset button - bottom-left but above Next.js dev tools */}
      <button
        onClick={() => setShowConfirm(true)}
        className="fixed bottom-16 left-4 p-2 text-muted-foreground hover:text-muted-foreground hover:bg-card border border-border/50 rounded-lg transition-colors opacity-40 hover:opacity-100 z-40"
        title="Reset Demo"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg shadow-2xl max-w-sm w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-semibold">Reset Demo?</h3>
              </div>
              <button
                onClick={() => setShowConfirm(false)}
                className="p-1 hover:bg-secondary rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <p className="text-foreground/80 text-sm">
                This will reset all data to the initial state:
              </p>
              <ul className="text-muted-foreground text-sm space-y-1 list-disc list-inside">
                <li>All room assignments and changes</li>
                <li>Billing adjustments</li>
                <li>Chat conversation history</li>
                <li>Any staged changes</li>
              </ul>
              <p className="text-muted-foreground text-xs mt-2">
                The page will reload after reset.
              </p>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isResetting}
                className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                disabled={isResetting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-foreground rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isResetting ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
