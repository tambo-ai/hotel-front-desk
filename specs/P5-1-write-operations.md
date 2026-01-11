# P5-1: Implement Write Operations (Core Features)

**Priority**: P5 - New Features
**Issues**: MISSING-001, MISSING-002, MISSING-003, MISSING-004

---

## Overview

The demo is currently read-only. These are the core write operations needed for a functional hotel management demo.

**Note**: For a demo app, these can update local state without real backend. The goal is to show the workflow, not persist data.

---

## 1. Create Reservation

**Issue**: MISSING-001

**Current**: AI pretends to create reservation but nothing saves

**Needed**:
- Tool: `createReservation`
- Input: guest name, dates, room type, contact info
- Action: Add to local reservations state
- Output: Confirmation with reservation number

**Implementation**:
```typescript
// src/services/reservations.ts
export function createReservation(data: ReservationInput): Reservation {
  const reservation = {
    id: generateConfirmationNumber(),
    ...data,
    status: 'confirmed',
    createdAt: new Date()
  };
  // Add to local state
  reservations.push(reservation);
  return reservation;
}
```

**Tasks**:
- [ ] Create reservation service function
- [ ] Register as Tambo tool
- [ ] Update state management to include new reservations
- [ ] Show confirmation component after creation

---

## 2. Process Checkout

**Issue**: MISSING-004

**Current**: Checkout button does nothing, AI claims success falsely

**Needed**:
- Tool: `processCheckout`
- Input: reservation ID or guest name
- Action: Update reservation status, mark room for cleaning
- Output: Checkout confirmation with bill summary

**Implementation**:
```typescript
export function processCheckout(reservationId: string): CheckoutResult {
  const reservation = findReservation(reservationId);
  reservation.status = 'checked_out';
  reservation.checkoutTime = new Date();

  // Update room status
  updateRoomStatus(reservation.roomId, 'needs_cleaning');

  return {
    success: true,
    reservation,
    finalBill: calculateBill(reservation)
  };
}
```

**Tasks**:
- [ ] Create checkout service function
- [ ] Wire up "Check Out" buttons to this function
- [ ] Create checkout confirmation component
- [ ] Update room status after checkout
- [ ] Show final bill summary

---

## 3. Update Reservation

**Issue**: MISSING-002

**Current**: Cannot extend stays, change dates, or modify reservations

**Needed**:
- Tool: `updateReservation`
- Input: reservation ID, changes (dates, room type, notes)
- Action: Update reservation in state
- Output: Updated reservation details

**Use Cases**:
- Extend stay (change checkout date)
- Early checkout
- Room type upgrade/downgrade
- Add/remove guests
- Update contact info
- Add special requests

**Tasks**:
- [ ] Create update service function
- [ ] Support partial updates (only change what's specified)
- [ ] Validate date changes (availability)
- [ ] Show change confirmation with price difference

---

## 4. Room Change

**Issue**: MISSING-003

**Current**: Cannot reassign guests to different rooms

**Needed**:
- Tool: `changeRoom`
- Input: reservation ID, new room number
- Action: Update reservation, mark old room for cleaning
- Output: Confirmation with new room details

**Implementation**:
```typescript
export function changeRoom(reservationId: string, newRoomId: string): RoomChangeResult {
  const reservation = findReservation(reservationId);
  const oldRoom = reservation.roomId;

  // Verify new room available
  if (!isRoomAvailable(newRoomId)) {
    throw new Error('Room not available');
  }

  // Update reservation
  reservation.roomId = newRoomId;

  // Update room statuses
  updateRoomStatus(oldRoom, 'needs_cleaning');
  updateRoomStatus(newRoomId, 'occupied');

  return { success: true, oldRoom, newRoom: newRoomId };
}
```

**Tasks**:
- [ ] Create room change service function
- [ ] Validate room availability before change
- [ ] Update both room statuses
- [ ] Log room change in reservation history
- [ ] Show confirmation with new key card prompt

---

## State Management Considerations

For demo purposes, state can be:
1. **React Context** - Simple, resets on page reload
2. **Zustand/Jotai** - More robust, can persist to localStorage
3. **localStorage directly** - Survives page reloads

**Recommended**: Zustand with localStorage persistence
- Data survives page refreshes
- Reset Demo clears localStorage
- Simple to implement

---

## Acceptance Criteria

- [ ] Can create new reservations that appear in system
- [ ] Can check out guests (room becomes available)
- [ ] Can extend/shorten stays
- [ ] Can move guests between rooms
- [ ] All changes reflect immediately in UI
- [ ] Reset Demo clears all changes

## Technical Notes

- Tools registered in `src/lib/tambo.ts`
- Services in `src/services/`
- State management TBD (context vs Zustand)
- All operations should be optimistic (update UI immediately)
