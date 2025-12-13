"use client";

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from "react";
import type {
  ViewType,
  RoomType,
  RoomStatus,
  ReservationStatus,
  StagedRoomAssignment,
  StagedBillingChange,
  StagedRoomStatusChange,
  StagedRateChange,
  StagedHousekeepingChange,
  KeyGenerationData,
  HotelState,
  Room,
  BillingItem,
} from "./hotel-types";
import {
  rooms as initialRooms,
  reservations as initialReservations,
  billingItems as initialBillingItems,
  housekeepingTasks as initialHousekeepingTasks,
  roomRates as initialRoomRates,
} from "@/data/mock-data";
import type { Reservation, HousekeepingTask, RoomRate } from "./hotel-types";

// ============================================================================
// State Types
// ============================================================================

interface FullHotelState extends HotelState {
  // Mutable data (can be modified during session)
  rooms: Room[];
  reservations: Reservation[];
  billingItems: BillingItem[];
  housekeepingTasks: HousekeepingTask[];
  roomRates: RoomRate[];
  // Draft message state
  draftMessage: {
    to: string;
    subject: string;
    body: string;
  } | null;
}

const initialState: FullHotelState = {
  // View state
  currentView: "dashboard",
  selectedReservationId: null,
  selectedRoomNumber: null,
  selectedGuestId: null,
  // Filters
  roomFilter: {},
  reservationFilter: {},
  // Staged changes
  stagedRoomAssignment: null,
  stagedBillingChanges: [],
  stagedRoomStatusChange: null,
  stagedRateChange: null,
  stagedHousekeepingChange: null,
  // Highlights
  highlightedRoomNumbers: [],
  highlightedReservationIds: [],
  // Check-in
  checkInReservationId: null,
  // Key generation
  keyGenerationData: null,
  // Data
  rooms: initialRooms,
  reservations: initialReservations,
  billingItems: initialBillingItems,
  housekeepingTasks: initialHousekeepingTasks,
  roomRates: initialRoomRates,
  // Draft message
  draftMessage: null,
};

// ============================================================================
// Action Types
// ============================================================================

type HotelAction =
  | { type: "SET_VIEW"; view: ViewType }
  | { type: "SELECT_RESERVATION"; reservationId: string | null }
  | { type: "SELECT_ROOM"; roomNumber: number | null }
  | { type: "SELECT_GUEST"; guestId: string | null }
  | { type: "SET_ROOM_FILTER"; filter: HotelState["roomFilter"] }
  | { type: "SET_RESERVATION_FILTER"; filter: HotelState["reservationFilter"] }
  | { type: "STAGE_ROOM_ASSIGNMENT"; assignment: StagedRoomAssignment }
  | { type: "CLEAR_STAGED_ROOM_ASSIGNMENT" }
  | { type: "STAGE_BILLING_CHANGE"; change: StagedBillingChange }
  | { type: "CLEAR_STAGED_BILLING_CHANGES" }
  | { type: "STAGE_ROOM_STATUS_CHANGE"; change: StagedRoomStatusChange }
  | { type: "CLEAR_STAGED_ROOM_STATUS_CHANGE" }
  | { type: "STAGE_RATE_CHANGE"; change: StagedRateChange }
  | { type: "CLEAR_STAGED_RATE_CHANGE" }
  | { type: "HIGHLIGHT_ROOMS"; roomNumbers: number[] }
  | { type: "HIGHLIGHT_RESERVATIONS"; reservationIds: string[] }
  | { type: "CLEAR_HIGHLIGHTS" }
  | { type: "START_CHECK_IN"; reservationId: string }
  | { type: "COMPLETE_CHECK_IN" }
  | { type: "CANCEL_CHECK_IN" }
  | { type: "COMMIT_ROOM_ASSIGNMENT" }
  | { type: "COMMIT_BILLING_CHANGES" }
  | { type: "COMMIT_ROOM_STATUS_CHANGE" }
  | { type: "COMMIT_RATE_CHANGE" }
  | { type: "UPDATE_ROOM"; room: Room }
  | { type: "UPDATE_RESERVATION"; reservation: Reservation }
  | { type: "ADD_BILLING_ITEM"; item: BillingItem }
  | { type: "REMOVE_BILLING_ITEM"; itemId: string }
  | { type: "UPDATE_HOUSEKEEPING_TASK"; task: HousekeepingTask }
  | { type: "SET_DRAFT_MESSAGE"; message: { to: string; subject: string; body: string } | null }
  | { type: "CLEAR_DRAFT_MESSAGE" }
  | { type: "STAGE_HOUSEKEEPING_CHANGE"; change: StagedHousekeepingChange }
  | { type: "CLEAR_STAGED_HOUSEKEEPING_CHANGE" }
  | { type: "COMMIT_HOUSEKEEPING_CHANGE" }
  | { type: "SET_KEY_GENERATION_DATA"; data: KeyGenerationData | null }
  | { type: "CLEAR_KEY_GENERATION_DATA" }
  | { type: "RESET_STATE" };

