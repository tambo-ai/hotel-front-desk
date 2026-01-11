# P1 Spec: Generative Component State Synchronization

## Overview

Every generative component registered with Tambo must follow two principles:

1. **AI can set initial values** - Props should accept values the AI provides, or `null`/`undefined` when there's no sensible default
2. **User state syncs to AI** - Use `useTamboComponentState` so every user interaction updates the assistant's context

This enables a true collaborative loop where the AI generates a component, the user interacts with it, and the AI understands what the user did.

---

## Current State

### Components Already Compliant

| Component | Synced State | Notes |
|-----------|--------------|-------|
| `CheckInForm` | `selectedRoom`, `checkInStatus` | ✅ Fully compliant |
| `GuestMessageComposer` | `subject`, `body`, `messageStatus` | ✅ Fully compliant with `setFromProp` |

### Components Needing Updates

| Component | Current Issue | Priority |
|-----------|--------------|----------|
| `SettingsPage` | Theme selection not synced | High |
| `RatePricingForm` | Rate changes not synced | High |
| `RoomIssueForm` | Form state not synced | High |
| `OccupancyChart` | Chart type/date range not synced | Medium |
| `RoomGrid` | Selected room, filter not synced | Medium |
| `KeyCardDialog` | Key count, print status not synced | Medium |
| `ArrivalsTable` | Row selection not synced | Low |
| `DeparturesTable` | Row selection not synced | Low |
| `HousekeepingStatus` | Filter state not synced | Low |
| `BillingItemDetail` | Discount/remove state not synced | Low |

---

## Implementation Pattern

### The Standard Pattern

```tsx
import { useTamboComponentState } from "@tambo-ai/react";

export function MyComponent({
  initialValue,  // AI provides this
}: MyComponentProps) {
  // Pattern: (key, defaultValue, setFromProp)
  const [value, setValue] = useTamboComponentState<string | null>(
    "value",           // Unique key for this state
    null,              // Default if AI provides nothing
    initialValue       // Stream from AI prop during generation
  );

  return (
    <input
      value={value ?? ""}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

### Key Principles

1. **Key naming**: Use descriptive, unique keys like `selectedRoom`, `chartType`, `filterStatus`
2. **Default to null**: When there's no sensible default, use `null` (not a fake value)
3. **Use setFromProp**: Pass the prop as the 3rd argument to enable streaming updates during AI generation
4. **Sync meaningful state**: Only sync state the AI would find useful for follow-up actions

---

## Component-Specific Implementation Plans

### 1. SettingsPage (High Priority)

**Current**: Uses `useTheme()` from next-themes, no AI sync
**Change**: Sync theme selection back to AI

```tsx
// Add state sync for theme
const [selectedTheme, setSelectedTheme] = useTamboComponentState<"light" | "dark" | "system">(
  "selectedTheme",
  "system",
  initialTheme
);

// Update both next-themes and AI context
const handleThemeChange = (newTheme: Theme) => {
  setTheme(newTheme);      // next-themes
  setSelectedTheme(newTheme);  // AI sync
};
```

**Schema update**:
```tsx
export const SettingsPagePropsSchema = z.object({
  initialTheme: z
    .enum(["light", "dark", "system"])
    .nullable()
    .optional()
    .describe("Initial theme selection (null = use current)"),
});
```

---

### 2. RatePricingForm (High Priority)

**Current**: Uses hotel store for staged changes, AI has no visibility
**Change**: Sync staged rate changes to AI context

```tsx
const [stagedRoomType, setStagedRoomType] = useTamboComponentState<RoomType | null>(
  "stagedRoomType",
  null
);
const [stagedDate, setStagedDate] = useTamboComponentState<string | null>(
  "stagedDate",
  null
);
const [stagedRate, setStagedRate] = useTamboComponentState<number | null>(
  "stagedRate",
  null
);
const [rateChangeApplied, setRateChangeApplied] = useTamboComponentState<boolean>(
  "rateChangeApplied",
  false
);

const handleRateChange = (roomType: RoomType, date: string, newRate: number) => {
  stageRateChange(roomType, date, newRate, previousRate);
  setStagedRoomType(roomType);
  setStagedDate(date);
  setStagedRate(newRate);
};

