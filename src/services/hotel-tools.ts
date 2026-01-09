import { getHotelContextRef } from "@/lib/hotel-store";
import {
  guests,
  reservations,
  rooms,
  billingItems,
  roomRates,
  occupancyData,
  historicalOccupancy,
  getGuestById,
} from "@/data/mock-data";
import type {
  SearchReservationsArgs,
  GetAvailableRoomsArgs,
  StageRoomAssignmentArgs,
  StageBillingAdjustmentArgs,
  StageRoomStatusChangeArgs,
  StageRateChangeArgs,
  GetOccupancyDataArgs,
  GetCompetitorRatesArgs,
  GetHistoricalOccupancyArgs,
  GetRoomTypeAvailabilityArgs,
  CalculateRevenueProjectionArgs,
  DraftGuestMessageArgs,
  DraftRevenueReportArgs,
  NavigateToViewArgs,
  HighlightElementArgs,
  GetForwardBookingsArgs,
  SubmitRoomIssueArgs,
  BillingItem,
  OccupancyData,
  ReservationSummary,
  RoomSummary,
  GuestSummary,
} from "@/lib/hotel-types";

// ============================================================================
// Search & Navigation Tools
// ============================================================================

/**
 * Search reservations and return minimal context for AI decisions.
 * Returns summary info (ID, guest name, confirmation, status).
 * Components should use the returned ID to fetch full data.
 */
export function searchReservations(
  args: SearchReservationsArgs,
): ReservationSummary[] {
  const context = getHotelContextRef();
  const allReservations = context?.state.reservations || reservations;

  let results = [...allReservations];

  // Filter by name (fuzzy match)
  if (args.name) {
    const searchName = args.name.toLowerCase();
    results = results.filter((res) => {
      const guest = getGuestById(res.guestId);
      if (!guest) return false;
      const fullName = `${guest.firstName} ${guest.lastName}`.toLowerCase();
      return fullName.includes(searchName);
    });
  }

  // Filter by confirmation number
  if (args.confirmationNumber) {
    const confNum = args.confirmationNumber.toUpperCase();
    results = results.filter((res) =>
      res.confirmationNumber.toUpperCase().includes(confNum),
    );
  }

  // Filter by room number
  if (args.roomNumber) {
    results = results.filter((res) => res.roomNumber === args.roomNumber);
  }

  // Filter by date
  if (args.date) {
    const today = new Date().toISOString().split("T")[0];
    let targetDate: string;

    if (args.date === "today") {
      targetDate = today;
    } else if (args.date === "tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      targetDate = tomorrow.toISOString().split("T")[0];
    } else {
      targetDate = args.date;
    }

    results = results.filter(
      (res) =>
        res.checkInDate === targetDate || res.checkOutDate === targetDate,
    );
  }

  // Filter by status
  if (args.status) {
    results = results.filter((res) => res.status === args.status);
  }

  // Highlight results in UI
  if (context && results.length > 0) {
    context.highlightReservations(results.map((r) => r.id));
  }

  // Return minimal context - components fetch full data using ID
  return results.map((res) => {
    const guest = getGuestById(res.guestId);
    return {
      id: res.id,
      guestId: res.guestId,
      guestName: guest ? `${guest.firstName} ${guest.lastName}` : "Unknown",
      confirmationNumber: res.confirmationNumber,
      status: res.status,
      roomType: res.roomType,
      roomNumber: res.roomNumber,
      checkInDate: res.checkInDate,
      checkOutDate: res.checkOutDate,
    };
  });
}

/**
 * Get reservation details - returns minimal context for AI.
 * Use the returned reservationId with ReservationDetail component.
 */