// ============================================================================
// Reducer
// ============================================================================

function hotelReducer(state: FullHotelState, action: HotelAction): FullHotelState {
  switch (action.type) {
    case "SET_VIEW":
      return { ...state, currentView: action.view };

    case "SELECT_RESERVATION":
      return { ...state, selectedReservationId: action.reservationId };

    case "SELECT_ROOM":
      return { ...state, selectedRoomNumber: action.roomNumber };

    case "SELECT_GUEST":
      return { ...state, selectedGuestId: action.guestId };

    case "SET_ROOM_FILTER":
      return { ...state, roomFilter: action.filter };

    case "SET_RESERVATION_FILTER":
      return { ...state, reservationFilter: action.filter };

    case "STAGE_ROOM_ASSIGNMENT":
      return { ...state, stagedRoomAssignment: action.assignment };

    case "CLEAR_STAGED_ROOM_ASSIGNMENT":
      return { ...state, stagedRoomAssignment: null };

    case "STAGE_BILLING_CHANGE":
      return {
        ...state,
        stagedBillingChanges: [...state.stagedBillingChanges, action.change],
      };

    case "CLEAR_STAGED_BILLING_CHANGES":
      return { ...state, stagedBillingChanges: [] };

    case "STAGE_ROOM_STATUS_CHANGE":
      return { ...state, stagedRoomStatusChange: action.change };

    case "CLEAR_STAGED_ROOM_STATUS_CHANGE":
      return { ...state, stagedRoomStatusChange: null };

    case "STAGE_RATE_CHANGE":
      return { ...state, stagedRateChange: action.change };

    case "CLEAR_STAGED_RATE_CHANGE":
      return { ...state, stagedRateChange: null };

    case "HIGHLIGHT_ROOMS":
      return { ...state, highlightedRoomNumbers: action.roomNumbers };

    case "HIGHLIGHT_RESERVATIONS":
      return { ...state, highlightedReservationIds: action.reservationIds };

    case "CLEAR_HIGHLIGHTS":
      return { ...state, highlightedRoomNumbers: [], highlightedReservationIds: [] };

    case "START_CHECK_IN":
      return {
        ...state,
        checkInReservationId: action.reservationId,
        currentView: "reservations",
      };

    case "COMPLETE_CHECK_IN": {
      if (!state.checkInReservationId) return state;

      const reservation = state.reservations.find(r => r.id === state.checkInReservationId);
      if (!reservation) return state;

      // Apply staged room assignment if any
      let updatedReservations = state.reservations;
      let updatedRooms = state.rooms;

      if (state.stagedRoomAssignment) {
        updatedReservations = state.reservations.map(r =>
          r.id === state.checkInReservationId
            ? { ...r, roomNumber: state.stagedRoomAssignment!.newRoom, status: "checked_in" as const }
            : r
        );
        updatedRooms = state.rooms.map(room =>
          room.number === state.stagedRoomAssignment!.newRoom
            ? { ...room, status: "occupied" as const, currentGuestId: reservation.guestId }
            : room
        );
      } else {
        updatedReservations = state.reservations.map(r =>
          r.id === state.checkInReservationId ? { ...r, status: "checked_in" as const } : r
        );
      }

      // Apply staged billing changes
      let updatedBilling = state.billingItems;
      for (const change of state.stagedBillingChanges) {
        if (change.type === "add" && change.item) {
          updatedBilling = [...updatedBilling, change.item];
        } else if (change.type === "remove" && change.itemId) {
          updatedBilling = updatedBilling.filter(b => b.id !== change.itemId);
        }
      }

      return {
        ...state,
        reservations: updatedReservations,
        rooms: updatedRooms,
        billingItems: updatedBilling,
        checkInReservationId: null,
        stagedRoomAssignment: null,
        stagedBillingChanges: [],
        highlightedRoomNumbers: [],
        highlightedReservationIds: [],
      };
    }

    case "CANCEL_CHECK_IN":
      return {
        ...state,
        checkInReservationId: null,
        stagedRoomAssignment: null,
        stagedBillingChanges: [],
      };

    case "COMMIT_ROOM_ASSIGNMENT": {
      if (!state.stagedRoomAssignment) return state;

      const { reservationId, newRoom, previousRoom } = state.stagedRoomAssignment;

      // Update reservation
      const updatedReservations = state.reservations.map(r =>
        r.id === reservationId ? { ...r, roomNumber: newRoom } : r
      );

      // Update room statuses
      const reservation = state.reservations.find(r => r.id === reservationId);
      let updatedRooms = state.rooms;

      if (previousRoom) {
        // Clear old room
        updatedRooms = updatedRooms.map(room =>
          room.number === previousRoom
            ? { ...room, status: "dirty" as const, currentGuestId: undefined }
            : room
        );
      }

      // Assign new room
      updatedRooms = updatedRooms.map(room =>
        room.number === newRoom
          ? { ...room, status: "occupied" as const, currentGuestId: reservation?.guestId }
          : room
      );

      return {
        ...state,
        reservations: updatedReservations,
        rooms: updatedRooms,
        stagedRoomAssignment: null,
      };
    }

    case "COMMIT_BILLING_CHANGES": {
      let updatedBilling = state.billingItems;

      for (const change of state.stagedBillingChanges) {
        if (change.type === "add" && change.item) {
          updatedBilling = [...updatedBilling, change.item];
        } else if (change.type === "remove" && change.itemId) {
          updatedBilling = updatedBilling.filter(b => b.id !== change.itemId);
        } else if (change.type === "discount" && change.itemId && change.discountPercent) {
          updatedBilling = updatedBilling.map(b =>
            b.id === change.itemId
              ? { ...b, amount: b.amount * (1 - change.discountPercent! / 100) }
              : b
          );
        }
      }

      return {
        ...state,
        billingItems: updatedBilling,
        stagedBillingChanges: [],
      };
    }

    case "COMMIT_ROOM_STATUS_CHANGE": {
      if (!state.stagedRoomStatusChange) return state;

      const { roomNumber, newStatus } = state.stagedRoomStatusChange;
      const updatedRooms = state.rooms.map(room =>
        room.number === roomNumber ? { ...room, status: newStatus } : room
      );

      return {
        ...state,
        rooms: updatedRooms,
        stagedRoomStatusChange: null,
      };
    }

    case "COMMIT_RATE_CHANGE": {
      if (!state.stagedRateChange) return state;

      const { roomType, date, newRate } = state.stagedRateChange;
      const updatedRates = state.roomRates.map(rate =>
        rate.roomType === roomType && rate.date === date ? { ...rate, rate: newRate } : rate
      );

      return {
        ...state,
        roomRates: updatedRates,
        stagedRateChange: null,
      };
    }

    case "UPDATE_ROOM":
      return {
        ...state,
        rooms: state.rooms.map(r => (r.id === action.room.id ? action.room : r)),
      };

    case "UPDATE_RESERVATION":
      return {
        ...state,
        reservations: state.reservations.map(r =>
          r.id === action.reservation.id ? action.reservation : r
        ),
      };

    case "ADD_BILLING_ITEM":
      return {
        ...state,
        billingItems: [...state.billingItems, action.item],
      };

    case "REMOVE_BILLING_ITEM":
      return {
        ...state,
        billingItems: state.billingItems.filter(b => b.id !== action.itemId),
      };

    case "UPDATE_HOUSEKEEPING_TASK":
      return {
        ...state,
        housekeepingTasks: state.housekeepingTasks.map(t =>
          t.id === action.task.id ? action.task : t
        ),
      };

    case "SET_DRAFT_MESSAGE":
      return { ...state, draftMessage: action.message };

    case "CLEAR_DRAFT_MESSAGE":
      return { ...state, draftMessage: null };

    case "STAGE_HOUSEKEEPING_CHANGE":
      return { ...state, stagedHousekeepingChange: action.change };

    case "CLEAR_STAGED_HOUSEKEEPING_CHANGE":
      return { ...state, stagedHousekeepingChange: null };

    case "COMMIT_HOUSEKEEPING_CHANGE": {
      if (!state.stagedHousekeepingChange) return state;

      const { roomNumber, priority, status, notes } = state.stagedHousekeepingChange;
      const updatedTasks = state.housekeepingTasks.map(task =>
        task.roomNumber === roomNumber
          ? {
              ...task,
              priority: priority || task.priority,
              status: status || task.status,
              notes: notes || task.notes,
            }
          : task
      );

      return {
        ...state,
        housekeepingTasks: updatedTasks,
        stagedHousekeepingChange: null,
      };
    }

    case "SET_KEY_GENERATION_DATA":
      return { ...state, keyGenerationData: action.data };

    case "CLEAR_KEY_GENERATION_DATA":
      return { ...state, keyGenerationData: null };

    case "RESET_STATE":
      return initialState;

    default:
      return state;
  }
}

