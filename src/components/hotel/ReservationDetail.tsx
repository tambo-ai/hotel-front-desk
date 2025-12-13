"use client";

import { z } from "zod";
import { ReservationSchema, GuestSchema } from "@/lib/hotel-types";
import { guests } from "@/data/mock-data";
import { useHotel } from "@/lib/hotel-store";
import {
  Calendar,
  User,
  BedDouble,
  Clock,
  MessageSquare,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

// Schema for Tambo component registration
export const ReservationDetailPropsSchema = z.object({
  reservation: ReservationSchema.describe("Reservation data to display"),
  showActions: z.boolean().optional().describe("Show action buttons"),
  compact: z.boolean().optional().describe("Compact mode for chat embedding"),
});

export type ReservationDetailProps = z.infer<typeof ReservationDetailPropsSchema>;

const statusStyles = {
  confirmed: { bg: "bg-blue-500/20", text: "text-blue-400", icon: AlertCircle, label: "Confirmed" },
  checked_in: { bg: "bg-emerald-500/20", text: "text-emerald-400", icon: CheckCircle, label: "Checked In" },
  checked_out: { bg: "bg-slate-500/20", text: "text-slate-400", icon: CheckCircle, label: "Checked Out" },
  cancelled: { bg: "bg-red-500/20", text: "text-red-400", icon: XCircle, label: "Cancelled" },
};

const tierColors = {
  Member: "bg-slate-600",
  Silver: "bg-slate-400",
  Gold: "bg-amber-500",
  Platinum: "bg-purple-500",
};

export function ReservationDetail({
  reservation,
  showActions = false,
  compact = false,
}: ReservationDetailProps) {
  const hotelContext = useHotel();
  const state = hotelContext?.state;
  const startCheckIn = hotelContext?.startCheckIn;

  // Defensive check for undefined reservation
  if (!reservation) {
    return (
      <div className="bg-slate-800 rounded-lg p-4 text-slate-400">
        No reservation data available
      </div>
    );
  }

  const guest = guests.find((g) => g.id === reservation.guestId);
  const status = statusStyles[reservation.status] || statusStyles.confirmed;
  const StatusIcon = status?.icon || AlertCircle;

  // Check if there's a staged room assignment for this reservation
  const stagedRoom =
    state?.stagedRoomAssignment?.reservationId === reservation.id
      ? state.stagedRoomAssignment.newRoom
      : null;

  const displayRoomNumber = stagedRoom || reservation.roomNumber;

  const checkInDate = new Date(reservation.checkInDate);
  const checkOutDate = new Date(reservation.checkOutDate);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  if (compact) {
    return (
      <div className="bg-slate-800 rounded-lg p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white truncate">
                {guest?.firstName} {guest?.lastName}
              </span>
              {guest && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${tierColors[guest.loyaltyTier]} text-white`}>
                  {guest.loyaltyTier}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Conf# {reservation.confirmationNumber}
            </p>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded ${status.bg}`}>
            <StatusIcon className={`w-3 h-3 ${status.text}`} />
            <span className={`text-xs ${status.text}`}>{status.label}</span>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1 text-slate-400">
            <Calendar className="w-3 h-3" />
            <span>{checkInDate.toLocaleDateString()} - {checkOutDate.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <BedDouble className="w-3 h-3" />
            <span>
              {displayRoomNumber ? `Room ${displayRoomNumber}` : reservation.roomType}
              {stagedRoom && <span className="text-amber-400 ml-1">(staged)</span>}
            </span>
          </div>
        </div>

        {reservation.specialRequests?.length > 0 && (
          <div className="mt-2 text-xs text-slate-500">
            <MessageSquare className="w-3 h-3 inline mr-1" />
            {reservation.specialRequests.join(", ")}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-white">
                {guest?.firstName} {guest?.lastName}
              </h2>
              {guest && (
                <span className={`text-xs px-2 py-1 rounded ${tierColors[guest.loyaltyTier]} text-white flex items-center gap-1`}>
                  <Award className="w-3 h-3" />
                  {guest.loyaltyTier}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Confirmation: <span className="text-slate-300 font-mono">{reservation.confirmationNumber}</span>
            </p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bg}`}>
            <StatusIcon className={`w-4 h-4 ${status.text}`} />
            <span className={`text-sm font-medium ${status.text}`}>{status.label}</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wide">Check-in</label>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-white">{checkInDate.toLocaleDateString()}</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wide">Check-out</label>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-white">{checkOutDate.toLocaleDateString()}</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wide">Duration</label>
            <p className="text-white mt-1">{nights} night{nights !== 1 ? "s" : ""}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wide">Room</label>
            <div className="flex items-center gap-2 mt-1">
              <BedDouble className="w-4 h-4 text-slate-400" />
              <span className="text-white">
                {displayRoomNumber ? (
                  <>
                    Room {displayRoomNumber}
                    {stagedRoom && (
                      <span className="text-amber-400 text-xs ml-2">(staged change)</span>
                    )}
                  </>
                ) : (
                  <span className="text-slate-400">Not assigned - {reservation.roomType}</span>
                )}
              </span>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wide">Room Type</label>
            <p className="text-white mt-1">{reservation.roomType}</p>
          </div>
          {reservation.estimatedArrivalTime && (
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wide">ETA</label>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-white">{reservation.estimatedArrivalTime}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Special Requests */}
      {reservation.specialRequests?.length > 0 && (
        <div className="px-4 pb-4">
          <label className="text-xs text-slate-500 uppercase tracking-wide">Special Requests</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {reservation.specialRequests.map((request, i) => (
              <span
                key={i}
                className="text-sm px-3 py-1 bg-slate-700 text-slate-300 rounded-full flex items-center gap-1"
              >
                <MessageSquare className="w-3 h-3" />
                {request}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contact */}
      {guest && (
        <div className="px-4 pb-4">
          <label className="text-xs text-slate-500 uppercase tracking-wide">Contact</label>
          <div className="mt-1 text-sm text-slate-300">
            <p>{guest.email}</p>
            <p>{guest.phone}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && reservation.status === "confirmed" && startCheckIn && (
        <div className="p-4 border-t border-slate-700 bg-slate-700/30">
          <button
            onClick={() => startCheckIn(reservation.id)}
            className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
          >
            Start Check-in
          </button>
        </div>
      )}
    </div>
  );
}
