"use client";

import { useHotel } from "@/lib/hotel-store";
import type { ViewType } from "@/lib/hotel-types";
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Users,
  Sparkles,
  BarChart3,
  DollarSign,
} from "lucide-react";

interface NavTab {
  id: ViewType;
  label: string;
  icon: React.ReactNode;
}

const tabs: NavTab[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "reservations", label: "Reservations", icon: <CalendarCheck className="w-4 h-4" /> },
  { id: "rooms", label: "Rooms", icon: <BedDouble className="w-4 h-4" /> },
  { id: "guests", label: "Guests", icon: <Users className="w-4 h-4" /> },
  { id: "housekeeping", label: "Housekeeping", icon: <Sparkles className="w-4 h-4" /> },
  { id: "reports", label: "Reports", icon: <BarChart3 className="w-4 h-4" /> },
  { id: "rates", label: "Rates", icon: <DollarSign className="w-4 h-4" /> },
];

export function NavigationTabs() {
  const { state, navigateTo } = useHotel();

  return (
    <nav className="bg-slate-800 border-b border-slate-700">
      <div className="flex items-center px-4">
        <div className="flex items-center gap-2 py-3 pr-6 border-r border-slate-700">
          <BedDouble className="w-6 h-6 text-amber-400" />
          <span className="font-semibold text-white">Grand Hotel</span>
        </div>
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => navigateTo(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                state.currentView === tab.id
                  ? "text-amber-400 border-b-2 border-amber-400 bg-slate-700/50"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/30"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
