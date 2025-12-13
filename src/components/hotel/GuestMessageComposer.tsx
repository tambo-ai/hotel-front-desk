"use client";

import { useState } from "react";
import { z } from "zod";
import { useHotel } from "@/lib/hotel-store";
import { guests } from "@/data/mock-data";
import { Mail, Send, X, User, Sparkles } from "lucide-react";

// Schema for Tambo component registration
export const GuestMessageComposerPropsSchema = z.object({
  to: z.string().describe("Recipient email address"),
  subject: z.string().describe("Email subject line"),
  body: z.string().describe("Email body content"),
  guestId: z.string().optional().describe("Guest ID for profile context"),
  template: z.enum(["welcome", "apology", "confirmation", "thank_you", "custom"]).optional().describe("Message template type"),
  compact: z.boolean().optional().describe("Compact mode for chat embedding"),
  onSend: z.function().args().returns(z.void()).optional(),
  onClose: z.function().args().returns(z.void()).optional(),
});

export type GuestMessageComposerProps = z.infer<typeof GuestMessageComposerPropsSchema>;

export function GuestMessageComposer({
  to: initialTo,
  subject: initialSubject,
  body: initialBody,
  guestId,
  template,
  compact = false,
  onSend,
  onClose,
}: GuestMessageComposerProps) {
  const { clearDraftMessage } = useHotel();
  const [to, setTo] = useState(initialTo);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const guest = guestId ? guests.find((g) => g.id === guestId) : null;

  const handleSend = async () => {
    setIsSending(true);
    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSending(false);
    setSent(true);
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
      <div className="bg-slate-800 rounded-lg p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <Send className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Message Sent!</h3>
        <p className="text-slate-400">Your message has been sent to {to}</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-slate-800 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-white flex items-center gap-2">
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
            <span className="text-slate-500">To: </span>
            <span className="text-white">{to}</span>
          </div>
          <div>
            <span className="text-slate-500">Subject: </span>
            <span className="text-white">{subject}</span>
          </div>
          <div className="text-slate-400 text-xs line-clamp-2">{body}</div>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleSend}
            disabled={isSending}
            className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white text-sm rounded transition-colors flex items-center justify-center gap-1"
          >
            {isSending ? "Sending..." : (
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
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Compose Message</h3>
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
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        )}
      </div>

      {/* Guest Context */}
      {guest && (
        <div className="px-4 py-3 bg-slate-700/30 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-300">
              {guest.firstName} {guest.lastName}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded ${
              guest.loyaltyTier === "Platinum" ? "bg-purple-500/20 text-purple-400" :
              guest.loyaltyTier === "Gold" ? "bg-amber-500/20 text-amber-400" :
              "bg-slate-600 text-slate-300"
            }`}>
              {guest.loyaltyTier}
            </span>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="p-4 space-y-4">
        {/* To */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">To</label>
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Message</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* AI indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Sparkles className="w-3 h-3" />
          <span>This message was drafted by AI based on context</span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-slate-700 flex items-center justify-end gap-3">
        {onClose && (
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-slate-600 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSend}
          disabled={isSending || !to || !subject || !body}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
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
