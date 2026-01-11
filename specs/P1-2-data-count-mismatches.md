# P1-2: Fix Data Count Mismatches

**Priority**: P1 - Major
**Bug IDs**: BUG-002, BUG-018
**Screenshots**: `.playwright-mcp/05-todays-checkins-response.png`, `.playwright-mcp/iter8-13-housekeeping-page.png`

---

## Problem

Data counts shown in different places don't match:
1. Dashboard says "4 Today's Arrivals" but arrivals table shows 5 guests
2. Housekeeping status shows different room counts in different views

## Impact

- Operational confusion
- Staff can't trust the numbers
- May miss check-ins or housekeeping tasks

## Issues to Fix

### Issue 1: Arrivals Count
- **Dashboard stat card**: Shows "4"
- **Arrivals table**: Lists 5 guests
- One of these is wrong

### Issue 2: Housekeeping Fragmentation
- Dashboard housekeeping widget shows X rooms
- Housekeeping page shows different breakdown
- Chat responses may show yet another count

## Root Cause Hypothesis

1. Stat cards calculated separately from table data
2. Different data sources or queries
3. Filtering logic differs (e.g., one excludes already checked-in)
4. Caching or stale data

## Tasks

### For Arrivals Count
- [ ] Find dashboard stat card component
- [ ] Find arrivals table data source
- [ ] Ensure both use same data/query
- [ ] Verify count logic matches displayed rows
- [ ] Test after check-ins to ensure count updates

### For Housekeeping
- [ ] Map all places housekeeping data appears
- [ ] Identify single source of truth
- [ ] Ensure all views query same source
- [ ] Verify categories (dirty, in progress, ready) are consistent

## Acceptance Criteria

- [ ] Dashboard "Today's Arrivals" count matches table row count
- [ ] Housekeeping counts consistent across all views
- [ ] Counts update in real-time when status changes
- [ ] No conflicting numbers visible to user

## Technical Notes

- Data likely in React context or Zustand/similar store
- Check for multiple `useState` or data fetches that should share
- Consider single `useHotelData` hook for consistency
- May need to audit all places that display counts
