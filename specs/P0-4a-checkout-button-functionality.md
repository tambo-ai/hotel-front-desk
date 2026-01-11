# P0-4a: Fix or Remove Non-Functional Checkout Button

**Priority**: P0 - Critical
**Bug ID**: BUG-004
**Screenshot**: `.playwright-mcp/iter2-03-checkout-click-result.png`

---

## Problem

"Check Out" buttons in the Today's Departures table do absolutely nothing when clicked. No action, no feedback, no error.

## Impact

- Core hotel operation (checkout) appears broken
- Users click repeatedly thinking they missed
- Creates impression of buggy, unreliable software
- Worse than no button at all

## Current Behavior

1. User sees departures table with "Check Out" buttons
2. User clicks "Check Out" for a guest
3. Nothing happens - no visual feedback, no action, no error
4. Guest still shows as checked in

## Options

### Option A: Implement Checkout (Recommended for full demo)
- Add checkout handler that updates local state
- Show success message
- Update room status to "Available" or "Needs Cleaning"
- Move guest from "Departures" to completed

### Option B: Show Demo Limitation (Simpler)
- Keep button but show toast/modal explaining it's a demo
- Link to how to implement in production
- Button has visual feedback even if action doesn't complete

### Option C: Remove/Disable Button (Last resort)
- Replace active button with disabled state
- Or remove button entirely and show "View Details" instead
- Least confusing but reduces demo functionality

## Tasks

### If Option A (Implement):
- [ ] Create checkout handler function
- [ ] Update local hotel data state on checkout
- [ ] Show success toast/notification
- [ ] Update room status (trigger housekeeping)
- [ ] Refresh departures list

### If Option B (Demo notification): ✓ IMPLEMENTED
- [x] Add click handler to button
- [x] Show toast: "Checkout is a demo placeholder. [Learn how to implement →]"
- [x] Include link to Tambo docs/repo
- [x] Button shows clicked state briefly

## Resolution

Updated `src/components/hotel/DeparturesTable.tsx`:
- Added `useNotification` import
- Added onClick handler to checkout button with `e.stopPropagation()`
- Shows warning notification with "Demo Limitation" title and "Learn More" action button

### If Option C (Disable):
- [ ] Add `disabled` prop to button
- [ ] Change styling to indicate non-functional
- [ ] Add tooltip explaining why disabled

## Acceptance Criteria

- [x] Clicking Check Out button provides immediate feedback
- [x] User understands what happened (or didn't)
- [x] No "dead" clicks with zero response
- [x] Consistent with how other buttons behave

## Technical Notes

- Departures table likely in `src/components/`
- May be rendered by AI or static component
- Check for existing click handlers that may be broken
- Consider if this connects to P0-3b (unsupported feature tool)
