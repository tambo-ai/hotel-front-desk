"use client";

import { useHotel } from "@/lib/hotel-store";
import type { ViewType } from "@/lib/hotel-types";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Users,
  Sparkles,
  BarChart3,
  DollarSign,
  Settings,
  Command,
} from "lucide-react";

interface NavigationTabsProps {
  onSearchClick?: () => void;
  isChatOpen?: boolean;
}

interface NavTab {
  id: ViewType;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
}

const tabs: NavTab[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
    shortcut: "D",
  },
  {
    id: "reservations",
    label: "Reservations",
    icon: <CalendarCheck className="w-4 h-4" />,
    shortcut: "R",
  },
  {
    id: "rooms",
    label: "Rooms",
    icon: <BedDouble className="w-4 h-4" />,
    shortcut: "O",
  },
  {
    id: "guests",
    label: "Guests",
    icon: <Users className="w-4 h-4" />,
    shortcut: "G",
  },
  {
    id: "housekeeping",
    label: "Housekeeping",
    icon: <Sparkles className="w-4 h-4" />,
    shortcut: "H",
  },
  {
    id: "reports",
    label: "Reports",
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    id: "rates",
    label: "Rates",
    icon: <DollarSign className="w-4 h-4" />,
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="w-4 h-4" />,
  },
];

export function NavigationTabs({ onSearchClick, isChatOpen }: NavigationTabsProps) {
  const { state, navigateTo } = useHotel();

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-12 max-w-[1920px] items-center px-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5 border-r border-border pr-6 mr-6">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent">
            <BedDouble className="h-4 w-4 text-accent-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Grand Hotel
          </span>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => navigateTo(tab.id)}
              className={`group relative flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                state.currentView === tab.id
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-hover-bg hover:text-foreground"
              }`}
            >
              <span
                className={`transition-colors ${
                  state.currentView === tab.id
                    ? "text-accent"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {tab.shortcut && state.currentView !== tab.id && (
                <span className="ml-1 hidden text-[10px] text-muted-foreground/60 group-hover:inline">
                  {tab.shortcut}
                </span>
              )}
              {state.currentView === tab.id && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-accent" />
              )}
            </button>
          ))}
        </div>

        {/* Right section - chat toggle button */}
        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={onSearchClick}
            className={cn(
              "flex items-center gap-2 rounded-md border px-3 py-1.5 text-[13px] transition-colors",
              isChatOpen
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <Command className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{isChatOpen ? "Close" : "Search..."}</span>
            <kbd className="kbd">K</kbd>
          </button>
        </div>
      </div>
    </nav>
  );
}