export function getReservationDetails(args: { reservationId: string }) {
  const context = getHotelContextRef();
  const allReservations = context?.state.reservations || reservations;

  const reservation = allReservations.find((r) => r.id === args.reservationId);
  if (!reservation) {
    return { error: "Reservation not found" };
  }

  const guest = getGuestById(reservation.guestId);
  const billing = billingItems.filter(
    (b) => b.reservationId === reservation.id,
  );
  const total = billing.reduce(
    (sum, item) => sum + (item.isComped ? 0 : item.amount),
    0,
  );

  // Select and navigate to reservation
  if (context) {
    context.selectReservation(reservation.id);
    context.navigateTo("reservations");
  }

  // Return minimal context - components fetch full data using IDs
  return {
    reservationId: reservation.id,
    guestId: reservation.guestId,
    guestName: guest ? `${guest.firstName} ${guest.lastName}` : "Unknown",
    confirmationNumber: reservation.confirmationNumber,
    status: reservation.status,
    roomType: reservation.roomType,
    roomNumber: reservation.roomNumber,
    checkInDate: reservation.checkInDate,
    checkOutDate: reservation.checkOutDate,
    billingTotal: total,
    billingItemCount: billing.length,
  };
}

/**
 * Get available rooms - returns minimal context for AI.
 * Returns room numbers and types so AI can suggest options.
 * Components should fetch full data using room number.
 */
export function getAvailableRooms(args: GetAvailableRoomsArgs): RoomSummary[] {
  const context = getHotelContextRef();
  const allRooms = context?.state.rooms || rooms;

  let available = allRooms.filter(
    (r) => r.status === "available" || r.status === "clean",
  );

  if (args.type) {
    available = available.filter((r) => r.type === args.type);
  }

  if (args.features && args.features.length > 0) {
    available = available.filter((r) =>
      args.features!.every((f) => r.features.includes(f)),
    );
  }

  // Highlight available rooms
  if (context) {
    context.highlightRooms(available.map((r) => r.number));
    context.setRoomFilter({ type: args.type, features: args.features });
    context.navigateTo("rooms");
  }

  // Return minimal context
  return available.map((r) => ({
    number: r.number,
    type: r.type,
    status: r.status,
    features: r.features,
  }));
}

export function navigateToView(args: NavigateToViewArgs) {
  const context = getHotelContextRef();
  if (!context) {
    return { success: false, error: "Context not available" };
  }

  context.navigateTo(args.view);

  return { success: true };
}

export function highlightElement(args: HighlightElementArgs) {
  const context = getHotelContextRef();
  if (!context) {
    return { success: false, error: "Context not available" };
  }

  if (args.elementType === "room") {
    const roomNumber = parseInt(args.elementId);
    if (!isNaN(roomNumber)) {
      context.highlightRooms([roomNumber]);
      context.selectRoom(roomNumber);
    }
  } else if (args.elementType === "reservation") {
    context.highlightReservations([args.elementId]);
    context.selectReservation(args.elementId);
  } else if (args.elementType === "guest") {
    context.selectGuest(args.elementId);
  }

  return { success: true };
}

// ============================================================================
// Staging Tools (Human-in-the-Loop)
// ============================================================================

export function stageRoomAssignment(args: StageRoomAssignmentArgs) {
  const context = getHotelContextRef();
  if (!context) {
    return { success: false, error: "Context not available" };
  }

  const room = context.state.rooms.find((r) => r.number === args.roomNumber);
  if (!room) {
    return { success: false, error: "Room not found" };
  }

  if (room.status !== "available" && room.status !== "clean") {
    return {
      success: false,
      error: `Room ${args.roomNumber} is not available (status: ${room.status})`,
    };
  }

  const reservation = context.state.reservations.find(
    (r) => r.id === args.reservationId,
  );
  if (!reservation) {
    return { success: false, error: "Reservation not found" };
  }

  context.stageRoomAssignment(
    args.reservationId,
    args.roomNumber,
    reservation.roomNumber,
  );
  context.highlightRooms([args.roomNumber]);

  return {
    success: true,
    stagedChange: {
      previousRoom: reservation.roomNumber,
      newRoom: args.roomNumber,
      roomDetails: room,
    },
    message: `Room ${args.roomNumber} (${room.type}) staged for assignment. Click 'Complete Check-in' or 'Save Changes' to confirm.`,
  };
}

