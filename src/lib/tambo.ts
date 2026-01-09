/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import type { TamboComponent, TamboTool } from "@tambo-ai/react";
import { z } from "zod";

// Hotel Components
import {
  ReservationDetail,
  ReservationDetailPropsSchema,
} from "@/components/hotel/ReservationDetail";
import { RoomGrid, RoomGridPropsSchema } from "@/components/hotel/RoomGrid";
import {
  BillingStatement,
  BillingStatementPropsSchema,
} from "@/components/hotel/BillingStatement";
import {
  GuestProfile,
  GuestProfilePropsSchema,
} from "@/components/hotel/GuestProfile";
import {
  ArrivalsTable,
  ArrivalsTablePropsSchema,
} from "@/components/hotel/ArrivalsTable";
import {
  DeparturesTable,
  DeparturesTablePropsSchema,
} from "@/components/hotel/DeparturesTable";
import {
  HousekeepingStatus,
  HousekeepingStatusPropsSchema,
} from "@/components/hotel/HousekeepingStatus";
import {
  OccupancyChart,
  OccupancyChartPropsSchema,
} from "@/components/hotel/OccupancyChart";
import {
  RevenueChart,
  RevenueChartPropsSchema,
} from "@/components/hotel/RevenueChart";
import {
  RoomTypeBreakdown,
  RoomTypeBreakdownPropsSchema,
} from "@/components/hotel/RoomTypeBreakdown";
import {
  RatePricingForm,
  RatePricingFormPropsSchema,
} from "@/components/hotel/RatePricingForm";
import {
  GuestMessageComposer,
  GuestMessageComposerPropsSchema,
} from "@/components/hotel/GuestMessageComposer";
import {
  KeyCardDialog,
  KeyCardDialogPropsSchema,
} from "@/components/hotel/KeyCardDialog";
import {
  BillingItemDetail,
  BillingItemDetailPropsSchema,
} from "@/components/hotel/BillingItemDetail";
import {
  SettingsPage,
  SettingsPagePropsSchema,
} from "@/components/hotel/SettingsPage";
import {
  RoomIssueForm,
  RoomIssueFormPropsSchema,
} from "@/components/hotel/RoomIssueForm";
import {
  CheckInForm,
  CheckInFormPropsSchema,
} from "@/components/hotel/CheckInForm";

// Hotel Tools (data retrieval only)
import {
  searchReservations,
  getReservationDetails,
  getAvailableRooms,
  getOccupancyData,
  getCompetitorRates,
  getHistoricalOccupancy,
  getRoomTypeAvailability,
  getForwardBookings,
  calculateRevenueProjection,
  navigateToView,
  highlightElement,
  getGuestByRoom,
  getEarlyCheckouts,
} from "@/services/hotel-tools";

// Hotel Type Schemas (data retrieval only)
import {
  SearchReservationsArgsSchema,
  GetAvailableRoomsArgsSchema,
  GetOccupancyDataArgsSchema,
  GetCompetitorRatesArgsSchema,
  GetHistoricalOccupancyArgsSchema,
  GetRoomTypeAvailabilityArgsSchema,
  GetForwardBookingsArgsSchema,
  CalculateRevenueProjectionArgsSchema,
  NavigateToViewArgsSchema,
  HighlightElementArgsSchema,
  OccupancyDataSchema,
  ReservationSummarySchema,
  RoomSummarySchema,
} from "@/lib/hotel-types";

/**
 * tools
 *
 * This array contains all the Tambo tools that are registered for use within the application.
 * Tools are for DATA RETRIEVAL only - all actions/editing should be done via components.
 */
