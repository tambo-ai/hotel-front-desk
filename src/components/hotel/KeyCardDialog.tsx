"use client";

import { z } from "zod";
import { useHotel } from "@/lib/hotel-store";
import { CreditCard, X, Printer } from "lucide-react";
import { useTamboComponentState } from "@tambo-ai/react";

// Schema for Tambo component registration
export const KeyCardDialogPropsSchema = z.object({
  roomNumber: z.number().describe("Room number for the key card"),
  guestName: z.string().describe("Guest name for the key card"),
  checkOutDate: z.string().describe("Check-out date for key expiration"),
  keyCount: z.number().default(2).describe("Number of keys to generate"),
  onPrint: z.function().returns(z.void()).optional(),
  onClose: z.function().returns(z.void()).optional(),
});

export type KeyCardDialogProps = z.infer<typeof KeyCardDialogPropsSchema>;

export function KeyCardDialog({
  roomNumber,
  guestName,
  checkOutDate,
  keyCount = 2,
  onPrint,
  onClose,
}: KeyCardDialogProps) {
  const hotelContext = useHotel();
  const clearKeyGenerationData = hotelContext?.clearKeyGenerationData;

  // Sync key count and print status to AI context
  // Note: keyCount defaults to 2 in the destructuring, so we're safe to use it directly
  const effectiveKeyCount = keyCount;
  const [activeKeyCount, setActiveKeyCount] = useTamboComponentState<number>(
    "keyCount",
    effectiveKeyCount,
    effectiveKeyCount
  );
  const [printStatus, setPrintStatus] = useTamboComponentState<"pending" | "printing" | "printed">(
    "printStatus",
    "pending"
  );

  const handlePrint = () => {
    setPrintStatus("printing");
    if (onPrint) {
      onPrint();
    }
    // Simulate key generation delay
    setTimeout(() => {
      setPrintStatus("printed");
      if (clearKeyGenerationData) {
        clearKeyGenerationData();
      }
      if (onClose) {
        onClose();
      }
    }, 1000);
  };

  const handleClose = () => {
    if (clearKeyGenerationData) {
      clearKeyGenerationData();
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-400" />
            Print Key Cards
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Room Number</span>
              <span className="text-foreground font-medium">{roomNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Guest Name</span>
              <span className="text-foreground font-medium">{guestName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Valid Until</span>
              <span className="text-foreground font-medium">
                {new Date(checkOutDate).toLocaleDateString()} 11:00 AM
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Number of Keys</span>
              <span className="text-foreground font-medium">{activeKeyCount}</span>
            </div>
          </div>

          {/* Key Card Preview */}
          <div className="flex justify-center gap-3">
            {Array.from({ length: activeKeyCount ?? keyCount }).map((_, i) => (
              <div
                key={i}
                className="w-24 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg flex items-center justify-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="text-center">
                  <div className="text-xs text-blue-200">Room</div>
                  <div className="text-lg font-bold text-foreground">
                    {roomNumber}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-foreground rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print {activeKeyCount} Key{activeKeyCount !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
