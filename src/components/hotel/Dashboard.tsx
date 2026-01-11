"use client";

import { useEffect } from "react";
import { useHotel, setHotelContextRef } from "@/lib/hotel-store";
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
import { GuestMessageComposer } from "./GuestMessageComposer";
import { SettingsPage } from "./SettingsPage";
import { guests, reservations, DEMO_TODAY } from "@/data/mock-data";
import {
  BedDouble,
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export function Dashboard() {
  const hotelContext = useHotel();
  const { state, selectReservation } = hotelContext;

  // Make context available to tools
  useEffect(() => {
    setHotelContextRef(hotelContext);
    return () => setHotelContextRef(null);
  }, [hotelContext]);

  // Get selected reservation for guestId lookup
  const selectedReservation = state.selectedReservationId
    ? reservations.find((r) => r.id === state.selectedReservationId)
    : null;

  // Quick stats
  const availableRooms = state.rooms.filter(
    (r) => r.status === "available" || r.status === "clean",
  ).length;
  const occupiedRooms = state.rooms.filter(
    (r) => r.status === "occupied",
  ).length;
  const todaysArrivals = reservations.filter(
    (r) =>
      r.checkInDate === DEMO_TODAY &&
      r.status === "confirmed",
  ).length;
  const todaysDepartures = reservations.filter(
    (r) =>
      r.checkOutDate === DEMO_TODAY &&
      r.status === "checked_in",
  ).length;

  return (
    <div className="min-h-full bg-background">
      {/* Main Content */}
      <main className="mx-auto max-w-[1920px] p-6">
        {state.currentView === "dashboard" && (
          <div className="space-y-6 animate-in">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={<BedDouble className="h-4 w-4" />}
                label="Available Rooms"
                value={availableRooms}
                subtext={`of ${state.rooms.length} total`}
                trend={{ value: 2, positive: true }}
                color="success"
              />
              <StatCard
                icon={<Users className="h-4 w-4" />}
                label="Occupied Rooms"
                value={occupiedRooms}
                subtext={`${Math.round((occupiedRooms / state.rooms.length) * 100)}% occupancy`}
                trend={{ value: 5, positive: true }}
                color="info"
              />
              <StatCard
                icon={<Calendar className="h-4 w-4" />}
                label="Today's Arrivals"
                value={todaysArrivals}
                subtext="expected check-ins"
                color="warning"
              />
              <StatCard
                icon={<TrendingUp className="h-4 w-4" />}
                label="Today's Departures"
                value={todaysDepartures}
                subtext="expected check-outs"
                color="accent"
              />
            </div>

            {/* Main Grid - responsive for chat panel */}
            <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1fr_320px]">
              <div className="min-w-0">
                <ArrivalsTable />
              </div>
              <div className="min-w-[280px]">
                <RoomTypeBreakdown />
              </div>
            </div>

            {/* Secondary Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <OccupancyChart dateRange="week" />
              <HousekeepingStatus />
            </div>
          </div>
        )}

        {state.currentView === "reservations" && (
          <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1fr_360px] animate-in">
            <div className="space-y-6 min-w-0">
              <ArrivalsTable />
              <DeparturesTable />
            </div>
            <div className="space-y-4 min-w-[320px]">
              {state.selectedReservationId ? (
                <>
                  <ReservationDetail
                    reservationId={state.selectedReservationId}
                    showActions
                  />
                  {selectedReservation?.guestId && (
                    <GuestProfile guestId={selectedReservation.guestId} />
                  )}
                  <BillingStatement reservationId={state.selectedReservationId} />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
                  <div className="mb-3 rounded-full bg-muted p-3">
                    <AlertCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Select a reservation to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {state.currentView === "rooms" && (
          <div className="space-y-6 animate-in">
            {/* On mobile/tablet: stats first, then grid. On large desktop: side by side */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:hidden">
              <RoomTypeBreakdown compact />
              <HousekeepingStatus filterStatus="dirty" compact />
            </div>
            <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1fr_280px]">
              <div className="min-w-0">
                <RoomGrid />
              </div>
              <div className="hidden space-y-4 2xl:block min-w-[260px]">
                <RoomTypeBreakdown />
                <HousekeepingStatus filterStatus="dirty" compact />
              </div>
            </div>
          </div>
        )}

        {state.currentView === "guests" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-in">
            {guests.slice(0, 12).map((guest) => (
              <GuestProfile key={guest.id} guestId={guest.id} showHistory />
            ))}
          </div>
        )}

        {state.currentView === "housekeeping" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 animate-in">
            <HousekeepingStatus />
            <div className="space-y-4">
              <HousekeepingStatus filterStatus="dirty" />
              <HousekeepingStatus filterStatus="in_progress" />
            </div>
          </div>
        )}

        {state.currentView === "reports" && (
          <div className="space-y-6 animate-in">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <OccupancyChart
                dateRange="week"
                showHistorical
                chartType="composed"
              />
              <RoomTypeBreakdown />
            </div>
            <OccupancyChart dateRange="month" chartType="bar" />
          </div>
        )}

        {state.currentView === "rates" && (
          <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1fr_280px] animate-in">
            <div className="min-w-0">
              <RatePricingForm showCompetitors />
            </div>
            <div className="space-y-4 min-w-[260px]">
              <OccupancyChart dateRange="week" compact />
              <RoomTypeBreakdown compact />
            </div>
          </div>
        )}

        {state.currentView === "settings" && (
          <div className="max-w-lg animate-in">
            <SettingsPage />
          </div>
        )}
      </main>

      {/* Draft Message Modal */}
      {state.draftMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-backdrop p-4">
          <div className="w-full max-w-2xl fade-in">
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
  trend,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  subtext: string;
  trend?: { value: number; positive: boolean };
  color: "success" | "info" | "warning" | "accent";
}) {
  const colorClasses = {
    success: "text-success",
    info: "text-info",
    warning: "text-warning",
    accent: "text-accent",
  };

  const bgClasses = {
    success: "bg-success/10",
    info: "bg-info/10",
    warning: "bg-warning/10",
    accent: "bg-accent/10",
  };

  return (
    <div className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-muted-foreground/20 hover:shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className={`rounded-md p-2 ${bgClasses[color]}`}>
          <span className={colorClasses[color]}>{icon}</span>
        </div>
        {trend && (
          <div
            className={`flex items-center gap-0.5 text-xs font-medium ${
              trend.positive ? "text-success" : "text-destructive"
            }`}
          >
            {trend.positive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {trend.value}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground/70">{subtext}</p>
      </div>
    </div>
  );
}
