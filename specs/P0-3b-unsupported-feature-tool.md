# P0-3b: Add Tool for Unsupported Features

**Priority**: P0 - Critical
**Bug ID**: BUG-005, BUG-006 (partial)
**Screenshots**: `.playwright-mcp/iter2-06-checkout-completed.png`, `.playwright-mcp/iter2-10-reservation-summary.png`

---

## Problem

AI falsely claims to complete actions (checkout, create reservation, extend stay) when no backend tool exists. This is worse than an error - users believe actions succeeded when nothing happened.

## Impact

- **Data integrity nightmare**: Staff thinks checkout done, guest still shows as checked in
- **Lost reservations**: AI "confirms" booking that was never saved
- **Trust erosion**: Users lose confidence in the system

## Current Behavior

1. User: "Check out Emily Williams"
2. AI: "I've processed Emily Williams' checkout. Her room 206 is now available."
3. Reality: Nothing happened. Emily still checked in, room still occupied.

## Desired Behavior

1. User: "Check out Emily Williams"
2. AI: "I can help you view Emily's checkout details, but **this demo doesn't support checkout processing**. In a production system, you would click the Check Out button or use your PMS. [Learn more about building this with Tambo →]"
3. Shows helpful information without false claims

## Tasks

- [x] Create a new tool `handleUnsupportedFeature` in `src/lib/tambo.ts`
- [x] Tool should:
  - Accept feature name (checkout, create_reservation, extend_stay, etc.)
  - Return a friendly message explaining this is a demo limitation
  - Suggest what the user CAN do instead
  - Link to Tambo documentation for implementing the feature
- [x] Update AI system prompt to use this tool for unsupported actions
- [x] List of unsupported features to handle:
  - [x] Checkout processing
  - [x] Create new reservation
  - [x] Extend/modify reservation
  - [x] Room changes
  - [x] Payment processing
  - [x] Adding charges to bill

## Resolution

Created `handleUnsupportedFeature` tool with:
- Schemas in `src/lib/hotel-types.ts` (UnsupportedFeatureEnum, HandleUnsupportedFeatureArgsSchema, HandleUnsupportedFeatureResultSchema)
- Implementation in `src/services/unsupported-features.ts` with feature-specific canDo lists
- Registration in `src/lib/tambo.ts`

## Acceptance Criteria

- [x] AI never claims to complete an action it cannot perform
- [x] Unsupported actions get clear, helpful "this is a demo" message
- [x] User understands what they CAN do vs what requires production implementation
- [x] Links provided for learning more

## Example Response

```
I can show you Emily Williams' checkout details:
- Room: 206
- Balance: $477.00
- Check-in: 1/5/2026

**Note**: This demo showcases Tambo's AI capabilities but doesn't include
checkout processing. In production, you'd integrate with your PMS to complete
this action.

→ [View Tambo documentation](https://github.com/tambo-ai/tambo)
→ [See this demo's source code](https://github.com/tambo-ai/hotel-front-desk)
```

## Technical Notes

- Tool registration in `src/lib/tambo.ts`
- Consider using Zod schema for input validation
- May need to update system prompt configuration
