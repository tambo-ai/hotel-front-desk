"use client";

import { z } from "zod";
import { GuestSchema, tierColors, tierBadgeStyles } from "@/lib/hotel-types";
import { User, Mail, Phone, Award, Clock } from "lucide-react";

// Schema for Tambo component registration
export const GuestProfilePropsSchema = z.object({
  guest: GuestSchema.describe("Guest data to display"),
  showHistory: z.boolean().optional().describe("Whether to show stay history"),
  compact: z.boolean().optional().describe("Compact mode for chat embedding"),
});

export type GuestProfileProps = z.infer<typeof GuestProfilePropsSchema>;

export function GuestProfile({
  guest,
  showHistory = false,
  compact = false,
}: GuestProfileProps) {
  // Defensive check for undefined guest
  if (!guest) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 p-8 text-center">
        <p className="text-sm text-muted-foreground">No guest data available</p>
      </div>
    );
  }

  const totalStays = guest.stayHistory?.length ?? 0;
  const totalSpent =
    guest.stayHistory?.reduce((sum, stay) => sum + stay.totalSpent, 0) ?? 0;

  // Defensive fallbacks for tier styling
  const tierColor = tierColors[guest.loyaltyTier] || tierColors.Member;
  const tierBadge =
    tierBadgeStyles[guest.loyaltyTier] || tierBadgeStyles.Member;

  if (compact) {
    return (
      <div className="rounded-lg border border-border bg-card p-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full ${tierColor}`}
          >
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate font-medium text-foreground">
                {guest.firstName} {guest.lastName}
              </span>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${tierBadge}`}
              >
                {guest.loyaltyTier || "Member"}
              </span>
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {guest.email}
            </p>
          </div>
        </div>
        {totalStays > 0 && (
          <div className="mt-2 flex gap-3 border-t border-border pt-2 text-xs text-muted-foreground">
            <span>{totalStays} stays</span>
            <span className="text-success">${totalSpent.toLocaleString()}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {/* Header */}
      <div className={`p-4 ${tierColor}`}>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              {guest.firstName} {guest.lastName}
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${tierBadge}`}
              >
                <Award className="h-3 w-3" />
                {guest.loyaltyTier || "Member"}
              </span>
              <code className="rounded bg-white/20 px-1.5 py-0.5 font-mono text-[10px] text-white/80">
                {guest.loyaltyNumber}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 p-4">
        <div className="flex items-center gap-2.5 text-sm text-foreground">
          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{guest.email}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-foreground">
          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{guest.phone}</span>
        </div>
      </div>

      {/* Preferences */}
      {guest.preferences?.length > 0 && (
        <div className="border-t border-border px-4 py-3">
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Preferences
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {guest.preferences.map((pref) => (
              <span
                key={pref}
                className="rounded-full bg-secondary px-2 py-0.5 text-xs text-foreground"
              >
                {pref.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 border-t border-border p-4">
        <div className="rounded-md bg-muted/50 p-3 text-center">
          <div className="text-xl font-semibold text-foreground">
            {totalStays}
          </div>
          <div className="text-[11px] text-muted-foreground">Total Stays</div>
        </div>
        <div className="rounded-md bg-muted/50 p-3 text-center">
          <div className="text-xl font-semibold text-success">
            ${totalSpent.toLocaleString()}
          </div>
          <div className="text-[11px] text-muted-foreground">
            Lifetime Value
          </div>
        </div>
      </div>

      {/* Stay History */}
      {showHistory && guest.stayHistory?.length > 0 && (
        <div className="border-t border-border p-4">
          <h3 className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            Recent Stays
          </h3>
          <div className="space-y-1.5">
            {guest.stayHistory.slice(0, 5).map((stay) => (
              <div
                key={stay.id}
                className="flex items-center justify-between rounded-md bg-muted/30 px-2.5 py-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    Room {stay.roomNumber}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(stay.checkInDate).toLocaleDateString()} -{" "}
                    {new Date(stay.checkOutDate).toLocaleDateString()}
                  </span>
                </div>
                <span className="font-medium text-success">
                  ${stay.totalSpent}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
