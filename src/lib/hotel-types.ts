import { z } from "zod";

// ============================================================================
// Room Types
// ============================================================================

export const RoomTypeEnum = z.enum(["King", "Queen", "Suite"]);
export type RoomType = z.infer<typeof RoomTypeEnum>;

export const RoomStatusEnum = z.enum([
  "available",
  "occupied",
  "dirty",
  "clean",
  "out_of_order",
]);
export type RoomStatus = z.infer<typeof RoomStatusEnum>;

export const RoomSchema = z.object({
  id: z.string(),
  number: z.number(),
  type: RoomTypeEnum,
  features: z.array(z.string()), // ["city_view", "balcony", "corner", "high_floor"]
  status: RoomStatusEnum,
  floor: z.number(),
  currentGuestId: z.string().optional(),
  rate: z.number(),
});
export type Room = z.infer<typeof RoomSchema>;

// ============================================================================
// Guest Types
// ============================================================================

export const LoyaltyTierEnum = z.enum(["Member", "Silver", "Gold", "Platinum"]);
export type LoyaltyTier = z.infer<typeof LoyaltyTierEnum>;

export const StayHistoryItemSchema = z.object({
  id: z.string(),
  checkInDate: z.string(),
  checkOutDate: z.string(),
  roomNumber: z.number(),
  totalSpent: z.number(),
});
export type StayHistoryItem = z.infer<typeof StayHistoryItemSchema>;

export const GuestSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  loyaltyTier: LoyaltyTierEnum,
  loyaltyNumber: z.string(),
  preferences: z.array(z.string()), // ["high_floor", "quiet_room", "extra_pillows"]
  stayHistory: z.array(StayHistoryItemSchema),
});
export type Guest = z.infer<typeof GuestSchema>;

// ============================================================================
// Reservation Types
// ============================================================================

export const ReservationStatusEnum = z.enum([
  "confirmed",
  "checked_in",
  "checked_out",
  "cancelled",
]);
export type ReservationStatus = z.infer<typeof ReservationStatusEnum>;

export const ReservationSchema = z.object({
  id: z.string(),
  confirmationNumber: z.string(),
  guestId: z.string(),
  roomNumber: z.number().optional(),
  roomType: RoomTypeEnum,
  checkInDate: z.string(), // ISO date
  checkOutDate: z.string(),
  status: ReservationStatusEnum,
  specialRequests: z.array(z.string()),
  estimatedArrivalTime: z.string().optional(),
  createdAt: z.string(),
  isEarlyCheckout: z.boolean().optional(), // Flag for early checkout requests
});
export type Reservation = z.infer<typeof ReservationSchema>;

// Extended reservation with denormalized guest data
export const ReservationWithGuestSchema = ReservationSchema.extend({
  guest: GuestSchema,
});
export type ReservationWithGuest = z.infer<typeof ReservationWithGuestSchema>;

// ============================================================================
// Billing Types
// ============================================================================

export const BillingCategoryEnum = z.enum([
  "room",
  "food",
  "amenity",
  "service",
  "tax",
]);
export type BillingCategory = z.infer<typeof BillingCategoryEnum>;

export const BillingItemSchema = z.object({
  id: z.string(),
  reservationId: z.string(),
  description: z.string(),
  category: BillingCategoryEnum,
  amount: z.number(),
  date: z.string(),
  isComped: z.boolean(),
});
export type BillingItem = z.infer<typeof BillingItemSchema>;

export const BillingStatementSchema = z.object({
  reservationId: z.string(),
  guestName: z.string(),
  items: z.array(BillingItemSchema),
  subtotal: z.number(),
  tax: z.number(),
  total: z.number(),
  stagedChanges: z
    .array(
      z.object({
        type: z.enum(["add", "remove", "discount"]),
        item: BillingItemSchema.optional(),
        itemId: z.string().optional(),
        discountPercent: z.number().optional(),
        reason: z.string().optional(),
      })
    )
    .optional(),
});
export type BillingStatement = z.infer<typeof BillingStatementSchema>;

// ============================================================================
// Housekeeping Types
// ============================================================================

export const HousekeepingStatusEnum = z.enum(["dirty", "in_progress", "ready"]);
export type HousekeepingStatus = z.infer<typeof HousekeepingStatusEnum>;

export const HousekeepingPriorityEnum = z.enum(["normal", "rush"]);
export type HousekeepingPriority = z.infer<typeof HousekeepingPriorityEnum>;

export const HousekeepingTaskSchema = z.object({
  id: z.string(),
  roomNumber: z.number(),
  status: HousekeepingStatusEnum,
  priority: HousekeepingPriorityEnum,
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
  lastUpdated: z.string(),
});
export type HousekeepingTask = z.infer<typeof HousekeepingTaskSchema>;

