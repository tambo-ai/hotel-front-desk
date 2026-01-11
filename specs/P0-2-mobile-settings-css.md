# P0-2: Fix Settings Page on Mobile

**Priority**: P0 - Critical
**Bug ID**: BUG-010
**Screenshot**: `.playwright-mcp/iter4-06-mobile-settings-page.png`

---

## Problem

Settings page content is positioned at `left: -715px` on mobile viewports, making it completely invisible and inaccessible.

## Impact

- Users cannot access settings on mobile devices
- Cannot change theme or other preferences on mobile
- Common scenario: hotel front desk staff using tablets

## Root Cause

CSS positioning issue where the content container has a hardcoded or calculated `left` value that doesn't adapt to mobile viewport.

## Tasks

- [x] Reproduce issue at 375px viewport width
- [x] Inspect Settings page CSS to find the `left: -715px` rule
- [x] Fix positioning to be responsive:
  - Remove hardcoded left position
  - Use flexbox or grid for layout
  - Ensure content is centered/visible on all viewports
- [x] Test on multiple mobile widths (320px, 375px, 414px)
- [x] Verify dark mode still works on mobile settings

## Resolution

**Root Cause**: Navigation bar had `overflow: visible` allowing wide content to push page layout off-screen.

**Fix**: Added `overflow-x-auto` to nav and `min-w-max` to inner container in `src/components/hotel/NavigationTabs.tsx`.

## Acceptance Criteria

- [x] Settings page content visible at 375px width
- [x] Theme toggle accessible and functional on mobile
- [x] All settings options reachable on mobile
- [x] No horizontal scroll required to see settings

## Technical Notes

- Settings page location: `src/app/settings/page.tsx` (likely)
- Check for any CSS using `position: absolute` or `left/right` values
- May be related to chat panel layout affecting sibling components