// ============================================================================
// Context
// ============================================================================

interface HotelContextValue {
  state: FullHotelState;
  dispatch: React.Dispatch<HotelAction>;
  // Convenience methods
  navigateTo: (view: ViewType) => void;
  selectReservation: (reservationId: string | null) => void;
  selectRoom: (roomNumber: number | null) => void;
  selectGuest: (guestId: string | null) => void;
  setRoomFilter: (filter: HotelState["roomFilter"]) => void;
  setReservationFilter: (filter: HotelState["reservationFilter"]) => void;
  stageRoomAssignment: (reservationId: string, roomNumber: number, previousRoom?: number) => void;
  stageBillingChange: (change: StagedBillingChange) => void;
  stageRoomStatusChange: (roomNumber: number, newStatus: RoomStatus, previousStatus: RoomStatus, reason?: string) => void;
  stageRateChange: (roomType: RoomType, date: string, newRate: number, previousRate: number) => void;
  highlightRooms: (roomNumbers: number[]) => void;
  highlightReservations: (reservationIds: string[]) => void;
  clearHighlights: () => void;
  startCheckIn: (reservationId: string) => void;
  completeCheckIn: () => void;
  cancelCheckIn: () => void;
  commitRoomAssignment: () => void;
  commitBillingChanges: () => void;
  commitRoomStatusChange: () => void;
  commitRateChange: () => void;
  stageHousekeepingChange: (roomNumber: number, changes: Omit<StagedHousekeepingChange, "roomNumber">) => void;
  commitHousekeepingChange: () => void;
  initiateKeyGeneration: (data: KeyGenerationData) => void;
  clearKeyGenerationData: () => void;
  setDraftMessage: (message: { to: string; subject: string; body: string } | null) => void;
  clearDraftMessage: () => void;
  resetState: () => void;
  // Data getters
  getReservationById: (id: string) => Reservation | undefined;
  getRoomByNumber: (number: number) => Room | undefined;
  getBillingForReservation: (reservationId: string) => BillingItem[];
  getTodaysArrivals: () => Reservation[];
  getTodaysDepartures: () => Reservation[];
  getAvailableRooms: (type?: RoomType, features?: string[]) => Room[];
}

