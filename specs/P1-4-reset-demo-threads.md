# P1-4: Fix Reset Demo Thread Clearing

**Priority**: P1 - Major
**Bug ID**: BUG-011
**Screenshot**: `.playwright-mcp/iter4-23-threads-not-cleared.png`

---

## Problem

"Reset Demo" button claims to clear chat history but old conversation threads remain visible in the thread dropdown.

## Impact

- Contradicts what the reset dialog promises
- Confusing for demo purposes
- Old conversations clutter the interface
- User thinks reset worked but history persists

## Current Behavior

1. User has multiple conversation threads
2. User clicks "Reset Demo"
3. Dialog says "This will reset all data and chat history"
4. User confirms
5. Current chat clears, but thread dropdown still shows old threads

## Expected Behavior

1. User clicks "Reset Demo" and confirms
2. ALL threads are deleted
3. Thread dropdown shows only "New Thread" option
4. Fresh start for demo

## Tasks

- [ ] Find Reset Demo button handler
- [ ] Identify where threads are stored (local storage, Tambo state, etc.)
- [ ] Add thread clearing logic to reset handler
- [ ] Clear both:
  - Current conversation messages
  - Thread list/history
- [ ] Verify thread dropdown is empty after reset
- [ ] Test creating new thread after reset works

## Acceptance Criteria

- [ ] Reset Demo clears ALL threads
- [ ] Thread dropdown empty after reset (except "New Thread")
- [ ] No residual thread data in storage
- [ ] Can start fresh conversation after reset
- [ ] Dialog text accurately describes what happens

## Alternative: Update Dialog Text

If threads are intentionally preserved:
- [ ] Update dialog to say "This will reset hotel data. Chat history will be preserved."
- [ ] Make it clear what IS and ISN'T reset

## Technical Notes

- Threads likely managed by Tambo hooks (`useTamboThread`)
- Check for localStorage persistence
- May need to call Tambo's thread clearing API
- Look in `src/lib/thread-hooks.ts` for custom thread management
