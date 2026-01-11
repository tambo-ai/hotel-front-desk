# P3-2: Fix Suggestion Buttons & Error Feedback

**Priority**: P3 - UX Improvement
**UX Issues**: UX-006, UX-007

---

## Problem 1: Suggestions for Impossible Actions

Suggestion buttons like "Update reservation..." appear when no tool exists to perform that action. Users click, fill the prompt, then nothing happens.

## Problem 2: No Feedback on Action Failure

When actions can't complete, there's no error message. Users don't know if the action failed, is processing, or worked.

---

## Impact

- Frustrating dead-end experience
- Users waste time on actions that won't work
- Creates impression of buggy software
- No guidance on what to do next

## Current State

**Suggestions shown that don't work:**
- "Update reservation..."
- "Extend stay..."
- "Change room..."
- "Process checkout..."

**When action fails:**
- No toast/notification
- No error message
- No explanation
- User left wondering

---

## Tasks

### For Suggestion Buttons
- [ ] Audit all suggestion prompts
- [ ] Create list of supported vs unsupported actions
- [ ] Remove or modify suggestions for unsupported actions
- [ ] Alternative: Keep suggestions but they trigger P0-3b tool (explains limitation)

### For Error Feedback
- [ ] Identify all failure points in action flows
- [ ] Add error handling with user-friendly messages
- [ ] Show toast/notification on failure
- [ ] Include actionable next steps in error messages
- [ ] Log errors for debugging (console, not user-facing)

---

## Example Improvements

### Suggestion Filtering
```
// Before: Shows all suggestions
suggestions: ["Check in guest", "Update reservation", "Process checkout"]

// After: Only show supported actions
suggestions: ["Check in guest", "View guest details", "Show room availability"]
```

### Error Feedback
```
// Before: Silent failure

// After: Helpful notification
toast({
  type: "info",
  title: "Demo Limitation",
  message: "Reservation updates aren't available in this demo. You can view reservation details instead.",
  action: { label: "Learn More", href: "/docs" }
})
```

---

## Acceptance Criteria

- [ ] No suggestions for actions that can't be completed
- [ ] OR suggestions clearly indicate demo limitations
- [ ] All failed actions show feedback
- [ ] Error messages are helpful, not technical
- [ ] Users know what they CAN do next

## Technical Notes

- Suggestions likely configured in `src/lib/tambo.ts` or Tambo hooks
- May need `useTamboSuggestions` hook customization
- Error feedback integrates with P0-4b notification system
