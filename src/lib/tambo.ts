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
import { ReservationDetail, ReservationDetailPropsSchema } from "@/components/hotel/ReservationDetail";
import { RoomGrid, RoomGridPropsSchema } from "@/components/hotel/RoomGrid";
import { BillingStatement, BillingStatementPropsSchema } from "@/components/hotel/BillingStatement";
import { GuestProfile, GuestProfilePropsSchema } from "@/components/hotel/GuestProfile";
import { ArrivalsTable, ArrivalsTablePropsSchema } from "@/components/hotel/ArrivalsTable";
import { DeparturesTable, DeparturesTablePropsSchema } from "@/components/hotel/DeparturesTable";
import { HousekeepingStatus, HousekeepingStatusPropsSchema } from "@/components/hotel/HousekeepingStatus";
import { OccupancyChart, OccupancyChartPropsSchema } from "@/components/hotel/OccupancyChart";
import { RevenueChart, RevenueChartPropsSchema } from "@/components/hotel/RevenueChart";
import { RoomTypeBreakdown, RoomTypeBreakdownPropsSchema } from "@/components/hotel/RoomTypeBreakdown";
import { RatePricingForm, RatePricingFormPropsSchema } from "@/components/hotel/RatePricingForm";
import { GuestMessageComposer, GuestMessageComposerPropsSchema } from "@/components/hotel/GuestMessageComposer";

// Hotel Tools
import {
  searchReservations,
  getReservationDetails,
  getAvailableRooms,
  stageRoomAssignment,
  stageBillingAdjustment,
  stageRoomStatusChange,
  stageRateChange,
  getOccupancyData,
  getCompetitorRates,
  getHistoricalOccupancy,
  getRoomTypeAvailability,
  getForwardBookings,
  calculateRevenueProjection,
  draftGuestMessage,
  draftRevenueReport,
  navigateToView,
  highlightElement,
} from "@/services/hotel-tools";

// Hotel Type Schemas
import {
  SearchReservationsArgsSchema,
  GetAvailableRoomsArgsSchema,
  StageRoomAssignmentArgsSchema,
  StageBillingAdjustmentArgsSchema,
  StageRoomStatusChangeArgsSchema,
  StageRateChangeArgsSchema,
  GetOccupancyDataArgsSchema,
  GetCompetitorRatesArgsSchema,
  GetHistoricalOccupancyArgsSchema,
  GetRoomTypeAvailabilityArgsSchema,
  GetForwardBookingsArgsSchema,
  CalculateRevenueProjectionArgsSchema,
  DraftGuestMessageArgsSchema,
  DraftRevenueReportArgsSchema,
  NavigateToViewArgsSchema,
  HighlightElementArgsSchema,
  ReservationSchema,
  RoomSchema,
  OccupancyDataSchema,
} from "@/lib/hotel-types";

/**
 * tools
 *
 * This array contains all the Tambo tools that are registered for use within the application.
 * Each tool is defined with its name, description, and expected props. The tools
 * can be controlled by AI to dynamically fetch data based on user interactions.
 */