const HotelContext = createContext<HotelContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

export function HotelProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(hotelReducer, initialState);

  const navigateTo = useCallback((view: ViewType) => {
    dispatch({ type: "SET_VIEW", view });
  }, []);

  const selectReservation = useCallback((reservationId: string | null) => {
    dispatch({ type: "SELECT_RESERVATION", reservationId });
  }, []);

  const selectRoom = useCallback((roomNumber: number | null) => {
    dispatch({ type: "SELECT_ROOM", roomNumber });
  }, []);

  const selectGuest = useCallback((guestId: string | null) => {
    dispatch({ type: "SELECT_GUEST", guestId });
  }, []);

  const setRoomFilter = useCallback((filter: HotelState["roomFilter"]) => {
    dispatch({ type: "SET_ROOM_FILTER", filter });
  }, []);

  const setReservationFilter = useCallback((filter: HotelState["reservationFilter"]) => {
    dispatch({ type: "SET_RESERVATION_FILTER", filter });
  }, []);

  const stageRoomAssignment = useCallback(
    (reservationId: string, roomNumber: number, previousRoom?: number) => {
      dispatch({
        type: "STAGE_ROOM_ASSIGNMENT",
        assignment: { reservationId, newRoom: roomNumber, previousRoom },
      });
    },
    []
  );

  const stageBillingChange = useCallback((change: StagedBillingChange) => {
    dispatch({ type: "STAGE_BILLING_CHANGE", change });
  }, []);

  const stageRoomStatusChange = useCallback(
    (roomNumber: number, newStatus: RoomStatus, previousStatus: RoomStatus, reason?: string) => {
      dispatch({
        type: "STAGE_ROOM_STATUS_CHANGE",
        change: { roomNumber, newStatus, previousStatus, reason },
      });
    },
    []
  );

  const stageRateChange = useCallback(
    (roomType: RoomType, date: string, newRate: number, previousRate: number) => {
      dispatch({
        type: "STAGE_RATE_CHANGE",
        change: { roomType, date, newRate, previousRate },
      });
    },
    []
  );

  const highlightRooms = useCallback((roomNumbers: number[]) => {
    dispatch({ type: "HIGHLIGHT_ROOMS", roomNumbers });
  }, []);

  const highlightReservations = useCallback((reservationIds: string[]) => {
    dispatch({ type: "HIGHLIGHT_RESERVATIONS", reservationIds });
  }, []);

  const clearHighlights = useCallback(() => {
    dispatch({ type: "CLEAR_HIGHLIGHTS" });
  }, []);

  const startCheckIn = useCallback((reservationId: string) => {
    dispatch({ type: "START_CHECK_IN", reservationId });
  }, []);

  const completeCheckIn = useCallback(() => {
    dispatch({ type: "COMPLETE_CHECK_IN" });
  }, []);

  const cancelCheckIn = useCallback(() => {
    dispatch({ type: "CANCEL_CHECK_IN" });
  }, []);

  const commitRoomAssignment = useCallback(() => {
    dispatch({ type: "COMMIT_ROOM_ASSIGNMENT" });
  }, []);

  const commitBillingChanges = useCallback(() => {
    dispatch({ type: "COMMIT_BILLING_CHANGES" });
  }, []);

  const commitRoomStatusChange = useCallback(() => {
    dispatch({ type: "COMMIT_ROOM_STATUS_CHANGE" });
  }, []);

  const commitRateChange = useCallback(() => {
    dispatch({ type: "COMMIT_RATE_CHANGE" });
  }, []);

  const stageHousekeepingChange = useCallback(
    (roomNumber: number, changes: Omit<StagedHousekeepingChange, "roomNumber">) => {
      dispatch({
        type: "STAGE_HOUSEKEEPING_CHANGE",
        change: { roomNumber, ...changes },
      });
    },
    []
  );

  const commitHousekeepingChange = useCallback(() => {
    dispatch({ type: "COMMIT_HOUSEKEEPING_CHANGE" });
  }, []);

  const initiateKeyGeneration = useCallback((data: KeyGenerationData) => {
    dispatch({ type: "SET_KEY_GENERATION_DATA", data });
  }, []);

  const clearKeyGenerationData = useCallback(() => {
    dispatch({ type: "CLEAR_KEY_GENERATION_DATA" });
  }, []);

  const setDraftMessage = useCallback(
    (message: { to: string; subject: string; body: string } | null) => {
      dispatch({ type: "SET_DRAFT_MESSAGE", message });
    },
    []
  );

  const clearDraftMessage = useCallback(() => {
    dispatch({ type: "CLEAR_DRAFT_MESSAGE" });
  }, []);

  const resetState = useCallback(() => {
    dispatch({ type: "RESET_STATE" });
  }, []);

  // Data getters
  const getReservationById = useCallback(
    (id: string) => state.reservations.find(r => r.id === id),
    [state.reservations]
  );

  const getRoomByNumber = useCallback(
    (number: number) => state.rooms.find(r => r.number === number),
    [state.rooms]
  );

  const getBillingForReservation = useCallback(
    (reservationId: string) => state.billingItems.filter(b => b.reservationId === reservationId),
    [state.billingItems]
  );

  const getTodaysArrivals = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    return state.reservations.filter(
      r => r.checkInDate === today && (r.status === "confirmed" || r.status === "checked_in")
    );
  }, [state.reservations]);

  const getTodaysDepartures = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    return state.reservations.filter(r => r.checkOutDate === today && r.status === "checked_in");
  }, [state.reservations]);

  const getAvailableRooms = useCallback(
    (type?: RoomType, features?: string[]) => {
      return state.rooms.filter(room => {
        if (room.status !== "available" && room.status !== "clean") return false;
        if (type && room.type !== type) return false;
        if (features && features.length > 0) {
          if (!features.every(f => room.features.includes(f))) return false;
        }
        return true;
      });
    },
    [state.rooms]
  );

  const value: HotelContextValue = {
    state,
    dispatch,
    navigateTo,
    selectReservation,
    selectRoom,
    selectGuest,
    setRoomFilter,
    setReservationFilter,
    stageRoomAssignment,
    stageBillingChange,
    stageRoomStatusChange,
    stageRateChange,
    highlightRooms,
    highlightReservations,
    clearHighlights,
    startCheckIn,
    completeCheckIn,
    cancelCheckIn,
    commitRoomAssignment,
    commitBillingChanges,
    commitRoomStatusChange,
    commitRateChange,
    stageHousekeepingChange,
    commitHousekeepingChange,
    initiateKeyGeneration,
    clearKeyGenerationData,
    setDraftMessage,
    clearDraftMessage,
    resetState,
    getReservationById,
    getRoomByNumber,
    getBillingForReservation,
    getTodaysArrivals,
    getTodaysDepartures,
    getAvailableRooms,
  };

  return <HotelContext.Provider value={value}>{children}</HotelContext.Provider>;
}

// ============================================================================
// Hook
// ============================================================================

export function useHotel() {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error("useHotel must be used within a HotelProvider");
  }
  return context;
}

// Export a singleton reference for tools to access
let hotelContextRef: HotelContextValue | null = null;

export function setHotelContextRef(context: HotelContextValue | null) {
  hotelContextRef = context;
}

export function getHotelContextRef(): HotelContextValue | null {
  return hotelContextRef;
}