// ============================================================================
// Rate Types
// ============================================================================

export const CompetitorRateSchema = z.object({
  name: z.string(),
  rate: z.number(),
});
export type CompetitorRate = z.infer<typeof CompetitorRateSchema>;

export const RoomRateSchema = z.object({
  id: z.string(),
  roomType: RoomTypeEnum,
  date: z.string(),
  rate: z.number(),
  competitorRates: z.array(CompetitorRateSchema).optional(),
});
export type RoomRate = z.infer<typeof RoomRateSchema>;

// ============================================================================
// Occupancy Types
// ============================================================================

export const OccupancyDataSchema = z.object({
  date: z.string(),
  occupancyRate: z.number(), // 0-100 percentage
  totalRooms: z.number(),
  occupiedRooms: z.number(),
  revenue: z.number(),
});
export type OccupancyData = z.infer<typeof OccupancyDataSchema>;

// ============================================================================
// UI State Types
// ============================================================================

export type ViewType =
  | "dashboard"
  | "reservations"
  | "rooms"
  | "guests"
  | "housekeeping"
  | "reports"
  | "rates";

export interface StagedRoomAssignment {
  reservationId: string;
  previousRoom?: number;
  newRoom: number;
}

export interface StagedBillingChange {
  reservationId: string;
  type: "add" | "remove" | "discount";
  item?: BillingItem;
  itemId?: string;
  discountPercent?: number;
  reason?: string;
}

export interface StagedRoomStatusChange {
  roomNumber: number;
  previousStatus: RoomStatus;
  newStatus: RoomStatus;
  reason?: string;
}

export interface StagedRateChange {
  roomType: RoomType;
  date: string;
  previousRate: number;
  newRate: number;
}

export interface StagedHousekeepingChange {
  roomNumber: number;
  priority?: "normal" | "rush";
  status?: "dirty" | "in_progress" | "ready";
  notes?: string;
}

export interface KeyGenerationData {
  roomNumber: number;
  guestName: string;
  checkOutDate: string;
  keyCount: number;
}

export interface HotelState {
  // Current view
  currentView: ViewType;
  // Selected items
  selectedReservationId: string | null;
  selectedRoomNumber: number | null;
  selectedGuestId: string | null;
  // Filters
  roomFilter: {
    type?: RoomType;
    status?: RoomStatus;
    features?: string[];
  };
  reservationFilter: {
    status?: ReservationStatus;
    date?: string;
  };
  // Staged changes (for human-in-the-loop)
  stagedRoomAssignment: StagedRoomAssignment | null;
  stagedBillingChanges: StagedBillingChange[];
  stagedRoomStatusChange: StagedRoomStatusChange | null;
  stagedRateChange: StagedRateChange | null;
  stagedHousekeepingChange: StagedHousekeepingChange | null;
  // Highlighted elements
  highlightedRoomNumbers: number[];
  highlightedReservationIds: string[];
  // Check-in flow
  checkInReservationId: string | null;
  // Key generation
  keyGenerationData: KeyGenerationData | null;
}

// ============================================================================
// Tool Response Types
// ============================================================================

export const SearchReservationsArgsSchema = z.object({
  name: z.string().optional().describe("Guest name to search for"),
  confirmationNumber: z
    .string()
    .optional()
    .describe("Reservation confirmation number"),
  roomNumber: z.number().optional().describe("Room number"),
  date: z
    .string()
    .optional()
    .describe('Date filter: "today", "tomorrow", or ISO date'),
  status: ReservationStatusEnum.optional().describe("Reservation status"),
});
export type SearchReservationsArgs = z.infer<
  typeof SearchReservationsArgsSchema
>;

export const GetAvailableRoomsArgsSchema = z.object({
  type: RoomTypeEnum.optional().describe("Room type filter"),
  features: z.array(z.string()).optional().describe("Required room features"),
  date: z.string().optional().describe("Date to check availability"),
});
export type GetAvailableRoomsArgs = z.infer<typeof GetAvailableRoomsArgsSchema>;

export const StageRoomAssignmentArgsSchema = z.object({
  reservationId: z.string().describe("Reservation ID"),
  roomNumber: z.number().describe("Room number to assign"),
});
export type StageRoomAssignmentArgs = z.infer<
  typeof StageRoomAssignmentArgsSchema
>;

export const StageBillingAdjustmentArgsSchema = z.object({
  reservationId: z.string().describe("Reservation ID"),
  action: z
    .enum(["add", "remove", "discount"])
    .describe("Type of billing adjustment"),
  item: z.string().optional().describe("Item description for add action"),
  itemId: z.string().optional().describe("Item ID for remove action"),
  amount: z.number().optional().describe("Amount for add action"),
  discountPercent: z
    .number()
    .optional()
    .describe("Discount percentage for discount action"),
  reason: z.string().optional().describe("Reason for the adjustment"),
});
export type StageBillingAdjustmentArgs = z.infer<
  typeof StageBillingAdjustmentArgsSchema