export const tools: TamboTool[] = [
  // ============================================================================
  // Search & Navigation Tools
  // ============================================================================
  {
    name: "searchReservations",
    description:
      "Search for reservations by guest name, confirmation number, room number, or date. Returns minimal context (IDs, names, status). Use the returned reservationId with ReservationDetail or CheckInForm components. Results are highlighted in the UI.",
    tool: searchReservations,
    toolSchema: z
      .function()
      .args(SearchReservationsArgsSchema)
      .returns(z.array(ReservationSummarySchema)),
  },
  {
    name: "getReservationDetails",
    description:
      "Get reservation details by ID. Returns minimal context for AI decisions. Use the returned reservationId with ReservationDetail component, guestId with GuestProfile component. Navigates to the reservation in the UI.",
    tool: getReservationDetails,
    toolSchema: z
      .function()
      .args(z.object({ reservationId: z.string() }))
      .returns(
        z.object({
          reservationId: z.string(),
          guestId: z.string(),
          guestName: z.string(),
          confirmationNumber: z.string(),
          status: z.string(),
          roomType: z.string(),
          roomNumber: z.number().optional(),
          checkInDate: z.string(),
          checkOutDate: z.string(),
          billingTotal: z.number(),
          billingItemCount: z.number(),
        }),
      ),
  },
  {
    name: "getAvailableRooms",
    description:
      "Get available rooms, optionally filtered by type and features. Returns minimal context (room numbers, types, features). Use during check-in to show available options.",
    tool: getAvailableRooms,
    toolSchema: z
      .function()
      .args(GetAvailableRoomsArgsSchema)
      .returns(z.array(RoomSummarySchema)),
  },
  {
    name: "navigateToView",
    description:
      "Navigate the main UI to a specific view (dashboard, reservations, rooms, guests, housekeeping, reports, rates, settings). Use this to switch between different sections of the app.",
    tool: navigateToView,
    toolSchema: z
      .function()
      .args(NavigateToViewArgsSchema)
      .returns(z.object({ success: z.boolean() })),
  },
  {
    name: "highlightElement",
    description:
      "Highlight a specific element in the UI (room, reservation, or guest). Use this to draw attention to a specific item.",
    tool: highlightElement,
    toolSchema: z
      .function()
      .args(HighlightElementArgsSchema)
      .returns(z.object({ success: z.boolean() })),
  },

  // ============================================================================
  // Analytics Tools
  // ============================================================================
  {
    name: "getOccupancyData",
    description:
      "Get occupancy statistics for a date range (today, this_week, this_month, or custom). Returns daily occupancy rates and revenue. Use for reporting and analysis.",
    tool: getOccupancyData,
    toolSchema: z
      .function()
      .args(GetOccupancyDataArgsSchema)
      .returns(z.array(OccupancyDataSchema)),
  },
  {
    name: "getCompetitorRates",
    description:
      "Get competitor hotel rates for a specific date. Use for rate comparison and pricing decisions.",
    tool: getCompetitorRates,
    toolSchema: z
      .function()
      .args(GetCompetitorRatesArgsSchema)
      .returns(
        z.array(
          z.object({
            competitor: z.string(),
            rate: z.number(),
            roomType: z.string(),
          }),
        ),
      ),
  },
  {
    name: "getHistoricalOccupancy",
    description:
      "Get historical occupancy data for year-over-year comparison. Use 'last_year_same_weekend' for easy comparison to the same period last year.",
    tool: getHistoricalOccupancy,
    toolSchema: z
      .function()
      .args(GetHistoricalOccupancyArgsSchema)
      .returns(z.array(OccupancyDataSchema)),
  },
  {
    name: "getRoomTypeAvailability",
    description:
      "Get availability breakdown by room type (King, Queen, Suite) for a specific date. Shows how many of each type are available vs total.",
    tool: getRoomTypeAvailability,
    toolSchema: z
      .function()
      .args(GetRoomTypeAvailabilityArgsSchema)
      .returns(
        z.array(
          z.object({
            roomType: z.string(),
            available: z.number(),
            total: z.number(),
          }),
        ),
      ),
  },
  {
    name: "getForwardBookings",
    description:
      "Check forward bookings for a room type on a given date. Use to understand future demand when making rate decisions.",
    tool: getForwardBookings,
    toolSchema: z
      .function()
      .args(GetForwardBookingsArgsSchema)
      .returns(
        z.object({
          roomType: z.string(),
          date: z.string(),
          bookedCount: z.number(),
          bookings: z.array(
            z.object({
              id: z.string(),
              confirmationNumber: z.string(),
              checkInDate: z.string(),
              checkOutDate: z.string(),
            }),
          ),
        }),
      ),
  },
  {
    name: "calculateRevenueProjection",
    description:
      "Calculate the projected revenue impact of a rate change. Shows estimated bookings and revenue difference. Use before applying rate changes.",
    tool: calculateRevenueProjection,
    toolSchema: z
      .function()
      .args(CalculateRevenueProjectionArgsSchema)
      .returns(
        z.object({
          projectedBookings: z.number(),
          currentRevenue: z.number(),
          projectedRevenue: z.number(),
          difference: z.number(),
          details: z.object({
            availableRooms: z.number(),
            currentOccupancy: z.string(),
            projectedOccupancy: z.string(),
            rateChange: z.string(),
          }),
        }),
      ),
  },

  // ============================================================================
  // Guest Services Tools
  // ============================================================================
  {
    name: "getEarlyCheckouts",
    description:
      "Get a list of reservations that are checking out early (before their scheduled checkout date). Use for departure management.",
    tool: getEarlyCheckouts,
    toolSchema: z
      .function()
      .args(z.object({}))
      .returns(
        z.array(
          z.object({
            reservationId: z.string(),
            confirmationNumber: z.string(),
            guestName: z.string(),
            roomNumber: z.number(),
            scheduledCheckout: z.string(),
            actualCheckout: z.string(),
          }),
        ),
      ),
  },
  {
    name: "getGuestByRoom",
    description:
      "Look up the current guest in a specific room. Returns minimal context (guestId, guestName, reservationId). Use guestId with GuestProfile component, reservationId with ReservationDetail component.",
    tool: getGuestByRoom,
    toolSchema: z
      .function()
      .args(
        z.object({ roomNumber: z.number().describe("Room number to look up") }),
      )
      .returns(
        z.object({
          guestId: z.string(),
          guestName: z.string(),
          email: z.string(),
          loyaltyTier: z.string(),
          roomNumber: z.number(),
          reservationId: z.string().optional(),
          confirmationNumber: z.string().optional(),
          message: z.string(),
        }),
      ),
  },
];