export function stageBillingAdjustment(args: StageBillingAdjustmentArgs) {
  const context = getHotelContextRef();
  if (!context) {
    return { success: false, error: "Context not available" };
  }

  const reservation = context.state.reservations.find(
    (r) => r.id === args.reservationId,
  );
  if (!reservation) {
    return { success: false, error: "Reservation not found" };
  }

  const currentBilling = context.state.billingItems.filter(
    (b) => b.reservationId === args.reservationId,
  );

  if (args.action === "remove") {
    // Find item to remove by description match
    let itemToRemove: BillingItem | undefined;

    if (args.itemId) {
      itemToRemove = currentBilling.find((b) => b.id === args.itemId);
    } else if (args.item) {
      // Fuzzy match by description
      const searchTerm = args.item.toLowerCase();
      itemToRemove = currentBilling.find((b) =>
        b.description.toLowerCase().includes(searchTerm),
      );
    }

    if (!itemToRemove) {
      return { success: false, error: "Billing item not found" };
    }

    context.stageBillingChange({
      reservationId: args.reservationId,
      type: "remove",
      itemId: itemToRemove.id,
      reason: args.reason,
    });

    return {
      success: true,
      message: `"${itemToRemove.description}" ($${itemToRemove.amount}) staged for removal. Click 'Save' to confirm.`,
    };
  }

  if (args.action === "discount" && args.itemId && args.discountPercent) {
    const item = currentBilling.find((b) => b.id === args.itemId);
    if (!item) {
      return { success: false, error: "Billing item not found" };
    }

    context.stageBillingChange({
      reservationId: args.reservationId,
      type: "discount",
      itemId: args.itemId,
      discountPercent: args.discountPercent,
      reason: args.reason,
    });

    const newAmount = item.amount * (1 - args.discountPercent / 100);
    return {
      success: true,
      message: `${args.discountPercent}% discount staged for "${item.description}" ($${item.amount} → $${newAmount.toFixed(2)}). Click 'Save' to confirm.`,
    };
  }

  if (args.action === "add" && args.item && args.amount) {
    const newItem: BillingItem = {
      id: `bill-new-${Date.now()}`,
      reservationId: args.reservationId,
      description: args.item,
      category: "service",
      amount: args.amount,
      date: new Date().toISOString().split("T")[0],
      isComped: false,
    };

    context.stageBillingChange({
      reservationId: args.reservationId,
      type: "add",
      item: newItem,
      reason: args.reason,
    });

    return {
      success: true,
      message: `New charge "${args.item}" ($${args.amount}) staged. Click 'Save' to confirm.`,
    };
  }

  return { success: false, error: "Invalid billing adjustment parameters" };
}

export function stageRoomStatusChange(args: StageRoomStatusChangeArgs) {
  const context = getHotelContextRef();
  if (!context) {
    return { success: false, error: "Context not available" };
  }

  const room = context.state.rooms.find((r) => r.number === args.roomNumber);
  if (!room) {
    return { success: false, error: "Room not found" };
  }

  context.stageRoomStatusChange(
    args.roomNumber,
    args.status,
    room.status,
    args.reason,
  );
  context.highlightRooms([args.roomNumber]);

  return {
    success: true,
    stagedChange: {
      ...room,
      status: args.status,
    },
    message: `Room ${args.roomNumber} status change staged: ${room.status} → ${args.status}. Click 'Save' to confirm.`,
  };
}

export function stageRateChange(args: StageRateChangeArgs) {
  const context = getHotelContextRef();
  if (!context) {
    return { success: false, error: "Context not available" };
  }

  const currentRate = roomRates.find(
    (r) => r.roomType === args.roomType && r.date === args.date,
  );

  const previousRate = currentRate?.rate || 0;

  context.stageRateChange(args.roomType, args.date, args.rate, previousRate);

  // Count affected rooms
  const affectedRooms = context.state.rooms.filter(
    (r) =>
      r.type === args.roomType &&
      (r.status === "available" || r.status === "clean"),
  ).length;

  return {
    success: true,
    stagedRate: {
      roomType: args.roomType,
      date: args.date,
      rate: args.rate,
      previousRate,
    },
    affectedRooms,
    message: `Rate change staged for ${args.roomType} on ${args.date}: $${previousRate} → $${args.rate}. ${affectedRooms} rooms affected. Click 'Apply Rate Change' to confirm.`,
  };
}

