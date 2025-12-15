"use client";

import { z } from "zod";
import { ReservationSchema, tierColors } from "@/lib/hotel-types";
import { useHotel } from "@/lib/hotel-store";
import { guests } from "@/data/mock-data";
import { LogOut, BedDouble, DollarSign, User, AlertCircle } from "lucide-react";

// Schema for Tambo component registration
export const DeparturesTablePropsSchema = z.object({
  reservations: z
    .array(ReservationSchema)
    .optional()
    .describe("Reservations to display (defaults to today's departures)"),
  highlightedIds: z
    .array(z.string())
    .optional()
    .describe("Reservation IDs to highlight"),
  showEarlyOnly: z.boolean().optional().describe("Only show early check-outs"),
  compact: z.boolean().optional().describe("Compact mode for chat embedding"),
});

export type DeparturesTableProps = z.infer<typeof DeparturesTablePropsSchema>;

export function DeparturesTable({
  reservations: providedReservations,
  highlightedIds,
  showEarlyOnly = false,
  compact = false,
}: DeparturesTableProps) {
  const {
    state,
    getTodaysDepartures,
    selectReservation,
    getBillingForReservation,
  } = useHotel();

  // Get departures from props or state
  let departures = providedReservations || getTodaysDepartures();

  // Filter for early checkouts only if requested
  if (showEarlyOnly) {
    departures = departures.filter((res) => res.isEarlyCheckout === true);
  }

  // Use provided highlights or state highlights
  const highlighted = highlightedIds || state.highlightedReservationIds;

  if (departures.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
        <div className="mb-3 rounded-full bg-muted p-3">
          <User className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          No departures {showEarlyOnly ? "(early only)" : ""} for today
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="rounded-lg border border-border bg-card p-3">
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Today's Departures ({departures.length})
        </h3>
        <div className="space-y-1">
          {departures.slice(0, 5).map((res) => {
            const guest = guests.find((g) => g.id === res.guestId);
            const isHighlighted = highlighted.includes(res.id);
            const billing = getBillingForReservation(res.id);
            const total = billing.reduce((sum, item) => sum + item.amount, 0);
            const isEarly = res.isEarlyCheckout === true;

            return (
              <div
                key={res.id}
                className={`flex items-center justify-between rounded-md px-2.5 py-2 transition-colors ${
                  isHighlighted
                    ? "bg-accent/15 ring-1 ring-accent/50"
                    : "bg-secondary/50 hover:bg-secondary"
                } ${isEarly ? "border-l-2 border-l-warning" : ""}`}
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
                  {isEarly && (
                    <span className="rounded bg-warning/20 px-1 py-0.5 text-[9px] font-medium text-warning">
                      Early
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">
                    Room {res.roomNumber}
                  </span>
                  <span className="font-medium text-success">
                    ${total.toFixed(0)}
                  </span>
                </div>
              </div>
            );
          })}
          {departures.length > 5 && (
            <p className="pt-1 text-center text-xs text-muted-foreground">
              +{departures.length - 5} more departures
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
          Today's Departures
          <span className="ml-2 text-muted-foreground">
            ({departures.length})
          </span>
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Guest
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Room
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Check-in Date
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Balance
              </th>
              <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {departures.map((res) => {
              const guest = guests.find((g) => g.id === res.guestId);
              const isHighlighted = highlighted.includes(res.id);
              const billing = getBillingForReservation(res.id);
              const total = billing.reduce(
                (sum, item) => sum + (item.isComped ? 0 : item.amount),
                0,
              );
              const isEarly = res.isEarlyCheckout === true;

              return (
                <tr
                  key={res.id}
                  className={`cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-hover-bg ${
                    isHighlighted ? "bg-accent/10" : ""
                  } ${isEarly ? "border-l-2 border-l-warning" : ""}`}
                  onClick={() => selectReservation(res.id)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {guest && (
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold text-white ${tierColors[guest.loyaltyTier]}`}
                        >
                          {guest.loyaltyTier.substring(0, 3).toUpperCase()}
                        </span>
                      )}
                      <span className="font-medium text-foreground">
                        {guest?.firstName} {guest?.lastName}
                      </span>
                      {isEarly && (
                        <span className="flex items-center gap-1 rounded bg-warning/20 px-1.5 py-0.5 text-[10px] font-medium text-warning">
                          <AlertCircle className="h-3 w-3" />
                          Early
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <BedDouble className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm text-foreground">
                        Room {res.roomNumber}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">
                      {new Date(res.checkInDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-0.5 font-medium text-success">
                      <DollarSign className="h-3.5 w-3.5" />
                      {total.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectReservation(res.id);
                      }}
                      className="ml-auto flex items-center gap-1.5 rounded-md bg-info px-3 py-1.5 text-xs font-medium text-white transition-all hover:opacity-90 focus-ring"
                    >
                      <LogOut className="h-3 w-3" />
                      Check Out
                    </button>
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