>;

export const StageRoomStatusChangeArgsSchema = z.object({
  roomNumber: z.number().describe("Room number"),
  status: RoomStatusEnum.describe("New room status"),
  reason: z.string().optional().describe("Reason for status change"),
});
export type StageRoomStatusChangeArgs = z.infer<
  typeof StageRoomStatusChangeArgsSchema
>;

export const StageRateChangeArgsSchema = z.object({
  roomType: RoomTypeEnum.describe("Room type"),
  date: z.string().describe("Date for rate change"),
  rate: z.number().describe("New rate"),
});
export type StageRateChangeArgs = z.infer<typeof StageRateChangeArgsSchema>;

export const GetOccupancyDataArgsSchema = z.object({
  range: z
    .enum(["today", "this_week", "this_month", "custom"])
    .describe("Date range"),
  startDate: z.string().optional().describe("Start date for custom range"),
  endDate: z.string().optional().describe("End date for custom range"),
});
export type GetOccupancyDataArgs = z.infer<typeof GetOccupancyDataArgsSchema>;

export const GetCompetitorRatesArgsSchema = z.object({
  date: z.string().describe("Date to get competitor rates for"),
  roomType: RoomTypeEnum.optional().describe("Room type filter"),
});
export type GetCompetitorRatesArgs = z.infer<
  typeof GetCompetitorRatesArgsSchema
>;

export const GetHistoricalOccupancyArgsSchema = z.object({
  date: z
    .string()
    .describe('Date reference: "last_year_same_weekend" or specific date'),
  range: z.number().optional().describe("Days around date"),
});
export type GetHistoricalOccupancyArgs = z.infer<
  typeof GetHistoricalOccupancyArgsSchema
>;

export const GetRoomTypeAvailabilityArgsSchema = z.object({
  date: z.string().describe("Date to check availability"),
});
export type GetRoomTypeAvailabilityArgs = z.infer<
  typeof GetRoomTypeAvailabilityArgsSchema
>;

export const CalculateRevenueProjectionArgsSchema = z.object({
  roomType: RoomTypeEnum.describe("Room type"),
  date: z.string().describe("Date for projection"),
  newRate: z.number().describe("Proposed new rate"),
  currentRate: z.number().describe("Current rate"),
});
export type CalculateRevenueProjectionArgs = z.infer<
  typeof CalculateRevenueProjectionArgsSchema
>;

export const DraftGuestMessageArgsSchema = z.object({
  guestId: z.string().describe("Guest ID"),
  template: z
    .enum(["welcome", "apology", "confirmation", "thank_you", "custom"])
    .describe("Message template type"),
  context: z.string().optional().describe("Additional context for the message"),
  offer: z
    .string()
    .optional()
    .describe("Compensation offer (e.g., room_service_credit)"),
  customContent: z
    .string()
    .optional()
    .describe("Custom message content for custom template"),
});
export type DraftGuestMessageArgs = z.infer<typeof DraftGuestMessageArgsSchema>;

export const DraftRevenueReportArgsSchema = z.object({
  includeCharts: z.boolean().describe("Whether to include charts"),
  dateRange: z.string().describe("Date range for the report"),
  rateChanges: z
    .array(
      z.object({
        roomType: z.string(),
        date: z.string(),
        oldRate: z.number(),
        newRate: z.number(),
      })
    )
    .optional()
    .describe("Rate changes to include in report"),
});
export type DraftRevenueReportArgs = z.infer<
  typeof DraftRevenueReportArgsSchema
>;

export const NavigateToViewArgsSchema = z.object({
  view: z
    .enum([
      "dashboard",
      "reservations",
      "rooms",
      "guests",
      "housekeeping",
      "reports",
      "rates",
    ])
    .describe("View to navigate to"),
});
export type NavigateToViewArgs = z.infer<typeof NavigateToViewArgsSchema>;

export const HighlightElementArgsSchema = z.object({
  elementType: z
    .enum(["room", "reservation", "guest"])
    .describe("Type of element to highlight"),
  elementId: z.string().describe("ID of the element to highlight"),
});
export type HighlightElementArgs = z.infer<typeof HighlightElementArgsSchema>;

export const GetForwardBookingsArgsSchema = z.object({
  roomType: RoomTypeEnum.describe("Room type to check"),
  date: z.string().describe("Date to check forward bookings for"),
});
export type GetForwardBookingsArgs = z.infer<
  typeof GetForwardBookingsArgsSchema
>;