const handleApplyRate = () => {
  commitRateChange();
  setRateChangeApplied(true);
};
```

---

### 3. RoomIssueForm (High Priority)

**Current**: Uses local `useState`, AI loses visibility when user edits
**Change**: Replace useState with useTamboComponentState

```tsx
const [category, setCategory] = useTamboComponentState<RoomIssueCategory | null>(
  "category",
  null,
  initialCategory
);
const [priority, setPriority] = useTamboComponentState<RoomIssuePriority>(
  "priority",
  "medium",
  initialPriority
);
const [description, setDescription] = useTamboComponentState<string>(
  "description",
  "",
  initialDescription
);
const [submissionStatus, setSubmissionStatus] = useTamboComponentState<"editing" | "submitting" | "submitted">(
  "submissionStatus",
  "editing"
);
const [ticketId, setTicketId] = useTamboComponentState<string | null>(
  "ticketId",
  null
);
```

---

### 4. OccupancyChart (Medium Priority)

**Current**: No user-editable state synced
**Change**: Sync interactive selections

```tsx
const [activeChartType, setActiveChartType] = useTamboComponentState<"line" | "bar" | "composed">(
  "activeChartType",
  "line",
  chartType
);
const [activeDateRange, setActiveDateRange] = useTamboComponentState<"week" | "month" | "custom">(
  "activeDateRange",
  "week",
  dateRange
);
const [selectedDataPoint, setSelectedDataPoint] = useTamboComponentState<{
  date: string;
  occupancyRate: number;
  revenue: number;
} | null>(
  "selectedDataPoint",
  null
);
```

---

### 5. RoomGrid (Medium Priority)

**Current**: Uses hotel store, no AI visibility on selections
**Change**: Sync room selection and filter state

```tsx
const [selectedRoom, setSelectedRoom] = useTamboComponentState<number | null>(
  "selectedRoom",
  null
);
const [activeFilter, setActiveFilter] = useTamboComponentState<{
  type?: RoomType;
  status?: RoomStatus;
} | null>(
  "activeFilter",
  null,
  filter
);

const handleRoomClick = (roomNumber: number) => {
  setSelectedRoom(roomNumber);
  // ... existing logic
};
```

---

### 6. KeyCardDialog (Medium Priority)

**Current**: No state sync
**Change**: Sync key count changes and print status

```tsx
const [activeKeyCount, setActiveKeyCount] = useTamboComponentState<number>(
  "keyCount",
  2,
  keyCount
);
const [printStatus, setPrintStatus] = useTamboComponentState<"pending" | "printing" | "printed">(
  "printStatus",
  "pending"
);
```

---

### 7. ArrivalsTable / DeparturesTable (Low Priority)

**Change**: Sync row selection for context

```tsx
const [selectedArrivalId, setSelectedArrivalId] = useTamboComponentState<string | null>(
  "selectedArrivalId",
  null
);

// In row click handler:
const handleRowClick = (reservationId: string) => {
  setSelectedArrivalId(reservationId);
  selectReservation(reservationId);
};
```

---

### 8. HousekeepingStatus (Low Priority)

**Change**: Sync filter selections

```tsx
const [activeStatusFilter, setActiveStatusFilter] = useTamboComponentState<HousekeepingStatus | null>(
  "activeStatusFilter",
  null,
  filterStatus
);
const [activePriorityFilter, setActivePriorityFilter] = useTamboComponentState<Priority | null>(
  "activePriorityFilter",
  null,
  filterPriority
);
```

---

## Schema Updates

For each component, ensure the props schema:

1. **Accepts nullable/optional values** for AI-set props
2. **Documents the sync behavior** in descriptions

Example:
```tsx
export const RoomIssueFormPropsSchema = z.object({
  roomNumber: z.number().describe("Room number with the issue"),
  category: RoomIssueCategoryEnum
    .nullable()
    .optional()
    .describe("Pre-selected category (syncs back as user changes)"),
  priority: RoomIssuePriorityEnum
    .nullable()
    .optional()
    .describe("Pre-selected priority (syncs back as user changes)"),
  description: z.string()
    .nullable()
    .optional()
    .describe("Pre-filled description (syncs back as user edits)"),
});
```

---

## Testing Checklist

For each updated component:

- [ ] AI can render component with all props set
- [ ] AI can render component with null/missing props (uses defaults)
- [ ] User interaction updates state visible to AI
- [ ] AI follow-up message shows awareness of user changes
- [ ] Streaming updates work during AI generation
- [ ] State persists when thread is reloaded

---

## Implementation Order

1. **Phase 1 (High Priority)**: SettingsPage, RatePricingForm, RoomIssueForm
2. **Phase 2 (Medium Priority)**: OccupancyChart, RoomGrid, KeyCardDialog
3. **Phase 3 (Low Priority)**: ArrivalsTable, DeparturesTable, HousekeepingStatus, BillingItemDetail

---

## Notes

- Read-only components (`ReservationDetail`, `GuestProfile`, `BillingStatement`) may not need state sync unless they gain interactive elements
- Charts should sync selected data points if they're clickable
- Always use the 3-argument form `useTamboComponentState(key, default, propValue)` when the AI should be able to pre-populate values
