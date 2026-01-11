"use client";

import { useHotel } from "@/lib/hotel-store";
import { guests, reservations } from "@/data/mock-data";
import {
  Calendar,
  BedDouble,
  CheckCircle,
  Sparkles,
  ArrowUpRight,
  User,
  CreditCard,
} from "lucide-react";
import { z } from "zod";
import { useTamboComponentState } from "@tambo-ai/react";

// Schema for Tambo component registration
export const CheckInFormPropsSchema = z.object({
  reservationId: z.string().describe("The reservation ID to check in"),
});

export type CheckInFormProps = z.infer<typeof CheckInFormPropsSchema>;

export function CheckInForm({ reservationId }: CheckInFormProps) {
  const { state, stageRoomAssignment, completeCheckIn, startCheckIn } =
    useHotel();

  // Use useTamboComponentState to sync state back to AI
  // AI can see these values in follow-up messages
  const [selectedRoom, setSelectedRoom] = useTamboComponentState<number | null>(
    "selectedRoom",
    null
  );
  const [checkInStatus, setCheckInStatus] = useTamboComponentState<"pending" | "completed">(
    "checkInStatus",
    "pending"
  );

  // Local staging state (for UI coordination with hotel store)
  const stagedRoom = selectedRoom;

  const reservation = reservations.find((r) => r.id === reservationId);
  if (!reservation) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">Reservation not found.</p>
      </div>
    );
  }

  const guest = guests.find((g) => g.id === reservation.guestId);
  if (!guest) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">Guest not found.</p>
      </div>
    );
  }

  // Get available rooms of the requested type
  const availableRooms = state.rooms.filter(
    (r) =>
      r.type === reservation.roomType &&
      (r.status === "available" || r.status === "clean")
  );

  const displayRoom = stagedRoom || reservation.roomNumber;

  const handleRoomSelect = (roomNumber: number) => {
    setSelectedRoom(roomNumber);
    stageRoomAssignment(reservationId, roomNumber, reservation.roomNumber);
  };

  const handleCompleteCheckIn = () => {
    startCheckIn(reservationId);
    if (selectedRoom) {
      stageRoomAssignment(reservationId, selectedRoom, reservation.roomNumber);
    }
    completeCheckIn();
    setCheckInStatus("completed");
  };

  if (checkInStatus === "completed") {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success/20">
          <CheckCircle className="h-6 w-6 text-success" />
        </div>
        <h3 className="mb-1 text-base font-semibold text-foreground">
          Check-in Complete!
        </h3>
        <p className="text-sm text-muted-foreground">
          {guest.firstName} {guest.lastName} → Room {displayRoom}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Header - Compact */}
      <div className="flex items-center gap-2 border-b border-border bg-success/10 px-3 py-2">
        <CheckCircle className="h-4 w-4 text-success" />
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-foreground truncate">
            Check-in: {guest.firstName} {guest.lastName}
          </h2>
        </div>
        <code className="text-xs text-muted-foreground">
          {reservation.confirmationNumber}
        </code>
      </div>

      {/* Content - Single column, compact sections */}
      <div className="p-3 space-y-3">
        {/* Guest & Stay Info - Horizontal on mobile */}
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            <span className="text-foreground">{guest.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-foreground">
              {new Date(reservation.checkInDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {new Date(reservation.checkOutDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <BedDouble className="h-3.5 w-3.5" />
            <span className="text-foreground">{reservation.roomType}</span>
          </div>
        </div>

        {/* Special Requests - Compact */}
        {reservation.specialRequests.length > 0 && (
          <div className="flex items-start gap-1.5 text-xs bg-warning/10 rounded px-2 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
            <span className="text-foreground">
              {reservation.specialRequests.join(", ")}
            </span>
          </div>
        )}

        {/* Room Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Select Room
            </span>
            {displayRoom && (
              <span className="text-xs font-medium text-success">
                Room {displayRoom} selected
              </span>
            )}
          </div>

          {/* Room Grid - Touch-friendly */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
            {availableRooms.map((room) => (
              <button
                key={room.number}
                onClick={() => handleRoomSelect(room.number)}
                className={`
                  aspect-square rounded-md text-sm font-medium transition-all
                  flex items-center justify-center min-h-[44px]
                  ${selectedRoom === room.number
                    ? "bg-success text-white ring-2 ring-success ring-offset-2 ring-offset-card"
                    : "bg-secondary text-foreground hover:bg-secondary/80 active:scale-95"
                  }
                `}
              >
                {room.number}
              </button>
            ))}
          </div>

          {availableRooms.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">
              No {reservation.roomType} rooms available
            </p>
          )}
        </div>

        {/* Upgrade Options - Compact buttons */}
        {reservation.roomType !== "Suite" && (
          <div className="flex gap-2">
            {reservation.roomType === "Queen" && (
              <button
                onClick={() => {
                  const kings = state.rooms.filter(
                    (r) => r.type === "King" && (r.status === "available" || r.status === "clean")
                  );
                  if (kings.length > 0) handleRoomSelect(kings[0].number);
                }}
                className="flex-1 flex items-center justify-between gap-2 rounded-md bg-secondary/50 px-3 py-2 text-left transition-colors hover:bg-secondary active:scale-[0.98]"
              >
                <div className="flex items-center gap-1.5">
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-foreground">King</span>
                </div>
                <span className="text-xs text-success">+$30</span>
              </button>
            )}
            <button
              onClick={() => {
                const suites = state.rooms.filter(
                  (r) => r.type === "Suite" && (r.status === "available" || r.status === "clean")
                );
                if (suites.length > 0) handleRoomSelect(suites[0].number);
              }}
              className="flex-1 flex items-center justify-between gap-2 rounded-md bg-secondary/50 px-3 py-2 text-left transition-colors hover:bg-secondary active:scale-[0.98]"
            >
              <div className="flex items-center gap-1.5">
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">Suite</span>
              </div>
              <span className="text-xs text-success">
                +${reservation.roomType === "Queen" ? "190" : "160"}
              </span>
            </button>
          </div>
        )}

        {/* Billing Summary - Compact */}
        <div className="flex items-center justify-between text-xs bg-secondary/30 rounded px-3 py-2">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CreditCard className="h-3.5 w-3.5" />
            <span>Total Charges</span>
          </div>
          <span className="font-medium text-foreground">
            ${state.billingItems
              .filter((b) => b.reservationId === reservationId)
              .reduce((sum, b) => sum + b.amount, 0)
              .toFixed(2)}
          </span>
        </div>
      </div>

      {/* Footer - Full width button with pulse animation when room selected */}
      <div className="p-3 pt-0">
        <button
          onClick={handleCompleteCheckIn}
          disabled={!displayRoom}
          className={`w-full flex items-center justify-center gap-2 rounded-md bg-success px-4 py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${displayRoom ? "animate-pulse ring-2 ring-success/50 ring-offset-2 ring-offset-card" : ""}`}
        >
          <CheckCircle className="h-4 w-4" />
          Complete Check-in
        </button>
      </div>
    </div>
  );
}
