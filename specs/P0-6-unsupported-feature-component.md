# P0-6: Convert Unsupported Feature Tool to Component

**Priority**: P0 - Critical
**Related**: P0-3b, P0-4b

---

## Problem

The `handleUnsupportedFeature` tool returns raw JSON that gets displayed in an ugly format:

```
tool: handleUnsupportedFeature
parameters:
{"param1": {"feature": "checkout"}}
result:
{
  "message": "This demo showcases Tambo's AI capabilities...",
  "canDo": ["View checkout details", "See balance due"...],
  ...
}
```

This breaks the polished UI experience and looks like a debug output.

## Impact

- Unprofessional appearance
- Users see raw JSON instead of formatted message
- Inconsistent with other UI components
- Links aren't clickable
- "canDo" list isn't rendered nicely

## Current Behavior

1. User asks to checkout a guest
2. AI calls `handleUnsupportedFeature` tool
3. Tool returns JSON object
4. JSON is displayed raw in chat

## Desired Behavior

1. User asks to checkout a guest
2. AI renders `UnsupportedFeatureCard` component
3. Component shows:
   - Clear message about demo limitation
   - Nicely formatted list of what user CAN do
   - Clickable links to Tambo docs and source code
   - Professional, on-brand styling

## Tasks

### Create Component
- [x] Create `src/components/hotel/UnsupportedFeatureCard.tsx`
- [x] Props schema with Zod:
  ```typescript
  export const UnsupportedFeatureCardPropsSchema = z.object({
    feature: z.enum(["checkout", "create_reservation", "extend_stay", "room_change", "payment", "add_charge"]),
  });
  ```
- [x] Component renders:
  - Warning/info icon (AlertTriangle)
  - Title: "Demo Limitation"
  - Message explaining what's not supported
  - Bulleted list of what user CAN do
  - Two link buttons: "Tambo Framework" and "View Source"

### Register Component
- [x] Add to `src/lib/tambo.ts` components array
- [x] Description tells AI when to use it

### Remove/Update Tool
- [x] Keep tool for backwards compatibility but component is preferred (AI description directs to component)

### Example Component Design
```tsx
<div className="rounded-lg border border-warning/30 bg-warning/10 p-4">
  <div className="flex items-start gap-3">
    <AlertTriangle className="h-5 w-5 text-warning" />
    <div className="space-y-2">
      <h3 className="font-medium text-foreground">Demo Limitation</h3>
      <p className="text-sm text-muted-foreground">
        This demo showcases Tambo's AI capabilities but doesn't include checkout processing.
      </p>
      <div className="text-sm text-foreground">
        <p className="font-medium mb-1">You can still:</p>
        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
          <li>View checkout details</li>
          <li>See balance due</li>
          <li>View room status</li>
        </ul>
      </div>
      <div className="flex gap-2 pt-2">
        <a href="..." className="text-xs text-primary hover:underline">
          Tambo Framework →
        </a>
        <a href="..." className="text-xs text-primary hover:underline">
          View Source →
        </a>
      </div>
    </div>
  </div>
</div>
```

## Acceptance Criteria

- [x] Unsupported feature requests render a styled component, not raw JSON
- [x] Component matches app design system (light/dark mode)
- [x] Links are clickable and open in new tab
- [x] "Can do" list is properly formatted
- [x] AI knows to render this component for unsupported actions

## Resolution

Created `UnsupportedFeatureCard` component (138 lines):
- Feature-specific messaging via `featureInfo` mapping
- Styled card with amber warning colors, AlertTriangle icon
- Links to Tambo Framework and source code (open in new tab)
- Registered in `tambo.ts` with clear AI guidance to prefer component over tool

Build verified passing.

## Technical Notes

- Component-based approach is more Tambo-native than tool responses
- AI should render component directly, not call tool then render
- Consider keeping tool for backwards compatibility but preferring component
- Feature-specific messaging should be computed in component (like current tool does)
