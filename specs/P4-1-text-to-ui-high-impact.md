# P4-1: Text-to-UI Conversions (High Impact)

**Priority**: P4 - UX Improvement
**Issues**: TEXT-UI-001, TEXT-UI-002, TEXT-UI-003, TEXT-UI-004

---

## Overview

The AI often responds with text when an interactive UI component would be faster and more user-friendly. These are the highest-impact opportunities.

---

## 1. Check-in Request → Guest Picker

**Screenshot**: `.playwright-mcp/iter3-02-checkin-guest-text-response.png`

**Current**:
```
User: "I need to check in a guest"
AI: "I'd be happy to help you check in a guest. Could you please provide:
     - The guest's name
     - The reservation confirmation number
     - The room number (if already assigned)"
```

**Better**:
```
User: "I need to check in a guest"
AI: "Here are today's arrivals ready for check-in:"
    [Arrivals Table Component]
    | Guest          | Room  | ETA   | [Action]    |
    | Mark Peterson  | 215   | 14:00 | [Check In]  |
    | Amanda Robinson| Queen | 15:00 | [Check In]  |
    ...
```

**Tasks**:
- [ ] Create or reuse arrivals table component
- [ ] Trigger component when user mentions "check in" without specific guest
- [ ] Each row has clickable Check In button
- [ ] Button launches check-in form for that guest

---

## 2. Room Assignment → Interactive Room Selector

**Screenshot**: `.playwright-mcp/iter3-03-which-room-text-response.png`

**Current**:
```
User: "Which room should I assign?"
AI: "I can help you select a room. What are the guest's preferences?
     - Room type (King, Queen, Suite)?
     - Floor preference?
     - Any special requirements?"
```

**Better**:
```
User: "Which room should I assign?"
AI: "Here are available rooms:"
    [Room Grid Component]
    Floor 2: [201✓] [202✓] [203○] [204✓] [205✓]
    Floor 3: [301✓] [302✓] [303○] [304✓] [305✓]

    ✓ Available  ○ Occupied

    [Filter: Type ▾] [Filter: Floor ▾] [Filter: Features ▾]

    Click a room to select it.
```

**Tasks**:
- [ ] Create room grid component with status colors
- [ ] Add filter controls (type, floor, features)
- [ ] Clicking room selects it for assignment
- [ ] Show room details on hover/click

---

## 3. Lost and Found → Form Component

**Screenshot**: `.playwright-mcp/iter4-17-lost-found-text-response.png`

**Current**:
```
User: "Guest lost something in the lobby"
AI: "To log a lost item, please provide:
     1. Description of the item
     2. Where it was found
     3. Who found it
     4. Date and time
     Then contact housekeeping..."
```

**Better**:
```
User: "Guest lost something in the lobby"
AI: "I'll help you log this. Please fill out the details:"
    [Lost Item Form]
    Item Description: [____________]
    Location Found:   [Lobby ▾     ]
    Found By:         [____________]
    Date/Time:        [Today 3:30pm]
    Guest (if known): [____________]
    [Submit Lost Item Report]
```

**Tasks**:
- [ ] Create LostItemForm component
- [ ] Register with Tambo
- [ ] Trigger when user mentions "lost", "found", "missing item"
- [ ] Form saves to local state (demo) or logs action

---

## 4. Allergy/Dietary Query → Filtered Guest List

**Screenshot**: `.playwright-mcp/iter5-20-allergies-query-text-response.png`

**Current**:
```
User: "Show me all guests with allergies"
AI: "I don't have a direct way to filter guests by allergies.
     However, you can check individual guest profiles..."
```

**Better**:
```
User: "Show me all guests with allergies"
AI: "Here are guests with dietary notes on file:"
    [Filtered Guest List]
    | Guest         | Room | Allergies/Dietary        |
    | Sarah Chen    | 301  | Shellfish allergy        |
    | Robert Taylor | 303  | Gluten-free              |
    | Michelle Hall | Suite| Vegetarian, nut allergy  |

    [Export for Kitchen] [Print List]
```

**Tasks**:
- [ ] Add allergy/dietary data to guest records
- [ ] Create filtered guest list component
- [ ] Allow filtering by specific allergy types
- [ ] Export/print functionality for kitchen staff

---

## Acceptance Criteria

- [ ] Check-in request shows arrivals table (not text question)
- [ ] Room queries show interactive grid
- [ ] Lost item reports use form component
- [ ] Dietary queries show filtered list
- [ ] All components match existing design system
- [ ] Works in light and dark mode

## Technical Notes

- Components go in `src/components/tambo/`
- Register in `src/lib/tambo.ts` with Zod schemas
- Use existing design patterns from check-in form
- May need new tools to support filtering
