# P0-4b: Add Notification System for Unsupported Features

**Priority**: P0 - Critical
**Related**: P0-3b, P0-4a

---

## Problem

Multiple UI elements (buttons, forms, actions) exist that don't actually work. Users get no feedback when they try to use them.

## Impact

- Frustrating user experience
- Users don't know if action failed or is processing
- Repeated clicks, confusion, lost trust

## Scope

Features that need "unsupported" notifications:
1. Check Out buttons (departures table)
2. Update reservation actions
3. Room change requests
4. Payment/billing modifications
5. Any button/action without backend implementation

## Tasks

### Create Notification System
- [x] Build or use existing toast/notification component
- [x] Support multiple notification types:
  - `info` - Neutral information
  - `warning` - Demo limitation
  - `success` - Action completed (for working features)
  - `error` - Something went wrong
- [x] Auto-dismiss after ~5 seconds
- [x] Allow manual dismiss
- [x] Support action buttons in notification (e.g., "Learn More")

## Resolution (Notification System)

Created notification system in `src/components/notifications/`:
- `notification-context.tsx` - Provider with `useNotification()` hook
- `notification-toast.tsx` - Toast component with icons and dismiss
- `notification-container.tsx` - Fixed position container
- `index.ts` - Exports

Integrated in `src/app/layout.tsx` with `NotificationProvider` and `NotificationContainer`.

### Implement for Unsupported Features
- [x] Checkout button → shows demo limitation toast
- [x] Each toast includes:
  - Clear message about what's not supported
  - Why (this is a demo)
  - What to do instead
  - Link to learn more

### Example Notifications

**Checkout Button:**
```
ℹ️ Demo Limitation
Checkout processing isn't included in this demo.
In production, this would complete the checkout and free the room.
[Learn how to implement →]
```

**Room Change:**
```
ℹ️ Demo Limitation
Room changes require backend integration.
You can view room details and availability in this demo.
[View Tambo docs →]
```

## Acceptance Criteria

- [x] All non-functional buttons show notification when clicked
- [x] Notifications are clear and helpful (not just "error")
- [x] Notifications don't block UI or stack infinitely (max 5, auto-dismiss)
- [x] Links in notifications work
- [x] Notifications match app theme (light/dark mode)

## Technical Notes

- Consider using `react-hot-toast` or `sonner` for toasts
- Or build simple notification context/provider
- Ensure accessibility (announcements for screen readers)
- Position: top-right or bottom-right typically works well
