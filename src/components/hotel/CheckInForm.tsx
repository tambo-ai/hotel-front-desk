"use client";

import { useHotel } from "@/lib/hotel-store";
import { guests, reservations } from "@/data/mock-data";
import { RoomGrid } from "./RoomGrid";
import { BillingStatement } from "./BillingStatement";
import { GuestProfile } from "./GuestProfile";
import {
  User,
  Calendar,
  BedDouble,
  CreditCard,
  CheckCircle,
  X,
  Sparkles,
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Check-in Guest</h2>
              <p className="text-sm text-slate-400">
                Confirmation: {reservation.confirmationNumber}
              </p>
            </div>
          </div>
          <button
            onClick={cancelCheckIn}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Guest & Reservation Info */}
            <div className="space-y-6">
              {/* Guest Profile */}
              <GuestProfile guest={guest} showHistory={false} />

              {/* Reservation Details */}
              <div className="bg-slate-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-slate-400 mb-3">Reservation Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-400">Stay Period</p>
                      <p className="text-white">
                        {new Date(reservation.checkInDate).toLocaleDateString()} -{" "}
                        {new Date(reservation.checkOutDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BedDouble className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-400">Room Type Booked</p>
                      <p className="text-white">{reservation.roomType}</p>
                    </div>
                  </div>
                  {reservation.specialRequests.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-4 h-4 text-slate-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-slate-400">Special Requests</p>
                        <ul className="text-white">
                          {reservation.specialRequests.map((req, i) => (
                            <li key={i} className="text-sm">• {req}</li>
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
            <div className="space-y-6">
              {/* Current Room Assignment */}
              <div className="bg-slate-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-slate-400 mb-3">Room Assignment</h3>
                {displayRoom ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-emerald-600 flex items-center justify-center">
                        <span className="text-white font-bold">{displayRoom}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Room {displayRoom}</p>
                        <p className="text-sm text-slate-400">{reservation.roomType}</p>
                      </div>
                    </div>
                    {stagedRoom && stagedRoom !== reservation.roomNumber && (
                      <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-400 rounded">
                        Changed from {reservation.roomNumber || "unassigned"}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-400">No room assigned yet. Select one below.</p>
                )}
              </div>

              {/* Available Rooms */}
              <div className="bg-slate-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-slate-400 mb-3">
                  Available {reservation.roomType} Rooms ({availableRooms.length})
                </h3>
                {availableRooms.length > 0 ? (
                  <RoomGrid
                    rooms={availableRooms}
                    highlightedRooms={stagedRoom ? [stagedRoom] : []}
                    compact
                    onRoomSelect={handleRoomSelect}
                  />
                ) : (
                  <p className="text-slate-400 text-sm">
                    No available {reservation.roomType} rooms. Consider an upgrade.
                  </p>
                )}
              </div>

              {/* Upgrade Options */}
              {reservation.roomType !== "Suite" && (
                <div className="bg-slate-800 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-slate-400 mb-3">
                    Upgrade Options
                  </h3>
                  <div className="space-y-2">
                    {reservation.roomType === "Queen" && (
                      <button
                        onClick={() => {
                          // This would filter to King rooms
                          const kings = state.rooms.filter(
                            (r) =>
                              r.type === "King" &&
                              (r.status === "available" || r.status === "clean")
                          );
                          if (kings.length > 0) {
                            handleRoomSelect(kings[0].number);
                          }
                        }}
                        className="w-full p-3 text-left bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">Upgrade to King</p>
                            <p className="text-sm text-slate-400">
                              {state.rooms.filter(
                                (r) =>
                                  r.type === "King" &&
                                  (r.status === "available" || r.status === "clean")
                              ).length}{" "}
                              rooms available
                            </p>
                          </div>
                          <span className="text-emerald-400">+$30/night</span>
                        </div>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        const suites = state.rooms.filter(
                          (r) =>
                            r.type === "Suite" &&
                            (r.status === "available" || r.status === "clean")
                        );
                        if (suites.length > 0) {
                          handleRoomSelect(suites[0].number);
                        }
                      }}
                      className="w-full p-3 text-left bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Upgrade to Suite</p>
                          <p className="text-sm text-slate-400">
                            {state.rooms.filter(
                              (r) =>
                                r.type === "Suite" &&
                                (r.status === "available" || r.status === "clean")
                            ).length}{" "}
                            rooms available
                          </p>
                        </div>
                        <span className="text-emerald-400">
                          +${reservation.roomType === "Queen" ? "190" : "160"}/night
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
        <div className="p-4 border-t border-slate-700 bg-slate-800 flex items-center justify-between">
          <div className="text-sm text-slate-400">
            {state.stagedBillingChanges.length > 0 && (
              <span className="text-amber-400">
                {state.stagedBillingChanges.length} billing change(s) pending
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={cancelCheckIn}
              className="px-4 py-2 border border-slate-600 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={completeCheckIn}
              disabled={!displayRoom}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Complete Check-in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