// ============================================================================
// Analytics Tools
// ============================================================================

export function getOccupancyData(args: GetOccupancyDataArgs): OccupancyData[] {
  const context = getHotelContextRef();
  const today = new Date();
  let data = [...occupancyData];

  if (args.range === "today") {
    const todayStr = today.toISOString().split("T")[0];
    data = data.filter((d) => d.date === todayStr);
  } else if (args.range === "this_week") {
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    data = data.filter((d) => {
      const date = new Date(d.date);
      return date >= weekAgo && date <= today;
    });
  } else if (args.range === "this_month") {
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);
    data = data.filter((d) => {
      const date = new Date(d.date);
      return date >= monthAgo && date <= today;
    });
  } else if (args.range === "custom" && args.startDate && args.endDate) {
    data = data.filter(
      (d) => d.date >= args.startDate! && d.date <= args.endDate!,
    );
  }

  // Navigate to reports view
  if (context) {
    context.navigateTo("reports");
  }

  return data;
}

export function getCompetitorRates(args: GetCompetitorRatesArgs) {
  const rate = roomRates.find(
    (r) =>
      r.date === args.date &&
      (args.roomType ? r.roomType === args.roomType : true),
  );

  if (!rate?.competitorRates) {
    return [];
  }

  return rate.competitorRates.map((c) => ({
    competitor: c.name,
    rate: c.rate,
    roomType: args.roomType || "King",
  }));
}

export function getHistoricalOccupancy(
  args: GetHistoricalOccupancyArgs,
): OccupancyData[] {
  if (args.date === "last_year_same_weekend") {
    return historicalOccupancy;
  }

  // For specific date, find matching historical data
  return historicalOccupancy.filter((d) => d.date === args.date);
}

export function getRoomTypeAvailability(args: GetRoomTypeAvailabilityArgs) {
  const context = getHotelContextRef();
  const allRooms = context?.state.rooms || rooms;

  const roomTypes = ["King", "Queen", "Suite"] as const;

  return roomTypes.map((type) => {
    const roomsOfType = allRooms.filter((r) => r.type === type);
    const available = roomsOfType.filter(
      (r) => r.status === "available" || r.status === "clean",
    ).length;

    return {
      roomType: type,
      available,
      total: roomsOfType.length,
    };
  });
}

export function getForwardBookings(args: GetForwardBookingsArgs) {
  const context = getHotelContextRef();
  const allReservations = context?.state.reservations || reservations;

  // Find reservations that have this room type booked for the given date or later
  const bookings = allReservations.filter(
    (r) =>
      r.roomType === args.roomType &&
      r.checkInDate <= args.date &&
      r.checkOutDate > args.date &&
      r.status !== "cancelled",
  );

  return {
    roomType: args.roomType,
    date: args.date,
    bookedCount: bookings.length,
    bookings: bookings.map((b) => ({
      id: b.id,
      confirmationNumber: b.confirmationNumber,
      checkInDate: b.checkInDate,
      checkOutDate: b.checkOutDate,
    })),
  };
}

