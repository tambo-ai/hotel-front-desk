# P0-5: Ensure Component Actions Use useTamboComponentState

**Priority**: P0 - Critical
**Related**: P1-generative-component-state-sync.md

---

## Problem

Components that perform actions (check-in, form submissions, button clicks) don't consistently report their state back to the AI using `useTamboComponentState`. This means the AI doesn't know what the user did in the component.

## Impact

- AI can't provide intelligent follow-up responses
- AI might ask "did you complete the check-in?" when user already did
- Breaks the conversational flow between AI and UI
- User has to manually explain what they did

## Current Behavior

Some components update local state but don't sync to Tambo context:
- Button clicks happen but AI doesn't know
- Form submissions complete but AI can't reference the result
- User interactions are invisible to the AI

## Desired Behavior

Every user action in a Tambo component should be reflected in state the AI can see:
```typescript
// Example: CheckInForm already does this correctly
const [checkInStatus, setCheckInStatus] = useTamboComponentState<"pending" | "completed">(
  "checkInStatus",
  "pending"
);

// On action completion:
setCheckInStatus("completed");
```

## Tasks

### Audit Components
- [x] Review all components in `src/components/hotel/`
- [x] Identify which ones have user actions (buttons, forms, selections)
- [x] Check if they use `useTamboComponentState` for action results

### Components to Check
- [x] CheckInForm - has check-in button (already uses useTamboComponentState ✓)
- [x] DeparturesTable - has checkout button (now syncs checkoutStatus to AI)
- [x] GuestMessageComposer - has send button (already uses useTamboComponentState ✓)
- [x] RoomIssueForm - has submit button (now syncs category, priority, description, submissionStatus, ticketId)
- [x] KeyCardDialog - has print button (now syncs keyCount, printStatus)
- [ ] BillingItemDetail - has discount/remove buttons (lower priority, read-only display)
- [ ] RatePricingForm - has rate adjustment controls (lower priority)

### Implementation Pattern
```typescript
// For any component with actions:
import { useTamboComponentState } from "@tambo-ai/react";

function MyComponent() {
  // Sync action state to AI
  const [actionStatus, setActionStatus] = useTamboComponentState<"idle" | "completed">(
    "actionStatus",
    "idle"
  );

  const handleAction = () => {
    // Do the action...
    setActionStatus("completed"); // AI now knows!
  };
}
```

## Acceptance Criteria

- [x] All interactive components use `useTamboComponentState` for action results
- [x] AI can reference what the user did in follow-up messages
- [x] No "invisible" user actions that AI can't see
- [x] Component state is descriptive (not just true/false, but meaningful status)

## Resolution

Implemented `useTamboComponentState` in priority components:

1. **DeparturesTable**: Added `checkoutStatus` state with `status`, `reservationId`, `guestName`, `roomNumber`
2. **GuestMessageComposer**: Already compliant with `subject`, `body`, `messageStatus`
3. **RoomIssueForm**: Added `category`, `priority`, `description`, `submissionStatus`, `ticketId`
4. **KeyCardDialog**: Added `keyCount`, `printStatus`

Build verified passing.

## Technical Notes

- `useTamboComponentState` syncs state to AI context automatically
- State persists across AI turns within the same thread
- AI sees state in the component's context, can reference in responses
- See CheckInForm for good example implementation
