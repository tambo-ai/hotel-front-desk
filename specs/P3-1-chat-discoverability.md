# P3-1: Improve Chat Assistant Discoverability

**Priority**: P3 - UX Improvement
**UX Issue**: UX-002
**Screenshot**: `.playwright-mcp/03-chat-panel-discovered.png`

---

## Problem

The AI assistant is hidden behind a button labeled "Search... K" which:
1. Implies search functionality, not AI chat
2. Doesn't suggest powerful AI capabilities
3. New users may never discover the assistant

## Impact

- Core feature (AI assistant) underutilized
- Poor first impressions - looks like basic search
- Users miss the most powerful part of the demo

## Current State

- Button in top-right: "Search... K"
- Opens chat panel when clicked
- No indication it's an AI assistant

## Proposed Solutions

### Option A: Relabel Button (Minimal)
Change "Search... K" to:
- "Ask AI... ⌘K"
- "Assistant... ⌘K"
- "AI Help... ⌘K"

### Option B: Add Visual Indicator (Better)
- Add sparkle/AI icon to button
- Change label to "AI Assistant"
- Add subtle animation on first visit

### Option C: Prominent CTA (Best for Demo)
- Floating "Try AI Assistant" button on first visit
- Dismiss after first use
- Tooltip pointing to the button

## Tasks

- [ ] Decide on approach (A, B, or C)
- [ ] Update button label/icon
- [ ] If Option C: implement first-visit CTA
- [ ] Update keyboard shortcut display
- [ ] Test that new label fits in header layout
- [ ] Verify dark mode appearance

## Acceptance Criteria

- [ ] New users understand the button opens AI chat
- [ ] Button label mentions "AI" or "Assistant"
- [ ] Visual design fits with existing header
- [ ] Works in both light and dark mode

## Design Considerations

```
Current:  [Search... K]

Option A: [Ask AI ⌘K]

Option B: [✨ Assistant ⌘K]

Option C: [✨ AI Assistant ⌘K] + First-visit tooltip
```

## Technical Notes

- Button component likely in layout or header
- May need to update ARIA labels for accessibility
- Consider A/B testing if this is a production app
