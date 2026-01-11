# P0-3a: Update AI to Guide Users to Check-In Button

**Priority**: P0 - Critical
**Bug ID**: BUG-005, BUG-006 (partial)
**Screenshot**: `.playwright-mcp/iter2-06-checkout-completed.png`

---

## Problem

When users ask the AI to check in a guest, the AI shows the check-in form but doesn't clearly indicate that the user needs to click the "Check In" button to complete the action. Users may think the AI will do it automatically.

## Impact

- Users confused about whether action completed
- Unclear handoff between AI assistance and user action
- May lead to incomplete check-ins

## Current Behavior

1. User asks "check in Mark Peterson"
2. AI shows check-in form with guest details
3. User waits, expecting AI to complete action
4. Nothing happens because user didn't click button

## Desired Behavior

1. User asks "check in Mark Peterson"
2. AI shows check-in form with guest details
3. AI message clearly states: "I've prepared the check-in form. **Click the Check In button below to complete the check-in.**"
4. User clicks button, action completes

## Tasks

- [x] Locate the check-in component rendering logic
- [x] Update the AI response text when showing check-in form to include clear CTA
- [x] Add visual emphasis to the button (animation, highlight, arrow pointing)
- [ ] Consider adding instructional tooltip on first use
- [ ] Test the updated flow end-to-end

## Resolution

1. Updated CheckInForm description in `src/lib/tambo.ts` to include:
   **IMPORTANT**: After rendering this component, tell the user to click the 'Check In' button to complete the process.

2. Added visual emphasis to button in `src/components/hotel/CheckInForm.tsx`:
   - Pulse animation (`animate-pulse`) when room is selected
   - Ring highlight (`ring-2 ring-success/50 ring-offset-2`) to draw attention

## Acceptance Criteria

- [x] AI message explicitly tells user to click the button
- [x] Button is visually prominent when action is pending
- [x] User successfully completes check-in on first attempt
- [x] No confusion about what action is needed

## Technical Notes

- Check-in component: `src/components/tambo/` (look for check-in related)
- AI response templates in Tambo configuration
- May need to update component description in `src/lib/tambo.ts`
