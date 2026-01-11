# P3-3: Handle Chained Requests Better

**Priority**: P3 - UX Improvement
**UX Issue**: UX-009
**Screenshots**: `.playwright-mcp/iter3-08-chained-checkin-mark-peterson.png`, `.playwright-mcp/iter3-09-vip-arrivals-rooms.png`

---

## Problem

Multi-part requests only execute the first part:
- "Check in Mark, assign room 305, add wheelchair note" → Only check-in attempted
- "Show VIP guests and prepare their rooms" → VIP list shown, prep ignored

Users expect all parts to be handled.

---

## Impact

- Users must repeat themselves
- Workflow interrupted
- Feels like AI isn't listening
- Extra back-and-forth messages

## Current Behavior

```
User: "Check in Mark Peterson, put him in room 305, and note he needs wheelchair access"

AI: [Shows check-in form for Mark Peterson]
    (Room preference ignored)
    (Accessibility note ignored)
```

## Desired Behavior

```
User: "Check in Mark Peterson, put him in room 305, and note he needs wheelchair access"

AI: "I'll help you check in Mark Peterson. Here's the check-in form with:
    - Room 305 pre-selected
    - Wheelchair accessibility noted in special requests

    Please review and click Check In to complete."

    [Check-in form with room 305 selected and note pre-filled]
```

---

## Tasks

### Option A: Execute All Parts
- [ ] Parse multi-part requests in AI prompt handling
- [ ] Track "pending actions" from the request
- [ ] After each part completes, continue to next
- [ ] Show progress: "✓ Checked in ✓ Room assigned ⏳ Adding note..."

### Option B: Acknowledge All Parts
- [ ] Pre-fill forms with all mentioned preferences
- [ ] Show summary of what will happen
- [ ] Let user confirm/edit before executing
- [ ] Clear about what's included

### Option C: Explain Limitations
- [ ] If parts can't be chained, explicitly say so
- [ ] "I've started the check-in. For room 305 and the accessibility note, I'll need separate requests."
- [ ] Guide user through remaining steps

---

## Acceptance Criteria

- [ ] Multi-part requests don't silently drop parts
- [ ] User knows what was handled vs what wasn't
- [ ] Forms pre-filled with all mentioned details
- [ ] OR clear explanation of limitations

## Technical Notes

- May require prompt engineering adjustments
- Could use structured output to parse request parts
- Consider Tambo's tool chaining capabilities
- Pre-filling forms requires passing more props to components
