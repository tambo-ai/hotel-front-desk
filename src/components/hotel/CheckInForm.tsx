"use client";

import { useHotel } from "@/lib/hotel-store";
import { guests, reservations } from "@/data/mock-data";
import { RoomGrid } from "./RoomGrid";
import { BillingStatement } from "./BillingStatement";
import { GuestProfile } from "./GuestProfile";
import {
  Calendar,
  BedDouble,
  CheckCircle,
  X,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export function CheckInForm() {
  const {
    state,
    completeCheckIn,
    cancelCheckIn,
    getAvailableRooms,
    stageRoomAssignment,
  } = useHotel();

  const reservationId = state.checkInReservationId;
  if (!reservationId) return null;

  const reservation = reservations.find((r) => r.id === reservationId);
  if (!reservation) return null;

  const guest = guests.find((g) => g.id === reservation.guestId);
  if (!guest) return null;

  // Get available rooms of the requested type
  const availableRooms = getAvailableRooms(reservation.roomType);

  // Check if a room has been staged
  const stagedRoom = state.stagedRoomAssignment?.newRoom;
  const displayRoom = stagedRoom || reservation.roomNumber;

  const handleRoomSelect = (roomNumber: number) => {
    stageRoomAssignment(reservationId, roomNumber, reservation.roomNumber);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-backdrop p-4">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-border bg-background shadow-lg animate-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-success">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Check-in Guest
              </h2>
              <code className="text-xs text-muted-foreground">
                {reservation.confirmationNumber}
              </code>
            </div>
          </div>
          <button
            onClick={cancelCheckIn}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-ring"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Column - Guest & Reservation Info */}
            <div className="space-y-4">
              {/* Guest Profile */}
              <GuestProfile guest={guest} showHistory={false} />

              {/* Reservation Details */}
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Reservation Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-[11px] text-muted-foreground">
                        Stay Period
                      </p>
                      <p className="text-sm text-foreground">
                        {new Date(reservation.checkInDate).toLocaleDateString()}{" "}
                        -{" "}
                        {new Date(
                          reservation.checkOutDate,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BedDouble className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-[11px] text-muted-foreground">
                        Room Type Booked
                      </p>
                      <p className="text-sm text-foreground">
                        {reservation.roomType}
                      </p>
                    </div>
                  </div>
                  {reservation.specialRequests.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Sparkles className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-[11px] text-muted-foreground">
                          Special Requests
                        </p>
                        <ul className="text-sm text-foreground">
                          {reservation.specialRequests.map((req, i) => (
                            <li key={i}>• {req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Billing Preview */}
              <BillingStatement reservationId={reservationId} />
            </div>

            {/* Right Column - Room Selection */}
            <div className="space-y-4">
              {/* Current Room Assignment */}
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Room Assignment
                </h3>
                {displayRoom ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-success">
                        <span className="font-bold text-white">
                          {displayRoom}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Room {displayRoom}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {reservation.roomType}
                        </p>
                      </div>
                    </div>
                    {stagedRoom && stagedRoom !== reservation.roomNumber && (
                      <span className="rounded bg-warning/20 px-2 py-1 text-xs text-warning">
                        Changed from {reservation.roomNumber || "unassigned"}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No room assigned yet. Select one below.
                  </p>
                )}
              </div>

              {/* Available Rooms */}
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Available {reservation.roomType} Rooms (
                  {availableRooms.length})
                </h3>
                {availableRooms.length > 0 ? (
                  <RoomGrid
                    rooms={availableRooms}
                    highlightedRooms={stagedRoom ? [stagedRoom] : []}
                    compact
                    onRoomSelect={handleRoomSelect}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No available {reservation.roomType} rooms. Consider an
                    upgrade.
                  </p>
                )}
              </div>

              {/* Upgrade Options */}
              {reservation.roomType !== "Suite" && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Upgrade Options
                  </h3>
                  <div className="space-y-2">
                    {reservation.roomType === "Queen" && (
                      <button
                        onClick={() => {
                          const kings = state.rooms.filter(
                            (r) =>
                              r.type === "King" &&
                              (r.status === "available" ||
                                r.status === "clean"),
                          );
                          if (kings.length > 0) {
                            handleRoomSelect(kings[0].number);
                          }
                        }}
                        className="w-full rounded-md bg-secondary/50 p-3 text-left transition-colors hover:bg-secondary"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                Upgrade to King
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {
                                  state.rooms.filter(
                                    (r) =>
                                      r.type === "King" &&
                                      (r.status === "available" ||
                                        r.status === "clean"),
                                  ).length
                                }{" "}
                                rooms available
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-success">
                            +$30/night
                          </span>
                        </div>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        const suites = state.rooms.filter(
                          (r) =>
                            r.type === "Suite" &&
                            (r.status === "available" || r.status === "clean"),
                        );
                        if (suites.length > 0) {
                          handleRoomSelect(suites[0].number);
                        }
                      }}
                      className="w-full rounded-md bg-secondary/50 p-3 text-left transition-colors hover:bg-secondary"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              Upgrade to Suite
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {
                                state.rooms.filter(
                                  (r) =>
                                    r.type === "Suite" &&
                                    (r.status === "available" ||
                                      r.status === "clean"),
                                ).length
                              }{" "}
                              rooms available
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-success">
                          +${reservation.roomType === "Queen" ? "190" : "160"}
                          /night
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border bg-card px-4 py-3">
          <div className="text-sm text-muted-foreground">
            {state.stagedBillingChanges.length > 0 && (
              <span className="text-warning">
                {state.stagedBillingChanges.length} billing change(s) pending
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={cancelCheckIn}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-ring"
            >
              Cancel
            </button>
            <button
              onClick={completeCheckIn}
              disabled={!displayRoom}
              className="flex items-center gap-2 rounded-md bg-success px-5 py-2 text-sm font-medium text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 focus-ring"
            >
              <CheckCircle className="h-4 w-4" />
              Complete Check-in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
