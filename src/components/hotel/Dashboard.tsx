"use client";

import { useEffect } from "react";
import { useHotel, setHotelContextRef } from "@/lib/hotel-store";
import { NavigationTabs } from "./NavigationTabs";
import { RoomGrid } from "./RoomGrid";
import { ArrivalsTable } from "./ArrivalsTable";
import { DeparturesTable } from "./DeparturesTable";
import { HousekeepingStatus } from "./HousekeepingStatus";
import { OccupancyChart } from "./OccupancyChart";
import { RevenueChart } from "./RevenueChart";
import { RoomTypeBreakdown } from "./RoomTypeBreakdown";
import { RatePricingForm } from "./RatePricingForm";
import { ReservationDetail } from "./ReservationDetail";
import { BillingStatement } from "./BillingStatement";
import { GuestProfile } from "./GuestProfile";
import { CheckInForm } from "./CheckInForm";
import { GuestMessageComposer } from "./GuestMessageComposer";
import { guests, reservations } from "@/data/mock-data";
import {
  BedDouble,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export function Dashboard() {
  const hotelContext = useHotel();
  const { state, selectReservation } = hotelContext;

  // Make context available to tools
  useEffect(() => {
    setHotelContextRef(hotelContext);
    return () => setHotelContextRef(null);
  }, [hotelContext]);

  // Get selected reservation for detail panel
  const selectedReservation = state.selectedReservationId
    ? reservations.find((r) => r.id === state.selectedReservationId)
    : null;

  const selectedGuest = selectedReservation
    ? guests.find((g) => g.id === selectedReservation.guestId)
    : null;

  // Quick stats
  const availableRooms = state.rooms.filter(
    (r) => r.status === "available" || r.status === "clean"
  ).length;
  const occupiedRooms = state.rooms.filter((r) => r.status === "occupied").length;
  const todaysArrivals = reservations.filter(
    (r) => r.checkInDate === new Date().toISOString().split("T")[0] && r.status === "confirmed"
  ).length;
  const todaysDepartures = reservations.filter(
    (r) => r.checkOutDate === new Date().toISOString().split("T")[0] && r.status === "checked_in"
  ).length;

  return (
    <div className="min-h-screen bg-slate-900">
      <NavigationTabs />

      {/* Main Content */}
      <div className="p-6">
        {state.currentView === "dashboard" && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<BedDouble className="w-5 h-5" />}
                label="Available Rooms"
                value={availableRooms}
                subtext={`of ${state.rooms.length} total`}
                color="emerald"
              />
              <StatCard
                icon={<Users className="w-5 h-5" />}
                label="Occupied Rooms"
                value={occupiedRooms}
                subtext={`${Math.round((occupiedRooms / state.rooms.length) * 100)}% occupancy`}
                color="blue"
              />
              <StatCard
                icon={<Calendar className="w-5 h-5" />}
                label="Today's Arrivals"
                value={todaysArrivals}
                subtext="expected check-ins"
                color="amber"
              />
              <StatCard
                icon={<TrendingUp className="w-5 h-5" />}
                label="Today's Departures"
                value={todaysDepartures}
                subtext="expected check-outs"
                color="purple"
              />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Arrivals */}
              <div className="lg:col-span-2">
                <ArrivalsTable />
              </div>

              {/* Room Type Breakdown */}
              <div>
                <RoomTypeBreakdown />
              </div>
            </div>

            {/* Secondary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <OccupancyChart dateRange="week" />
              <HousekeepingStatus />
            </div>
          </div>
        )}

        {state.currentView === "reservations" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ArrivalsTable />
              <DeparturesTable />
            </div>
            <div className="space-y-6">
              {selectedReservation ? (
                <>
                  <ReservationDetail reservation={selectedReservation} showActions />
                  {selectedGuest && <GuestProfile guest={selectedGuest} />}
                  <BillingStatement reservationId={selectedReservation.id} />
                </>
              ) : (
                <div className="bg-slate-800 rounded-lg p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">Select a reservation to view details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {state.currentView === "rooms" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <RoomGrid />
            </div>
            <div className="space-y-6">
              <RoomTypeBreakdown />
              <HousekeepingStatus filterStatus="dirty" compact />
            </div>
          </div>
        )}

        {state.currentView === "guests" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guests.slice(0, 12).map((guest) => (
              <GuestProfile key={guest.id} guest={guest} showHistory />
            ))}
          </div>
        )}

        {state.currentView === "housekeeping" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HousekeepingStatus />
            <div className="space-y-6">
              <HousekeepingStatus filterStatus="dirty" />
              <HousekeepingStatus filterStatus="in_progress" />
            </div>
          </div>
        )}

        {state.currentView === "reports" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <OccupancyChart dateRange="week" showHistorical chartType="composed" />
              <RoomTypeBreakdown />
            </div>
            <OccupancyChart dateRange="month" chartType="bar" />
          </div>
        )}

        {state.currentView === "rates" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RatePricingForm showCompetitors />
            </div>
            <div className="space-y-6">
              <OccupancyChart dateRange="week" compact />
              <RoomTypeBreakdown compact />
            </div>
          </div>
        )}
      </div>

      {/* Check-in Form Modal */}
      {state.checkInReservationId && <CheckInForm />}

      {/* Draft Message Modal */}
      {state.draftMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full">
            <GuestMessageComposer
              to={state.draftMessage.to}
              subject={state.draftMessage.subject}
              body={state.draftMessage.body}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  subtext: string;
  color: "emerald" | "blue" | "amber" | "purple";
}) {
  const colors = {
    emerald: "bg-emerald-500/20 text-emerald-400",
    blue: "bg-blue-500/20 text-blue-400",
    amber: "bg-amber-500/20 text-amber-400",
    purple: "bg-purple-500/20 text-purple-400",
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{value}</span>
            <span className="text-xs text-slate-500">{subtext}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
