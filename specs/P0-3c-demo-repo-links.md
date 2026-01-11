# P0-3c: Add Demo Repository Links

**Priority**: P0 - Critical
**Related**: P0-3b (Unsupported Feature Tool)

---

## Problem

Users discovering this demo app don't have easy access to:
1. The Tambo framework that powers it
2. The source code to learn from or extend

## Impact

- Missed opportunity to convert demo users to Tambo users
- Users can't learn how to implement features they need
- No clear path from "cool demo" to "I can build this"

## Desired Outcome

Clear, contextual links to:
- **Tambo Framework**: https://github.com/tambo-ai/tambo
- **This Demo's Code**: https://github.com/tambo-ai/hotel-front-desk

## Tasks

### In UI
- [ ] Add "Built with Tambo" badge/link in footer or header
- [x] Add "View Source" link somewhere accessible
- [x] Consider an "About this Demo" section in Settings

### In AI Responses
- [x] When explaining limitations, include relevant repo links (via handleUnsupportedFeature tool)
- [ ] When showing capabilities, mention Tambo enables them
- [ ] Format links as clickable markdown

### Link Placement Ideas
1. **Footer**: Small "Built with Tambo" link
2. **Settings page**: "About" section with both links ✓ IMPLEMENTED
3. **AI responses**: Contextual links when discussing features ✓ (via handleUnsupportedFeature)
4. **404/Error pages**: Links to report issues or get help

## Resolution

Added "About this Demo" section to `src/components/hotel/SettingsPage.tsx`:
- Tambo Framework link: https://github.com/tambo-ai/tambo
- View Source Code link: https://github.com/tambo-ai/hotel-front-desk
- Both links styled with ExternalLink icon and theme-aware styling

## Acceptance Criteria

- [x] Tambo repo link accessible from UI
- [x] Demo source code link accessible from UI
- [x] AI includes links when explaining unsupported features
- [x] Links open in new tab
- [x] Links are clearly labeled (not just raw URLs)

## Example Implementations

### Footer Component
```tsx
<footer className="text-sm text-muted">
  Built with <a href="https://github.com/tambo-ai/tambo" target="_blank">Tambo</a>
  {" • "}
  <a href="https://github.com/tambo-ai/hotel-front-desk" target="_blank">View Source</a>
</footer>
```

### AI Response with Links
```
This demo showcases Tambo's generative UI capabilities. To add checkout
processing to your own app:

- [Tambo Framework](https://github.com/tambo-ai/tambo) - Build AI-powered apps
- [Demo Source Code](https://github.com/tambo-ai/hotel-front-desk) - See how this was built
```

## Technical Notes

- Use `target="_blank"` with `rel="noopener noreferrer"` for security
- Consider using environment variables for URLs (easy to update)
- Ensure links work in both light and dark mode
