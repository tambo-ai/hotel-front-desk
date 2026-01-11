# P2: Minor Bug Fixes

**Priority**: P2 - Minor
**Bug IDs**: BUG-003, BUG-008, BUG-009, BUG-015, BUG-020, BUG-021

---

## Overview

Collection of minor bugs that should be fixed but aren't blocking.

---

## Bug 1: Check-in Form Date Off By One Day
**ID**: BUG-003
**Screenshot**: `.playwright-mcp/09-check-in-form-mark-peterson.png`

**Problem**: Check-in form shows dates that don't match current date (e.g., shows Jan 8 when today is Jan 9)

**Fix**:
- [ ] Check date handling in check-in component
- [ ] Ensure dates use consistent timezone
- [ ] Verify dates display matches reservation data

---

## Bug 2: Far Future Dates Accepted
**ID**: BUG-008
**Screenshot**: `.playwright-mcp/iter3-12-far-future-2030.png`

**Problem**: Can request rooms for 2030 without any validation warning

**Fix**:
- [ ] Add date validation (max 1-2 years out)
- [ ] Show warning for far future dates
- [ ] OR accept gracefully with note that rates may not be accurate

---

## Bug 3: Specific Room Requests Ignored
**ID**: BUG-009
**Screenshot**: `.playwright-mcp/iter3-08-chained-checkin-mark-peterson.png`

**Problem**: Requesting specific room (305) shows generic room list instead

**Fix**:
- [ ] Parse room number from user request
- [ ] Check if specific room is available
- [ ] If available, pre-select or highlight that room
- [ ] If unavailable, explain why and show alternatives

---

## Bug 4: Tab Focus Starts at Reset Demo
**ID**: BUG-015
**Screenshot**: `.playwright-mcp/iter7-05-tab-focus-reset-demo.png`

**Problem**: First Tab keypress focuses on floating Reset Demo button

**Fix**:
- [ ] Add `tabindex="-1"` to Reset Demo button, OR
- [ ] Move it later in DOM order, OR
- [ ] Set explicit `tabindex="1"` on main nav

---

## Bug 5: Spanish Suggestions Appear Unexpectedly
**ID**: BUG-020

**Problem**: After XSS test with Spanish characters, Spanish suggestions appear

**Fix**:
- [ ] Ensure suggestion language follows user locale, not input content
- [ ] Reset language state after special character input
- [ ] OR detect and handle gracefully

---

## Bug 6: Suggestion Text Truncated
**ID**: BUG-021

**Problem**: Suggestions like "Lis..." and "Check current room ser..." are cut off

**Fix**:
- [ ] Increase max-width on suggestion buttons
- [ ] OR add tooltip showing full text on hover
- [ ] OR truncate more gracefully with ellipsis positioned better

---

## Acceptance Criteria

- [ ] Dates in check-in form match current date
- [ ] Far future dates get validation feedback
- [ ] Specific room requests are honored when possible
- [ ] Tab order starts at main navigation
- [ ] Suggestions stay in English (or user's language)
- [ ] Suggestion text readable (not truncated awkwardly)
