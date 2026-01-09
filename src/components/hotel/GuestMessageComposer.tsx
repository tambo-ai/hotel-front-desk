"use client";

import { useState } from "react";
import { z } from "zod";
import { useHotel } from "@/lib/hotel-store";
import { guests } from "@/data/mock-data";
import { Mail, Send, X, User, Sparkles } from "lucide-react";
import { useTamboComponentState } from "@tambo-ai/react";

// Schema for Tambo component registration
export const GuestMessageComposerPropsSchema = z.object({
  guestId: z.string().optional().describe("Guest ID - component fetches email from guest profile"),
  to: z.string().optional().describe("Recipient email (fallback if no guestId)"),
  subject: z.string().describe("Email subject line"),
  body: z.string().describe("Email body content"),
  template: z
    .enum(["welcome", "apology", "confirmation", "thank_you", "custom"])
    .optional()
    .describe("Message template type"),
  compact: z.boolean().optional().describe("Compact mode for chat embedding"),
  onSend: z.function().args().returns(z.void()).optional(),
  onClose: z.function().args().returns(z.void()).optional(),
});

export type GuestMessageComposerProps = z.infer<
  typeof GuestMessageComposerPropsSchema
>;

export function GuestMessageComposer({
  guestId,
  to: initialTo,
  subject: initialSubject,
  body: initialBody,
  template,
  compact = false,
  onSend,
  onClose,
}: GuestMessageComposerProps) {
  const { clearDraftMessage } = useHotel();

  // Fetch guest data internally using ID (if provided)
  const guest = guestId ? guests.find((g) => g.id === guestId) : null;

  // Email comes from guest profile (not editable)
  const to = guest?.email || initialTo || "";

  // Use useTamboComponentState with setFromProp (3rd param) to receive AI-generated content
  // During streaming, state updates as props arrive. After streaming, user edits take precedence.
  const [subject, setSubject] = useTamboComponentState<string>("subject", "", initialSubject);
  const [body, setBody] = useTamboComponentState<string>("body", "", initialBody);
  const [messageStatus, setMessageStatus] = useTamboComponentState<"editing" | "sending" | "sent">(
    "messageStatus",
    "editing"
  );

  // Local UI state (doesn't need AI sync)
  const isSending = messageStatus === "sending";
  const sent = messageStatus === "sent";

  const handleSend = async () => {
    setMessageStatus("sending");
    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setMessageStatus("sent");
    if (onSend) {
      onSend();
    }
    // Auto-close after 2 seconds
    setTimeout(() => {
      clearDraftMessage();
      if (onClose) {
        onClose();
      }
    }, 2000);
  };

  const handleClose = () => {
    clearDraftMessage();
    if (onClose) {
      onClose();
    }
  };

  if (sent) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <Send className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Message Sent!
        </h3>
        <p className="text-muted-foreground">
          Your message has been sent to {to}
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-card border border-border rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-400" />
            Draft Message
          </h3>
          {template && (
            <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
              {template}
            </span>
          )}
        </div>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">To: </span>
            <span className="text-foreground">{to}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Subject: </span>
            <span className="text-foreground">{subject}</span>
          </div>
          <div className="text-muted-foreground text-xs line-clamp-2">
            {body}
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleSend}
            disabled={isSending}
            className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-muted text-foreground text-sm rounded transition-colors flex items-center justify-center gap-1"
          >
            {isSending ? (
              "Sending..."
            ) : (
              <>
                <Send className="w-3 h-3" />
                Send
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <Mail className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Compose Message
            </h3>
            {template && (
              <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                {template} template
              </span>
            )}
          </div>
        </div>
        {onClose && (
          <button
            onClick={handleClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Guest Context */}
      {guest && (
        <div className="px-4 py-3 bg-secondary/50 border-b border-border">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">
              {guest.firstName} {guest.lastName}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded ${
                guest.loyaltyTier === "Platinum"
                  ? "bg-purple-500/20 text-purple-400"
                  : guest.loyaltyTier === "Gold"
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-muted text-foreground"
              }`}
            >
              {guest.loyaltyTier}
            </span>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="p-4 space-y-4">
        {/* To - read only, comes from guest profile */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            To
          </label>
          <div className="px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground">
            {to}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Message
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* AI indicator */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="w-3 h-3" />
          <span>This message was drafted by AI based on context</span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border flex items-center justify-end gap-3">
        {onClose && (
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-border text-foreground hover:bg-secondary rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSend}
          disabled={isSending || !to || !subject || !body}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-muted disabled:cursor-not-allowed text-foreground rounded-lg transition-colors flex items-center gap-2"
        >
          {isSending ? (
            "Sending..."
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Message
            </>
          )}
        </button>
      </div>
    </div>
  );
}
