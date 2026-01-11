# P3-4: Mobile UX Improvements

**Priority**: P3 - UX Improvement
**UX Issues**: UX-011, UX-012
**Screenshots**: `.playwright-mcp/iter4-02-mobile-dashboard-375px.png`, `.playwright-mcp/iter4-07-mobile-chat-panel-open.png`

---

## Problems

1. **Navigation unclear on mobile** - Horizontal scroll nav isn't obvious
2. **Chat messages cut off** - Text truncated on right edge
3. **General mobile polish** - Various responsive issues

---

## Impact

- Mobile users struggle to navigate
- Chat (key feature) hard to use on phones
- Hotel staff often use tablets/phones at front desk

## Issues to Fix

### Issue 1: Mobile Navigation
**Current**: Horizontal scrolling nav bar, no visual indicator
**Problem**: Users don't know they can scroll to see more nav items

**Solutions**:
- Add scroll shadow/fade on edges
- Add hamburger menu for mobile
- Show dots/indicator for scroll position
- Make nav items smaller to fit

### Issue 2: Chat Text Overflow
**Current**: Messages cut off on right side
**Problem**: Can't read full responses

**Solutions**:
- Ensure `overflow-wrap: break-word`
- Add proper padding/margin
- Test with long URLs and code blocks
- Chat panel should be full-width on mobile

---

## Tasks

### Navigation
- [ ] Test nav at 375px, 320px widths
- [ ] Add visual scroll indicator OR hamburger menu
- [ ] Ensure all nav items accessible
- [ ] Test touch scrolling works smoothly

### Chat Panel
- [ ] Fix text wrapping in messages
- [ ] Chat panel full-width on mobile (no side gaps)
- [ ] Input area doesn't overflow
- [ ] Buttons/forms in chat responsive
- [ ] Test with various message lengths

### General Mobile
- [ ] Test all pages at mobile widths
- [ ] Fix any overflow issues
- [ ] Ensure touch targets are 44px+
- [ ] Test orientation changes

---

## Acceptance Criteria

- [ ] All nav items accessible on mobile (scroll or menu)
- [ ] Visual indication of scrollable nav
- [ ] Chat messages fully readable (no cutoff)
- [ ] All interactive elements usable on touch
- [ ] No horizontal scroll on any page (except nav)

## Test Checklist

Test at these widths:
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone 12/13 mini)
- [ ] 390px (iPhone 12/13/14)
- [ ] 428px (iPhone 12/13/14 Pro Max)

## Technical Notes

- Check Tailwind breakpoints being used
- May need `md:` or `lg:` prefixes adjusted
- Chat panel likely needs mobile-specific CSS
- Consider using `@container` queries for chat components
