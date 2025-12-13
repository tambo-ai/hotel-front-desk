"use client";

import { z } from "zod";
import { GuestSchema } from "@/lib/hotel-types";
import { User, Mail, Phone, Award, Star, Clock } from "lucide-react";

// Schema for Tambo component registration
export const GuestProfilePropsSchema = z.object({
  guest: GuestSchema.describe("Guest data to display"),
  showHistory: z.boolean().optional().describe("Whether to show stay history"),
  compact: z.boolean().optional().describe("Compact mode for chat embedding"),
});

export type GuestProfileProps = z.infer<typeof GuestProfilePropsSchema>;

const tierColors = {
  Member: "bg-slate-500",
  Silver: "bg-slate-400",
  Gold: "bg-amber-500",
  Platinum: "bg-purple-500",
};

const tierBadgeStyles = {
  Member: "bg-slate-600 text-slate-200",
  Silver: "bg-gradient-to-r from-slate-400 to-slate-300 text-slate-800",
  Gold: "bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-900",
  Platinum: "bg-gradient-to-r from-purple-600 to-purple-400 text-white",
};

export function GuestProfile({ guest, showHistory = false, compact = false }: GuestProfileProps) {
  // Defensive check for undefined guest
  if (!guest) {
    return (
      <div className="bg-slate-800 rounded-lg p-4 text-slate-400">
        No guest data available
      </div>
    );
  }

  const totalStays = guest.stayHistory?.length ?? 0;
  const totalSpent = guest.stayHistory?.reduce((sum, stay) => sum + stay.totalSpent, 0) ?? 0;

  // Defensive fallbacks for tier styling
  const tierColor = tierColors[guest.loyaltyTier] || tierColors.Member;
  const tierBadge = tierBadgeStyles[guest.loyaltyTier] || tierBadgeStyles.Member;

  if (compact) {
    return (
      <div className="bg-slate-800 rounded-lg p-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${tierColor} flex items-center justify-center`}>
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white truncate">
                {guest.firstName} {guest.lastName}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${tierBadge}`}>
                {guest.loyaltyTier || "Member"}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate">{guest.email}</p>
          </div>
        </div>
        {totalStays > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-700 flex gap-4 text-xs text-slate-400">
            <span>{totalStays} stays</span>
            <span>${totalSpent.toLocaleString()} total</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className={`p-4 ${tierColor}`}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              {guest.firstName} {guest.lastName}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-sm px-3 py-1 rounded-full ${tierBadge}`}>
                <Award className="w-3 h-3 inline mr-1" />
                {guest.loyaltyTier || "Member"}
              </span>
              <span className="text-sm text-white/80">#{guest.loyaltyNumber}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3 text-slate-300">
          <Mail className="w-4 h-4 text-slate-500" />
          <span>{guest.email}</span>
        </div>
        <div className="flex items-center gap-3 text-slate-300">
          <Phone className="w-4 h-4 text-slate-500" />
          <span>{guest.phone}</span>
        </div>
      </div>

      {/* Preferences */}
      {guest.preferences?.length > 0 && (
        <div className="px-4 pb-4">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Preferences</h3>
          <div className="flex flex-wrap gap-2">
            {guest.preferences.map((pref) => (
              <span
                key={pref}
                className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded-full"
              >
                {pref.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="px-4 pb-4 grid grid-cols-2 gap-4">
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-white">{totalStays}</div>
          <div className="text-xs text-slate-400">Total Stays</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-white">${totalSpent.toLocaleString()}</div>
          <div className="text-xs text-slate-400">Lifetime Value</div>
        </div>
      </div>

      {/* Stay History */}
      {showHistory && guest.stayHistory?.length > 0 && (
        <div className="border-t border-slate-700 p-4">
          <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent Stays
          </h3>
          <div className="space-y-2">
            {guest.stayHistory.slice(0, 5).map((stay) => (
              <div
                key={stay.id}
                className="flex items-center justify-between text-sm bg-slate-700/30 rounded p-2"
              >
                <div>
                  <span className="text-slate-300">Room {stay.roomNumber}</span>
                  <span className="text-slate-500 mx-2">•</span>
                  <span className="text-slate-400">
                    {new Date(stay.checkInDate).toLocaleDateString()} -{" "}
                    {new Date(stay.checkOutDate).toLocaleDateString()}
                  </span>
                </div>
                <span className="text-emerald-400 font-medium">${stay.totalSpent}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
