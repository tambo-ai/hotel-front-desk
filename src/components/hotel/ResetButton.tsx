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
        if (key && (
          key.startsWith("tambo") ||
          key.startsWith("thread") ||
          key === "mcp-servers"
        )) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (e) {
      console.warn("Failed to clear localStorage:", e);
    }

    // Reset hotel state
    resetState();

    // Small delay to show feedback
    await new Promise(resolve => setTimeout(resolve, 300));

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
        className="fixed bottom-16 left-4 p-2 text-slate-600 hover:text-slate-400 hover:bg-slate-800/50 rounded-lg transition-colors opacity-40 hover:opacity-100 z-40"
        title="Reset Demo"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg shadow-2xl max-w-sm w-full border border-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-semibold">Reset Demo?</h3>
              </div>
              <button
                onClick={() => setShowConfirm(false)}
                className="p-1 hover:bg-slate-700 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <p className="text-slate-300 text-sm">
                This will reset all data to the initial state:
              </p>
              <ul className="text-slate-400 text-sm space-y-1 list-disc list-inside">
                <li>All room assignments and changes</li>
                <li>Billing adjustments</li>
                <li>Chat conversation history</li>
                <li>Any staged changes</li>
              </ul>
              <p className="text-slate-500 text-xs mt-2">
                The page will reload after reset.
              </p>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700 flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isResetting}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                disabled={isResetting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
