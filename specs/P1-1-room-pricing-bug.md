# P1-1: Fix $0 Room Prices in Chat

**Priority**: P1 - Major
**Bug IDs**: BUG-001, BUG-019
**Screenshots**: `.playwright-mcp/07-room-availability-chat-response.png`, `.playwright-mcp/iter5-17-room-availability-response.png`

---

## Problem

When the AI shows room availability in chat, all rooms display "$0/night" instead of actual prices.

## Impact

- Staff cannot quote room rates to guests
- Pricing information useless in chat
- Undermines trust in data accuracy

## Current Behavior

User: "What rooms are available?"
AI shows room cards:
- King Room - $0/night
- Queen Room - $0/night
- Suite - $0/night

## Expected Behavior

- King Room - $189/night
- Queen Room - $149/night
- Suite - $349/night

## Root Cause Hypothesis

1. Price data not being passed to room availability component
2. Price field exists but is undefined/null, defaulting to 0
3. Component formatting price incorrectly

## Tasks

- [ ] Find room availability component in `src/components/tambo/`
- [ ] Check props schema - does it include price?
- [ ] Trace data flow from tool response to component render
- [ ] Find where prices are defined (likely in mock data or service)
- [ ] Ensure prices are passed correctly to component
- [ ] Verify prices display correctly for all room types
- [ ] Test Sunday rates specifically (BUG-019 mentioned Sunday $0)

## Acceptance Criteria

- [ ] Room prices display actual rates (not $0)
- [ ] Prices consistent with Rates page
- [ ] All room types show correct pricing
- [ ] Weekend/weekday rate variations work if applicable

## Technical Notes

- Room data likely in `src/services/` or mock data files
- Component registration in `src/lib/tambo.ts`
- Check if propsSchema includes `price` or `rate` field
- May need to update tool that fetches room availability
