"use client";

import { z } from "zod";
import { tierColors } from "@/lib/hotel-types";
import { useHotel } from "@/lib/hotel-store";
import { guests, reservations as allReservations } from "@/data/mock-data";
import { Clock, Award, BedDouble, MessageSquare, User } from "lucide-react";

// Schema for Tambo component registration - fetches arrivals internally
export const ArrivalsTablePropsSchema = z.object({
  highlightedIds: z
    .array(z.string())
    .optional()
    .describe("Reservation IDs to highlight"),
  showVipOnly: z
    .boolean()
    .optional()
    .describe("Only show VIP (Gold/Platinum) guests"),
  compact: z.boolean().optional().describe("Compact mode for chat embedding"),
});

export type ArrivalsTableProps = z.infer<typeof ArrivalsTablePropsSchema>;

export function ArrivalsTable({
  highlightedIds,
  showVipOnly = false,
  compact = false,
}: ArrivalsTableProps) {
  const { state, selectReservation, startCheckIn } = useHotel();

  // Fetch today's arrivals internally
  const today = new Date().toISOString().split("T")[0];
  const reservations = state?.reservations || allReservations;
  let arrivals = reservations.filter(
    (r) => r.checkInDate === today && (r.status === "confirmed" || r.status === "checked_in")
  );

  // Filter for VIP only if requested
  if (showVipOnly) {
    arrivals = arrivals.filter((res) => {
      const guest = guests.find((g) => g.id === res.guestId);
      return guest?.loyaltyTier === "Gold" || guest?.loyaltyTier === "Platinum";
    });
  }

  // Sort by estimated arrival time
  arrivals = [...arrivals].sort((a, b) => {
    const timeA = a.estimatedArrivalTime || "23:59";
    const timeB = b.estimatedArrivalTime || "23:59";
    return timeA.localeCompare(timeB);
  });

  // Use provided highlights or state highlights
  const highlighted = highlightedIds || state.highlightedReservationIds;

  if (arrivals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
        <div className="mb-3 rounded-full bg-muted p-3">
          <User className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          No arrivals {showVipOnly ? "(VIP only)" : ""} for today
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="rounded-lg border border-border bg-card p-3">
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Today's Arrivals ({arrivals.length})
        </h3>
        <div className="space-y-1">
          {arrivals.slice(0, 5).map((res) => {
            const guest = guests.find((g) => g.id === res.guestId);
            const isHighlighted = highlighted.includes(res.id);

            return (
              <div
                key={res.id}
                className={`flex items-center justify-between rounded-md px-2.5 py-2 transition-colors ${
                  isHighlighted
                    ? "bg-accent/15 ring-1 ring-accent/50"
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
              >
                <div className="flex items-center gap-2">
                  {guest && (
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${tierColors[guest.loyaltyTier]}`}
                    />
                  )}
                  <span className="text-sm text-foreground">
                    {guest?.firstName} {guest?.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{res.roomType}</span>
                  {res.estimatedArrivalTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {res.estimatedArrivalTime}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          {arrivals.length > 5 && (
            <p className="pt-1 text-center text-xs text-muted-foreground">
              +{arrivals.length - 5} more arrivals
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-medium text-foreground">
          Today's Arrivals
          <span className="ml-2 text-muted-foreground">
            ({arrivals.length})
          </span>
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Guest
              </th>
              <th className="hidden px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground sm:table-cell">
                Confirmation
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Room
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                ETA
              </th>
              <th className="hidden px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground lg:table-cell">
                Notes
              </th>
              <th className="px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {arrivals.map((res, idx) => {
              const guest = guests.find((g) => g.id === res.guestId);
              const isHighlighted = highlighted.includes(res.id);
              const isVip =
                guest?.loyaltyTier === "Gold" ||
                guest?.loyaltyTier === "Platinum";

              return (
                <tr
                  key={res.id}
                  className={`cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-hover-bg ${
                    isHighlighted ? "bg-accent/10" : ""
                  }`}
                  onClick={() => selectReservation(res.id)}
                >
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      {guest && (
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold text-white ${tierColors[guest.loyaltyTier]}`}
                        >
                          {guest.loyaltyTier === "Platinum"
                            ? "PLT"
                            : guest.loyaltyTier === "Gold"
                              ? "GLD"
                              : guest.loyaltyTier.substring(0, 3).toUpperCase()}
                        </span>
                      )}
                      <span className="font-medium text-foreground whitespace-nowrap">
                        {guest?.firstName} {guest?.lastName}
                      </span>
                      {isVip && <Award className="h-3.5 w-3.5 text-warning shrink-0" />}
                    </div>
                  </td>
                  <td className="hidden px-3 py-2.5 sm:table-cell">
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                      {res.confirmationNumber}
                    </code>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <BedDouble className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-sm text-foreground whitespace-nowrap">
                        {res.roomNumber
                          ? `${res.roomNumber}`
                          : res.roomType}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    {res.estimatedArrivalTime ? (
                      <div className="flex items-center gap-1 text-sm text-foreground whitespace-nowrap">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        {res.estimatedArrivalTime}
                      </div>
                    ) : (
                      <span className="text-muted-foreground/50">—</span>
                    )}
                  </td>
                  <td className="hidden px-3 py-2.5 lg:table-cell">
                    {res.specialRequests.length > 0 ? (
                      <div
                        className="flex items-center gap-1.5 text-muted-foreground"
                        title={res.specialRequests.join(", ")}
                      >
                        <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                        <span className="text-xs whitespace-nowrap">
                          {res.specialRequests.length} request(s)
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground/50">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    {res.status === "confirmed" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startCheckIn(res.id);
                        }}
                        className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-all hover:opacity-90 focus-ring"
                      >
                        Check In
                      </button>
                    )}
                    {res.status === "checked_in" && (
                      <span className="text-xs font-medium text-success">
                        Checked In
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