export function calculateRevenueProjection(
  args: CalculateRevenueProjectionArgs,
) {
  const context = getHotelContextRef();
  const allRooms = context?.state.rooms || rooms;

  // Get available rooms of this type
  const availableCount = allRooms.filter(
    (r) =>
      r.type === args.roomType &&
      (r.status === "available" || r.status === "clean"),
  ).length;

  // Simple projection model:
  // - Lower rates = more bookings
  // - Estimate conversion based on rate vs competitor
  const rateDiff = args.currentRate - args.newRate;
  const conversionBoost =
    rateDiff > 0 ? Math.min((rateDiff / 10) * 0.15, 0.5) : 0;

  const currentOccupancy = 0.65; // Base occupancy from our data
  const projectedOccupancy = Math.min(currentOccupancy + conversionBoost, 0.95);

  const projectedBookings = Math.round(availableCount * projectedOccupancy);
  const currentRevenue = 0; // Currently unbooked
  const projectedRevenue = projectedBookings * args.newRate;

  return {
    projectedBookings,
    currentRevenue,
    projectedRevenue,
    difference: projectedRevenue - currentRevenue,
    details: {
      availableRooms: availableCount,
      currentOccupancy: `${Math.round(currentOccupancy * 100)}%`,
      projectedOccupancy: `${Math.round(projectedOccupancy * 100)}%`,
      rateChange: `$${args.currentRate} → $${args.newRate}`,
    },
  };
}

// ============================================================================
// Communication Tools
// ============================================================================