export const tools: TamboTool[] = [
  // ============================================================================
  // Search & Navigation Tools
  // ============================================================================
  {
    name: "searchReservations",
    description: "Search for reservations by guest name, confirmation number, room number, or date. Use this to find a guest's reservation for check-in, check-out, or inquiry. Results are highlighted in the UI.",
    tool: searchReservations,
    toolSchema: z.function()
      .args(SearchReservationsArgsSchema)
      .returns(z.array(ReservationSchema)),
  },
  {
    name: "getReservationDetails",
    description: "Get full details of a specific reservation including guest profile and billing information. Navigates to the reservation in the UI.",
    tool: getReservationDetails,
    toolSchema: z.function()
      .args(z.object({ reservationId: z.string() }))
      .returns(z.object({
        reservation: ReservationSchema,
        guest: z.any(),
        billing: z.array(z.any()),
        total: z.number(),
      })),
  },
  {
    name: "getAvailableRooms",
    description: "Get a list of available rooms, optionally filtered by type (King, Queen, Suite) and features (city_view, balcony, etc.). Use this during check-in to find rooms for guests or when they request an upgrade.",
    tool: getAvailableRooms,
    toolSchema: z.function()
      .args(GetAvailableRoomsArgsSchema)
      .returns(z.array(RoomSchema)),
  },
  {
    name: "navigateToView",
    description: "Navigate the main UI to a specific view (dashboard, reservations, rooms, guests, housekeeping, reports, rates). Use this to switch between different sections of the app.",
    tool: navigateToView,
    toolSchema: z.function()
      .args(z.object({
        view: z.enum(["dashboard", "reservations", "rooms", "guests", "housekeeping", "reports", "rates"])
          .describe("View to navigate to"),
      }))
      .returns(z.object({ success: z.boolean() })),
  },
  {
    name: "highlightElement",
    description: "Highlight a specific element in the UI (room, reservation, or guest). Use this to draw attention to a specific item.",
    tool: highlightElement,
    toolSchema: z.function()
      .args(HighlightElementArgsSchema)
      .returns(z.object({ success: z.boolean() })),
  },

  // ============================================================================
  // Staging Tools (Human-in-the-Loop)
  // ============================================================================
  {
    name: "stageRoomAssignment",
    description: "Stage a room assignment for a reservation. This does NOT commit the change - it prepares it for the agent to review and confirm by clicking a button. Use during check-in or room changes.",
    tool: stageRoomAssignment,
    toolSchema: z.function()
      .args(StageRoomAssignmentArgsSchema)
      .returns(z.object({
        success: z.boolean(),
        stagedChange: z.object({
          previousRoom: z.number().optional(),
          newRoom: z.number(),
          roomDetails: RoomSchema,
        }).optional(),
        message: z.string().optional(),
        error: z.string().optional(),
      })),
  },
  {
    name: "stageBillingAdjustment",
    description: "Stage a billing adjustment (add charge, remove charge, or apply discount). Changes are NOT committed until the agent clicks 'Save'. Use this to comp items, add charges, or apply discounts during check-in/out.",
    tool: stageBillingAdjustment,
    toolSchema: z.function()
      .args(StageBillingAdjustmentArgsSchema)
      .returns(z.object({
        success: z.boolean(),
        message: z.string().optional(),
        error: z.string().optional(),
      })),
  },
  {
    name: "stageRoomStatusChange",
    description: "Stage a room status change (available, occupied, dirty, clean, out_of_order). Changes are NOT committed until the agent clicks 'Save'. Use this to mark rooms as out of order, update cleaning status, etc.",
    tool: stageRoomStatusChange,
    toolSchema: z.function()
      .args(StageRoomStatusChangeArgsSchema)
      .returns(z.object({
        success: z.boolean(),
        stagedChange: RoomSchema.optional(),
        message: z.string().optional(),
        error: z.string().optional(),
      })),
  },
  {
    name: "stageRateChange",
    description: "Stage a rate change for a room type on a specific date. Changes are NOT committed until the agent clicks 'Apply Rate Change'. Use this to adjust pricing strategy.",
    tool: stageRateChange,
    toolSchema: z.function()
      .args(StageRateChangeArgsSchema)
      .returns(z.object({
        success: z.boolean(),
        stagedRate: z.object({
          roomType: z.string(),
          date: z.string(),
          rate: z.number(),
          previousRate: z.number(),
        }).optional(),
        affectedRooms: z.number().optional(),
        message: z.string().optional(),
        error: z.string().optional(),
      })),
  },

  // ============================================================================
  // Analytics Tools
  // ============================================================================
  {
    name: "getOccupancyData",
    description: "Get occupancy statistics for a date range (today, this_week, this_month, or custom). Returns daily occupancy rates and revenue. Use for reporting and analysis.",
    tool: getOccupancyData,
    toolSchema: z.function()
      .args(GetOccupancyDataArgsSchema)
      .returns(z.array(OccupancyDataSchema)),
  },
  {
    name: "getCompetitorRates",
    description: "Get competitor hotel rates for a specific date. Use for rate comparison and pricing decisions.",
    tool: getCompetitorRates,
    toolSchema: z.function()
      .args(GetCompetitorRatesArgsSchema)
      .returns(z.array(z.object({
        competitor: z.string(),
        rate: z.number(),
        roomType: z.string(),
      }))),
  },
  {
    name: "getHistoricalOccupancy",
    description: "Get historical occupancy data for year-over-year comparison. Use 'last_year_same_weekend' for easy comparison to the same period last year.",
    tool: getHistoricalOccupancy,
    toolSchema: z.function()
      .args(GetHistoricalOccupancyArgsSchema)
      .returns(z.array(OccupancyDataSchema)),
  },
  {
    name: "getRoomTypeAvailability",
    description: "Get availability breakdown by room type (King, Queen, Suite) for a specific date. Shows how many of each type are available vs total.",
    tool: getRoomTypeAvailability,
    toolSchema: z.function()
      .args(GetRoomTypeAvailabilityArgsSchema)
      .returns(z.array(z.object({
        roomType: z.string(),
        available: z.number(),
        total: z.number(),
      }))),
  },
  {
    name: "getForwardBookings",
    description: "Check forward bookings for a room type on a given date. Use to understand future demand when making rate decisions.",
    tool: getForwardBookings,
    toolSchema: z.function()
      .args(GetForwardBookingsArgsSchema)
      .returns(z.object({
        roomType: z.string(),
        date: z.string(),
        bookedCount: z.number(),
        bookings: z.array(z.object({
          id: z.string(),
          confirmationNumber: z.string(),
          checkInDate: z.string(),
          checkOutDate: z.string(),
        })),
      })),
  },
  {
    name: "calculateRevenueProjection",
    description: "Calculate the projected revenue impact of a rate change. Shows estimated bookings and revenue difference. Use before applying rate changes.",
    tool: calculateRevenueProjection,
    toolSchema: z.function()
      .args(CalculateRevenueProjectionArgsSchema)
      .returns(z.object({
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
      })),
  },

  // ============================================================================
  // Communication Tools
  // ============================================================================
  {
    name: "draftGuestMessage",
    description: "Draft a personalized message to a guest using templates (welcome, apology, confirmation, thank_you, custom). The message appears in a composer for the agent to review and send. Include context and offers for apology messages.",
    tool: draftGuestMessage,
    toolSchema: z.function()
      .args(DraftGuestMessageArgsSchema)
      .returns(z.object({
        subject: z.string(),
        body: z.string(),
        guestEmail: z.string(),
        message: z.string().optional(),
        error: z.string().optional(),
      })),
  },
  {
    name: "draftRevenueReport",
    description: "Draft a revenue report email with occupancy data and optional rate change details. The report appears in a composer for the agent to review and send.",
    tool: draftRevenueReport,
    toolSchema: z.function()
      .args(DraftRevenueReportArgsSchema)
      .returns(z.object({
        subject: z.string(),
        body: z.string(),
        chartData: z.any(),
        message: z.string().optional(),
      })),
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
    description: "Displays a reservation summary with guest info, dates, room assignment, and status. Use to show reservation details during check-in, check-out, or inquiries.",
    component: ReservationDetail,
    propsSchema: ReservationDetailPropsSchema,
  },
  {
    name: "GuestProfile",
    description: "Shows guest information including contact details, loyalty tier, preferences, and stay history. Use to display guest info during check-in or service inquiries.",
    component: GuestProfile,
    propsSchema: GuestProfilePropsSchema,
  },
  {
    name: "BillingStatement",
    description: "Displays guest charges with line items, totals, and any staged changes. Use during check-out or billing inquiries.",
    component: BillingStatement,
    propsSchema: BillingStatementPropsSchema,
  },

  // ============================================================================
  // Room & Housekeeping Components
  // ============================================================================
  {
    name: "RoomGrid",
    description: "Visual grid showing room inventory with status colors (available=green, occupied=blue, dirty=amber, out_of_order=red). Can filter by type and features. Use for room selection or status overview.",
    component: RoomGrid,
    propsSchema: RoomGridPropsSchema,
  },
  {
    name: "HousekeepingStatus",
    description: "List of housekeeping tasks showing room cleaning status (dirty, in_progress, ready) and priority. Can filter by status or priority.",
    component: HousekeepingStatus,
    propsSchema: HousekeepingStatusPropsSchema,
  },

  // ============================================================================
  // Arrivals & Departures Components
  // ============================================================================
  {
    name: "ArrivalsTable",
    description: "Table of today's expected arrivals with guest info, room assignment, and ETA. Can filter for VIP only. Use for morning preparation or check-in workflow.",
    component: ArrivalsTable,
    propsSchema: ArrivalsTablePropsSchema,
  },
  {
    name: "DeparturesTable",
    description: "Table of today's expected departures with guest info, room, and balance. Can filter for early checkouts. Use for departure management.",
    component: DeparturesTable,
    propsSchema: DeparturesTablePropsSchema,
  },

  // ============================================================================
  // Analytics & Charts Components
  // ============================================================================
  {
    name: "OccupancyChart",
    description: "Line or bar chart showing occupancy trends over time. Can overlay competitor rates or historical data for comparison. Use for revenue analysis.",
    component: OccupancyChart,
    propsSchema: OccupancyChartPropsSchema,
  },
  {
    name: "RevenueChart",
    description: "Chart showing current vs projected revenue, typically after a rate change. Use to visualize the impact of pricing decisions.",
    component: RevenueChart,
    propsSchema: RevenueChartPropsSchema,
  },
  {
    name: "RoomTypeBreakdown",
    description: "Pie chart showing room availability by type (King, Queen, Suite). Use for inventory analysis.",
    component: RoomTypeBreakdown,
    propsSchema: RoomTypeBreakdownPropsSchema,
  },
  {
    name: "RatePricingForm",
    description: "Rate calendar showing room rates by type and date with competitor comparison. Use for rate management and adjustments.",
    component: RatePricingForm,
    propsSchema: RatePricingFormPropsSchema,
  },

  // ============================================================================
  // Communication Components
  // ============================================================================
  {
    name: "GuestMessageComposer",
    description: "Email composer for guest communications with subject, body, and send button. Use after drafting a message with draftGuestMessage tool.",
    component: GuestMessageComposer,
    propsSchema: GuestMessageComposerPropsSchema,
  },
];