/**
 * components
 *
 * This array contains all the Tambo components that are registered for use within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render UI elements based on user interactions.
 */
export const components: TamboComponent[] = [
  // ============================================================================
  // Reservation & Guest Components
  // ============================================================================
  {
    name: "ReservationDetail",
    description:
      "Displays reservation details. Pass the reservationId from search results - component fetches data internally. Shows guest info, dates, room assignment, and status.",
    component: ReservationDetail,
    propsSchema: ReservationDetailPropsSchema,
  },
  {
    name: "GuestProfile",
    description:
      "Shows guest profile. Pass the guestId from tool results - component fetches data internally. Displays contact details, loyalty tier, preferences, and stay history.",
    component: GuestProfile,
    propsSchema: GuestProfilePropsSchema,
  },
  {
    name: "BillingStatement",
    description:
      "Displays guest charges with line items, totals, and any staged changes. Use during check-out or billing inquiries.",
    component: BillingStatement,
    propsSchema: BillingStatementPropsSchema,
  },

  // ============================================================================
  // Room & Housekeeping Components
  // ============================================================================
  {
    name: "RoomGrid",
    description:
      "Visual grid showing room inventory with status colors (available=green, occupied=blue, dirty=amber, out_of_order=red). Can filter by type and features. Use for room selection or status overview.",
    component: RoomGrid,
    propsSchema: RoomGridPropsSchema,
  },
  {
    name: "HousekeepingStatus",
    description:
      "List of housekeeping tasks showing room cleaning status (dirty, in_progress, ready) and priority. Can filter by status or priority.",
    component: HousekeepingStatus,
    propsSchema: HousekeepingStatusPropsSchema,
  },

  // ============================================================================
  // Arrivals & Departures Components
  // ============================================================================
  {
    name: "ArrivalsTable",
    description:
      "Shows today's expected arrivals. Fetches data internally. Can filter for VIP only. Use for morning preparation or check-in workflow.",
    component: ArrivalsTable,
    propsSchema: ArrivalsTablePropsSchema,
  },
  {
    name: "DeparturesTable",
    description:
      "Shows today's expected departures. Fetches data internally. Can filter for early checkouts. Use for departure management.",
    component: DeparturesTable,
    propsSchema: DeparturesTablePropsSchema,
  },

  // ============================================================================
  // Analytics & Charts Components
  // ============================================================================
  {
    name: "OccupancyChart",
    description:
      "Line or bar chart showing occupancy trends over time. Can overlay competitor rates or historical data for comparison. Use for revenue analysis.",
    component: OccupancyChart,
    propsSchema: OccupancyChartPropsSchema,
  },
  {
    name: "RevenueChart",
    description:
      "Chart showing current vs projected revenue, typically after a rate change. Use to visualize the impact of pricing decisions.",
    component: RevenueChart,
    propsSchema: RevenueChartPropsSchema,
  },
  {
    name: "RoomTypeBreakdown",
    description:
      "Pie chart showing room availability by type (King, Queen, Suite). Use for inventory analysis.",
    component: RoomTypeBreakdown,
    propsSchema: RoomTypeBreakdownPropsSchema,
  },
  {
    name: "RatePricingForm",
    description:
      "Rate calendar showing room rates by type and date with competitor comparison. Use for rate management and adjustments.",
    component: RatePricingForm,
    propsSchema: RatePricingFormPropsSchema,
  },

  // ============================================================================
  // Communication Components
  // ============================================================================
  {
    name: "GuestMessageComposer",
    description:
      "Use this component when user asks to send, draft, or compose an email to a guest. Pass guestId (from searchReservations or getGuestByRoom), subject, and body. Component fetches guest email internally. DO NOT write email as plain text - use this component so user can review, edit, and send. Syncs to, subject, body, messageStatus back to AI.",
    component: GuestMessageComposer,
    propsSchema: GuestMessageComposerPropsSchema,
  },

  // ============================================================================
  // Guest Services Components
  // ============================================================================
  {
    name: "KeyCardDialog",
    description:
      "Modal dialog for printing room key cards. Shows room number, guest name, expiration date, and key preview. Use after initiateKeyGeneration tool.",
    component: KeyCardDialog,
    propsSchema: KeyCardDialogPropsSchema,
  },
  {
    name: "BillingItemDetail",
    description:
      "Popup showing details for a single billing line item with options to apply discount or remove. Use to drill down on specific charges.",
    component: BillingItemDetail,
    propsSchema: BillingItemDetailPropsSchema,
  },

  // ============================================================================
  // Settings Components
  // ============================================================================
  {
    name: "SettingsPage",
    description:
      "Settings panel with theme toggle to switch between light mode, dark mode, and system preference. Use when the user wants to change appearance settings.",
    component: SettingsPage,
    propsSchema: SettingsPagePropsSchema,
  },

  // ============================================================================
  // Check-in/Check-out Components
  // ============================================================================
  {
    name: "CheckInForm",
    description:
      "Interactive check-in form. Pass the reservationId from search results - component fetches data internally. User can select room and complete check-in. Component syncs selectedRoom and checkInStatus back to AI context for follow-up actions.",
    component: CheckInForm,
    propsSchema: CheckInFormPropsSchema,
  },

  // ============================================================================
  // Room Issue Components
  // ============================================================================
  {
    name: "RoomIssueForm",
    description:
      "Dedicated form for reporting room issues with category selection (plumbing, electrical, HVAC, noise, cleanliness, pest, maintenance, other), priority level (low, medium, high, urgent), and description field. Use to display a form for guests or staff to report maintenance issues for a specific room.",
    component: RoomIssueForm,
    propsSchema: RoomIssueFormPropsSchema,
  },
];