export function draftGuestMessage(args: DraftGuestMessageArgs) {
  const context = getHotelContextRef();
  const guest = guests.find((g) => g.id === args.guestId);

  if (!guest) {
    return { error: "Guest not found" };
  }

  let subject = "";
  let body = "";

  const greeting = `Dear ${guest.firstName},`;
  const signature = `\n\nWarm regards,\nThe Grand Hotel Team`;

  switch (args.template) {
    case "welcome":
      subject = `Welcome to Grand Hotel, ${guest.firstName}!`;
      body = `${greeting}\n\nWelcome to Grand Hotel! We are delighted to have you as our guest${
        guest.loyaltyTier !== "Member"
          ? ` and valued ${guest.loyaltyTier} member`
          : ""
      }.\n\nIf there is anything we can do to make your stay more comfortable, please don't hesitate to contact the front desk.${signature}`;
      break;

    case "apology":
      subject = "Our Sincere Apologies - Grand Hotel";
      body = `${greeting}\n\nWe sincerely apologize for any inconvenience you may have experienced during your stay with us.${
        args.context
          ? `\n\nRegarding ${args.context}, we understand this was not the experience you expected.`
          : ""
      }${
        args.offer
          ? `\n\nAs a gesture of our commitment to your satisfaction, we would like to offer you ${args.offer.replace(/_/g, " ")}.`
          : ""
      }\n\nYour comfort and satisfaction are our top priorities, and we truly value your patronage${
        guest.loyaltyTier !== "Member"
          ? ` as a ${guest.loyaltyTier} member`
          : ""
      }.${signature}`;
      break;

    case "confirmation":
      subject = "Reservation Confirmation - Grand Hotel";
      body = `${greeting}\n\nThank you for choosing Grand Hotel. This email confirms your upcoming reservation.\n\nWe look forward to welcoming you soon.${signature}`;
      break;

    case "thank_you":
      subject = "Thank You for Staying with Us - Grand Hotel";
      body = `${greeting}\n\nThank you for choosing Grand Hotel for your recent stay. We hope you enjoyed your time with us.\n\n${
        guest.loyaltyTier !== "Member"
          ? `As a valued ${guest.loyaltyTier} member, you've earned additional points for this stay. `
          : ""
      }We hope to welcome you back soon.${signature}`;
      break;

    case "custom":
      subject = "Message from Grand Hotel";
      body = `${greeting}\n\n${args.customContent || ""}${signature}`;
      break;
  }

  // Set draft message in context to show composer
  if (context) {
    context.setDraftMessage({
      to: guest.email,
      subject,
      body,
    });
  }

  return {
    subject,
    body,
    guestEmail: guest.email,
    message: "Message drafted. Review and click 'Send' to deliver.",
  };
}

export function draftRevenueReport(args: DraftRevenueReportArgs) {
  const context = getHotelContextRef();

  const subject = `Revenue Report - ${args.dateRange}`;

  let body = `Revenue Report\n${"=".repeat(40)}\n\nDate Range: ${args.dateRange}\n\n`;

  // Add occupancy summary
  const recentOccupancy = occupancyData.slice(-7);
  const avgOccupancy = Math.round(
    recentOccupancy.reduce((sum, d) => sum + d.occupancyRate, 0) /
      recentOccupancy.length,
  );
  const totalRevenue = recentOccupancy.reduce((sum, d) => sum + d.revenue, 0);

  body += `OCCUPANCY SUMMARY\n${"-".repeat(20)}\n`;
  body += `Average Occupancy: ${avgOccupancy}%\n`;
  body += `Total Revenue: $${totalRevenue.toLocaleString()}\n\n`;

  // Add rate changes if any
  if (args.rateChanges && args.rateChanges.length > 0) {
    body += `RATE ADJUSTMENTS\n${"-".repeat(20)}\n`;
    for (const change of args.rateChanges) {
      body += `• ${change.roomType} (${change.date}): $${change.oldRate} → $${change.newRate}\n`;
    }
    body += "\n";
  }

  body += `\nReport generated on ${new Date().toLocaleString()}`;

  // Set draft message
  if (context) {
    context.setDraftMessage({
      to: "revenue-manager@grandhotel.com",
      subject,
      body,
    });
  }

  return {
    subject,
    body,
    chartData: args.includeCharts
      ? {
          occupancy: recentOccupancy,
          avgOccupancy,
          totalRevenue,
        }
      : null,
    message: "Revenue report drafted. Review and click 'Send' to deliver.",
  };
}

// ============================================================================
// Commit Tools (Finalize Staged Changes)
// ============================================================================

export function completeCheckIn(args: { reservationId: string }) {
  const context = getHotelContextRef();
  if (!context) {
    return { success: false, error: "Context not available" };
  }

  const reservation = context.state.reservations.find(
    (r) => r.id === args.reservationId,
  );
  if (!reservation) {
    return { success: false, error: "Reservation not found" };
  }

  if (reservation.status !== "confirmed") {
    return {
      success: false,
      error: `Cannot check in - reservation status is ${reservation.status}`,
    };
  }

  // Start check-in if not already started
  if (context.state.checkInReservationId !== args.reservationId) {
    context.startCheckIn(args.reservationId);
  }

  // Complete the check-in (commits all staged changes)
  context.completeCheckIn();

  return {
    success: true,
    message: `Check-in completed for ${reservation.confirmationNumber}. Guest is now checked in.`,
  };
}

export function commitReservationChanges(args: { reservationId: string }) {
  const context = getHotelContextRef();
  if (!context) {
    return { success: false, error: "Context not available" };
  }

  const reservation = context.state.reservations.find(
    (r) => r.id === args.reservationId,
  );
  if (!reservation) {
    return { success: false, error: "Reservation not found" };
  }

  // Commit room assignment if staged
  if (
    context.state.stagedRoomAssignment?.reservationId === args.reservationId
  ) {
    context.commitRoomAssignment();
  }

  // Commit billing changes for this reservation
  const hasBillingChanges = context.state.stagedBillingChanges.some(
    (c) => c.reservationId === args.reservationId,
  );
  if (hasBillingChanges) {
    context.commitBillingChanges();
  }

  return {
    success: true,
    message: `Changes saved for reservation ${reservation.confirmationNumber}.`,
  };
}

export function commitRoomStatusChange(args: { roomNumber: number }) {
  const context = getHotelContextRef();
  if (!context) {
    return { success: false, error: "Context not available" };
  }

  const stagedChange = context.state.stagedRoomStatusChange;
  if (!stagedChange || stagedChange.roomNumber !== args.roomNumber) {
    return { success: false, error: "No staged status change for this room" };
  }

  context.commitRoomStatusChange();

  return {
    success: true,
    message: `Room ${args.roomNumber} status updated to ${stagedChange.newStatus}.`,
  };
}

export function commitHousekeepingChange(args: { roomNumber: number }) {
  const context = getHotelContextRef();
  if (!context) {
    return { success: false, error: "Context not available" };
  }

  const stagedChange = context.state.stagedHousekeepingChange;
  if (!stagedChange || stagedChange.roomNumber !== args.roomNumber) {
    return {
      success: false,
      error: "No staged housekeeping change for this room",
    };
  }

  context.commitHousekeepingChange();

  return {
    success: true,
    message: `Housekeeping updated for room ${args.roomNumber}.`,
  };
}

export function commitRateChange(args: { roomType: string; date: string }) {
  const context = getHotelContextRef();
  if (!context) {
    return { success: false, error: "Context not available" };
  }

  const stagedChange = context.state.stagedRateChange;
  if (
    !stagedChange ||
    stagedChange.roomType !== args.roomType ||
    stagedChange.date !== args.date
  ) {
    return {
      success: false,
      error: "No staged rate change matching these parameters",
    };
  }

  context.commitRateChange();

  return {
    success: true,
    message: `Rate updated for ${args.roomType} on ${args.date}: $${stagedChange.newRate}.`,
  };
}

// ============================================================================
// Housekeeping Tools
// ============================================================================

export function stageHousekeepingUpdate(args: {
  roomNumber: number;
  priority?: "normal" | "rush";
  status?: "dirty" | "in_progress" | "ready";
  notes?: string;
}) {
  const context = getHotelContextRef();
  if (!context) {
    return { success: false, error: "Context not available" };
  }

  const task = context.state.housekeepingTasks.find(
    (t) => t.roomNumber === args.roomNumber,
  );
  if (!task) {
    return {
      success: false,
      error: `No housekeeping task found for room ${args.roomNumber}`,
    };
  }

  context.stageHousekeepingChange(args.roomNumber, {
    priority: args.priority,
    status: args.status,
    notes: args.notes,
  });

  const changes = [];
  if (args.priority) changes.push(`priority: ${args.priority}`);
  if (args.status) changes.push(`status: ${args.status}`);
  if (args.notes) changes.push(`notes added`);

  return {
    success: true,
    stagedChange: {
      roomNumber: args.roomNumber,
      previousPriority: task.priority,
      newPriority: args.priority || task.priority,
      previousStatus: task.status,
      newStatus: args.status || task.status,
    },
    message: `Housekeeping update staged for room ${args.roomNumber}: ${changes.join(", ")}. Click 'Update Status' to confirm.`,
  };
}

export function getEarlyCheckouts() {
  const context = getHotelContextRef();
  if (!context) {
    return { error: "Context not available", checkouts: [] };
  }

  const today = new Date().toISOString().split("T")[0];
  const departures = context.state.reservations.filter(
    (r) => r.checkOutDate === today && r.status === "checked_in",
  );

  // Filter to early checkouts (those marked or before scheduled time)
  const earlyCheckouts = departures.filter((r) => r.isEarlyCheckout === true);

  // Navigate to departures view
  context.navigateTo("reservations");
  if (earlyCheckouts.length > 0) {
    context.highlightReservations(earlyCheckouts.map((r) => r.id));
  }

  return {
    count: earlyCheckouts.length,
    totalDepartures: departures.length,
    checkouts: earlyCheckouts.map((r) => ({
      id: r.id,
      confirmationNumber: r.confirmationNumber,
      guestId: r.guestId,
      roomNumber: r.roomNumber,
    })),
    message: `Found ${earlyCheckouts.length} early checkout(s) out of ${departures.length} total departures today.`,
  };
}

// ============================================================================
// Guest Services Tools
// ============================================================================

/**
 * Look up guest by room number - returns minimal context for AI.
 * Use guestId with GuestProfile component, reservationId with ReservationDetail.
 */
export function getGuestByRoom(args: { roomNumber: number }) {
  const context = getHotelContextRef();
  if (!context) {
    return { error: "Context not available" };
  }

  const room = context.state.rooms.find((r) => r.number === args.roomNumber);
  if (!room) {
    return { error: `Room ${args.roomNumber} not found` };
  }

  if (room.status !== "occupied" || !room.currentGuestId) {
    return {
      error: `Room ${args.roomNumber} is not currently occupied`,
      roomStatus: room.status,
    };
  }

  const guest = guests.find((g) => g.id === room.currentGuestId);
  if (!guest) {
    return { error: "Guest not found" };
  }

  // Find the current reservation
  const reservation = context.state.reservations.find(
    (r) =>
      r.guestId === guest.id &&
      r.roomNumber === args.roomNumber &&
      r.status === "checked_in",
  );

  // Navigate and select
  context.selectRoom(args.roomNumber);
  context.selectGuest(guest.id);
  context.navigateTo("guests");

  // Return minimal context - components fetch full data using IDs
  return {
    guestId: guest.id,
    guestName: `${guest.firstName} ${guest.lastName}`,
    email: guest.email,
    loyaltyTier: guest.loyaltyTier,
    roomNumber: args.roomNumber,
    reservationId: reservation?.id,
    confirmationNumber: reservation?.confirmationNumber,
    message: `Found ${guest.firstName} ${guest.lastName} in room ${args.roomNumber}.`,
  };
}

export function initiateKeyGeneration(args: {
  roomNumber: number;
  guestId: string;
  keyCount?: number;
}) {
  const context = getHotelContextRef();
  if (!context) {
    return { success: false, error: "Context not available" };
  }

  const room = context.state.rooms.find((r) => r.number === args.roomNumber);
  if (!room) {
    return { success: false, error: `Room ${args.roomNumber} not found` };
  }

  const guest = guests.find((g) => g.id === args.guestId);
  if (!guest) {
    return { success: false, error: "Guest not found" };
  }

  const reservation = context.state.reservations.find(
    (r) =>
      r.guestId === args.guestId &&
      r.roomNumber === args.roomNumber &&
      r.status === "checked_in",
  );

  if (!reservation) {
    return {
      success: false,
      error: "No active reservation found for this guest and room",
    };
  }

  const keyCount = args.keyCount || 2;

  // Set key generation state
  context.initiateKeyGeneration({
    roomNumber: args.roomNumber,
    guestName: `${guest.firstName} ${guest.lastName}`,
    checkOutDate: reservation.checkOutDate,
    keyCount,
  });

  return {
    success: true,
    keyData: {
      roomNumber: args.roomNumber,
      guestName: `${guest.firstName} ${guest.lastName}`,
      checkOutDate: reservation.checkOutDate,
      keyCount,
    },
    message: `Key generation initiated for ${guest.firstName} ${guest.lastName}, room ${args.roomNumber}. ${keyCount} key(s) ready to print.`,
  };
}

// ============================================================================
// Room Issue Tools
// ============================================================================

export function submitRoomIssue(args: SubmitRoomIssueArgs) {
  const context = getHotelContextRef();
  if (!context) {
    return { success: false, error: "Context not available" };
  }

  const room = context.state.rooms.find((r) => r.number === args.roomNumber);
  if (!room) {
    return { success: false, error: `Room ${args.roomNumber} not found` };
  }

  // Generate ticket ID
  const ticketId = `ISS-${Date.now().toString(36).toUpperCase()}`;

  // Get guest info if provided
  let guestName: string | undefined;
  if (args.guestId) {
    const guest = guests.find((g) => g.id === args.guestId);
    if (guest) {
      guestName = `${guest.firstName} ${guest.lastName}`;
    }
  }

  // Navigate to housekeeping view to show the issue context
  context.navigateTo("housekeeping");
  context.highlightRooms([args.roomNumber]);

  return {
    success: true,
    ticketId,
    issue: {
      id: ticketId,
      roomNumber: args.roomNumber,
      guestId: args.guestId,
      guestName,
      category: args.category,
      priority: args.priority,
      description: args.description,
      status: "open" as const,
      createdAt: new Date().toISOString(),
    },
    message: `Room issue reported successfully. Ticket ID: ${ticketId}. Maintenance team has been notified about the ${args.category} issue in room ${args.roomNumber}.`,
  };
}
