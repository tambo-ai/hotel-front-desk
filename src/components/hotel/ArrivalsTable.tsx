"use client";

import { z } from "zod";
import { ReservationSchema } from "@/lib/hotel-types";
import { useHotel } from "@/lib/hotel-store";
import { guests } from "@/data/mock-data";
import { Clock, Award, BedDouble, MessageSquare, User } from "lucide-react";

// Schema for Tambo component registration
export const ArrivalsTablePropsSchema = z.object({
  reservations: z.array(ReservationSchema).optional().describe("Reservations to display (defaults to today's arrivals)"),
  highlightedIds: z.array(z.string()).optional().describe("Reservation IDs to highlight"),
  showVipOnly: z.boolean().optional().describe("Only show VIP (Gold/Platinum) guests"),
  compact: z.boolean().optional().describe("Compact mode for chat embedding"),
});

export type ArrivalsTableProps = z.infer<typeof ArrivalsTablePropsSchema>;

const tierColors = {
  Member: "bg-slate-600",
  Silver: "bg-slate-400",
  Gold: "bg-amber-500",
  Platinum: "bg-purple-500",
};

export function ArrivalsTable({
  reservations: providedReservations,
  highlightedIds,
  showVipOnly = false,
  compact = false,
}: ArrivalsTableProps) {
  const { state, getTodaysArrivals, selectReservation, startCheckIn } = useHotel();

  // Get arrivals from props or state
  let arrivals = providedReservations || getTodaysArrivals();

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
      <div className="bg-slate-800 rounded-lg p-6 text-center">
        <User className="w-12 h-12 text-slate-600 mx-auto mb-2" />
        <p className="text-slate-400">No arrivals {showVipOnly ? "(VIP only)" : ""} for today</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-slate-800 rounded-lg p-3">
        <h3 className="text-sm font-medium text-slate-400 mb-2">
          Today's Arrivals ({arrivals.length})
        </h3>
        <div className="space-y-2">
          {arrivals.slice(0, 5).map((res) => {
            const guest = guests.find((g) => g.id === res.guestId);
            const isHighlighted = highlighted.includes(res.id);

            return (
              <div
                key={res.id}
                className={`flex items-center justify-between p-2 rounded ${
                  isHighlighted ? "bg-amber-500/20 ring-1 ring-amber-500" : "bg-slate-700/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  {guest && (
                    <span className={`w-2 h-2 rounded-full ${tierColors[guest.loyaltyTier]}`} />
                  )}
                  <span className="text-sm text-white">
                    {guest?.firstName} {guest?.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{res.roomType}</span>
                  {res.estimatedArrivalTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {res.estimatedArrivalTime}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          {arrivals.length > 5 && (
            <p className="text-xs text-slate-500 text-center">
              +{arrivals.length - 5} more arrivals
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-lg font-semibold text-white">
          Today's Arrivals
          <span className="text-slate-400 text-sm font-normal ml-2">({arrivals.length})</span>
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3">
                Guest
              </th>
              <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3">
                Confirmation
              </th>
              <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3">
                Room
              </th>
              <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3">
                ETA
              </th>
              <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3">
                Notes
              </th>
              <th className="text-right text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {arrivals.map((res) => {
              const guest = guests.find((g) => g.id === res.guestId);
              const isHighlighted = highlighted.includes(res.id);
              const isVip = guest?.loyaltyTier === "Gold" || guest?.loyaltyTier === "Platinum";

              return (
                <tr
                  key={res.id}
                  className={`hover:bg-slate-700/30 cursor-pointer transition-colors ${
                    isHighlighted ? "bg-amber-500/20" : ""
                  }`}
                  onClick={() => selectReservation(res.id)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {guest && (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] text-white ${tierColors[guest.loyaltyTier]}`}>
                          {guest.loyaltyTier === "Platinum" ? "PLT" : guest.loyaltyTier === "Gold" ? "GLD" : guest.loyaltyTier.substring(0, 3).toUpperCase()}
                        </span>
                      )}
                      <span className="text-white font-medium">
                        {guest?.firstName} {guest?.lastName}
                      </span>
                      {isVip && <Award className="w-4 h-4 text-amber-400" />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-slate-300 font-mono text-sm">{res.confirmationNumber}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <BedDouble className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-300">
                        {res.roomNumber ? `Room ${res.roomNumber}` : res.roomType}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {res.estimatedArrivalTime ? (
                      <div className="flex items-center gap-1 text-slate-300">
                        <Clock className="w-4 h-4 text-slate-500" />
                        {res.estimatedArrivalTime}
                      </div>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {res.specialRequests.length > 0 ? (
                      <div className="flex items-center gap-1 text-slate-400" title={res.specialRequests.join(", ")}>
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-xs">{res.specialRequests.length} request(s)</span>
                      </div>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {res.status === "confirmed" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startCheckIn(res.id);
                        }}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded transition-colors"
                      >
                        Check In
                      </button>
                    )}
                    {res.status === "checked_in" && (
                      <span className="text-emerald-400 text-sm">Checked In</span>
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
