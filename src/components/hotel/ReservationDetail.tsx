"use client";

import { z } from "zod";
import { ReservationSchema, tierColors } from "@/lib/hotel-types";
import { guests } from "@/data/mock-data";
import { useHotel } from "@/lib/hotel-store";
import {
  Calendar,
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

export type ReservationDetailProps = z.infer<
  typeof ReservationDetailPropsSchema
>;

const statusStyles = {
  confirmed: {
    bg: "bg-info/10",
    text: "text-info",
    icon: AlertCircle,
    label: "Confirmed",
  },
  checked_in: {
    bg: "bg-success/10",
    text: "text-success",
    icon: CheckCircle,
    label: "Checked In",
  },
  checked_out: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    icon: CheckCircle,
    label: "Checked Out",
  },
  cancelled: {
    bg: "bg-destructive/10",
    text: "text-destructive",
    icon: XCircle,
    label: "Cancelled",
  },
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
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No reservation data available
        </p>
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
  const nights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (compact) {
    return (
      <div className="rounded-lg border border-border bg-card p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate font-medium text-foreground">
                {guest?.firstName} {guest?.lastName}
              </span>
              {guest && (
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-medium text-white ${tierColors[guest.loyaltyTier]}`}
                >
                  {guest.loyaltyTier}
                </span>
              )}
            </div>
            <code className="text-xs text-muted-foreground">
              {reservation.confirmationNumber}
            </code>
          </div>
          <div
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${status.bg}`}
          >
            <StatusIcon className={`h-3 w-3 ${status.text}`} />
            <span className={`text-[10px] font-medium ${status.text}`}>
              {status.label}
            </span>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>
              {checkInDate.toLocaleDateString()} -{" "}
              {checkOutDate.toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <BedDouble className="h-3 w-3" />
            <span>
              {displayRoomNumber
                ? `Room ${displayRoomNumber}`
                : reservation.roomType}
              {stagedRoom && (
                <span className="ml-1 text-warning">(staged)</span>
              )}
            </span>
          </div>
        </div>

        {reservation.specialRequests?.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            <MessageSquare className="mr-1 inline h-3 w-3" />
            {reservation.specialRequests.join(", ")}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-foreground">
                {guest?.firstName} {guest?.lastName}
              </h2>
              {guest && (
                <span
                  className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium text-white ${tierColors[guest.loyaltyTier]}`}
                >
                  <Award className="h-3 w-3" />
                  {guest.loyaltyTier}
                </span>
              )}
            </div>
            <code className="mt-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
              {reservation.confirmationNumber}
            </code>
          </div>
          <div
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 ${status.bg}`}
          >
            <StatusIcon className={`h-3.5 w-3.5 ${status.text}`} />
            <span className={`text-xs font-medium ${status.text}`}>
              {status.label}
            </span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Check-in
            </label>
            <div className="mt-1 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm text-foreground">
                {checkInDate.toLocaleDateString()}
              </span>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Check-out
            </label>
            <div className="mt-1 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm text-foreground">
                {checkOutDate.toLocaleDateString()}
              </span>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Duration
            </label>
            <p className="mt-1 text-sm text-foreground">
              {nights} night{nights !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Room
            </label>
            <div className="mt-1 flex items-center gap-1.5">
              <BedDouble className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm text-foreground">
                {displayRoomNumber ? (
                  <>
                    Room {displayRoomNumber}
                    {stagedRoom && (
                      <span className="ml-1.5 text-xs text-warning">
                        (staged)
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-muted-foreground">
                    Not assigned - {reservation.roomType}
                  </span>
                )}
              </span>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Room Type
            </label>
            <p className="mt-1 text-sm text-foreground">
              {reservation.roomType}
            </p>
          </div>
          {reservation.estimatedArrivalTime && (
            <div>
              <label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                ETA
              </label>
              <div className="mt-1 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  {reservation.estimatedArrivalTime}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Special Requests */}
      {reservation.specialRequests?.length > 0 && (
        <div className="border-t border-border px-4 py-3">
          <label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Special Requests
          </label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {reservation.specialRequests.map((request, i) => (
              <span
                key={i}
                className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs text-foreground"
              >
                <MessageSquare className="h-3 w-3" />
                {request}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contact */}
      {guest && (
        <div className="border-t border-border px-4 py-3">
          <label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Contact
          </label>
          <div className="mt-1 space-y-0.5 text-sm text-muted-foreground">
            <p>{guest.email}</p>
            <p>{guest.phone}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && reservation.status === "confirmed" && startCheckIn && (
        <div className="border-t border-border bg-muted/30 p-4">
          <button
            onClick={() => startCheckIn(reservation.id)}
            className="w-full rounded-md bg-success px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 focus-ring"
          >
            Start Check-in
          </button>
        </div>
      )}
    </div>
  );
}
