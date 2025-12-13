"use client";

import { z } from "zod";
import { ReservationSchema } from "@/lib/hotel-types";
import { useHotel } from "@/lib/hotel-store";
import { guests } from "@/data/mock-data";
import { Clock, LogOut, BedDouble, DollarSign, User } from "lucide-react";

// Schema for Tambo component registration
export const DeparturesTablePropsSchema = z.object({
  reservations: z.array(ReservationSchema).optional().describe("Reservations to display (defaults to today's departures)"),
  highlightedIds: z.array(z.string()).optional().describe("Reservation IDs to highlight"),
  showEarlyOnly: z.boolean().optional().describe("Only show early check-outs"),
  compact: z.boolean().optional().describe("Compact mode for chat embedding"),
});

export type DeparturesTableProps = z.infer<typeof DeparturesTablePropsSchema>;

const tierColors = {
  Member: "bg-slate-600",
  Silver: "bg-slate-400",
  Gold: "bg-amber-500",
  Platinum: "bg-purple-500",
};

export function DeparturesTable({
  reservations: providedReservations,
  highlightedIds,
  showEarlyOnly = false,
  compact = false,
}: DeparturesTableProps) {
  const { state, getTodaysDepartures, selectReservation, getBillingForReservation } = useHotel();

  // Get departures from props or state
  let departures = providedReservations || getTodaysDepartures();

  // For demo purposes, treat some departures as "early" based on check-in date
  // In a real app, this would be based on original checkout date vs actual
  if (showEarlyOnly) {
    departures = departures.filter((res, index) => index % 3 === 0); // Just filter some for demo
  }

  // Use provided highlights or state highlights
  const highlighted = highlightedIds || state.highlightedReservationIds;

  if (departures.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 text-center">
        <User className="w-12 h-12 text-slate-600 mx-auto mb-2" />
        <p className="text-slate-400">No departures {showEarlyOnly ? "(early only)" : ""} for today</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-slate-800 rounded-lg p-3">
        <h3 className="text-sm font-medium text-slate-400 mb-2">
          Today's Departures ({departures.length})
        </h3>
        <div className="space-y-2">
          {departures.slice(0, 5).map((res) => {
            const guest = guests.find((g) => g.id === res.guestId);
            const isHighlighted = highlighted.includes(res.id);
            const billing = getBillingForReservation(res.id);
            const total = billing.reduce((sum, item) => sum + item.amount, 0);

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
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Room {res.roomNumber}</span>
                  <span className="text-emerald-400">${total.toFixed(0)}</span>
                </div>
              </div>
            );
          })}
          {departures.length > 5 && (
            <p className="text-xs text-slate-500 text-center">
              +{departures.length - 5} more departures
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
          Today's Departures
          <span className="text-slate-400 text-sm font-normal ml-2">({departures.length})</span>
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
                Room
              </th>
              <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3">
                Check-in Date
              </th>
              <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3">
                Balance
              </th>
              <th className="text-right text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {departures.map((res) => {
              const guest = guests.find((g) => g.id === res.guestId);
              const isHighlighted = highlighted.includes(res.id);
              const billing = getBillingForReservation(res.id);
              const total = billing.reduce((sum, item) => sum + (item.isComped ? 0 : item.amount), 0);

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
                          {guest.loyaltyTier.substring(0, 3).toUpperCase()}
                        </span>
                      )}
                      <span className="text-white font-medium">
                        {guest?.firstName} {guest?.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <BedDouble className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-300">Room {res.roomNumber}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-slate-300">
                      {new Date(res.checkInDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-emerald-400 font-medium">
                      <DollarSign className="w-4 h-4" />
                      {total.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectReservation(res.id);
                      }}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors flex items-center gap-1 ml-auto"
                    >
                      <LogOut className="w-3 h-3" />
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
