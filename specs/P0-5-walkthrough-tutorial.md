# P0-5: Interactive Walkthrough Tutorial

**Priority**: P0 - Critical
**Type**: Feature

---

## Overview

Create an interactive walkthrough that guides users through a realistic hotel workflow: checking in a guest, upgrading their room, and sending a thank-you email. This helps demo visitors understand what Tambo can do.

## Walkthrough Flow

### Step 1: Initial Prompt
**Card (top-right):**
- Title: "Mark wants to check in"
- Context: "Mark is a Gold member who's been waiting for his room to be ready"
- Button: [Check him in]

**On click:**
1. Open chat panel (if collapsed)
2. Pre-fill input: "check in Mark"
3. Show tooltip on Send button: "Click to send"

---

### Step 2: Complete Check-in with Upgrade
**After AI responds with CheckInForm:**

**Tooltip 2a** → Points to Suite upgrade option:
- "Upgrade Mark to a Suite since he had to wait"

**On upgrade click → Tooltip 2b** → Points to "Complete Check-in" button:
- "Click to complete check-in"

---

### Step 3: Send Thank You Email
**After check-in completes:**

**Tooltip 3** → Points to chat input:
- "Send Mark a thank you email"
- Pre-fill input: "send email thanking Mark for his patience"

**On send → GuestMessageComposer appears:**
- Walkthrough complete after email sent

---

## Tasks

- [ ] Create `WalkthroughProvider` context with state machine
- [ ] Create `WalkthroughCard` component (top-right floating card)
- [ ] Create `WalkthroughTooltip` component (points to elements)
- [ ] Update mock data: rename Steven Walker → Mark Walker
- [ ] Add special request to Mark: "Had to wait for room to be ready"
- [ ] Integrate with `page.tsx` - auto-start on first visit
- [ ] Add "Start Tour" restart button
- [ ] Persist completion state to localStorage

## UI Components Needed

### 1. `WalkthroughProvider` (Context)
- Manages walkthrough state: `{ isActive, currentStep, hasCompleted }`
- Persists `hasCompleted` to localStorage
- Provides `startWalkthrough()`, `nextStep()`, `dismiss()` actions

### 2. `WalkthroughCard` Component
- Fixed position top-right
- Shows title, description, action button
- X button to dismiss
- Animated entrance/exit

### 3. `WalkthroughTooltip` Component
- Points to target elements (chat input, buttons)
- Arrow indicator pointing to target
- Auto-positions based on target location

## State Machine

```
IDLE → STEP_1_PROMPT → STEP_1_CHAT_OPEN → STEP_2_UPGRADE → STEP_2_CHECKIN → STEP_3_EMAIL → COMPLETE
```

**Transitions:**
- `STEP_1_PROMPT` → User clicks "Check him in"
- `STEP_1_CHAT_OPEN` → User clicks Send (message sent)
- `STEP_2_UPGRADE` → User clicks upgrade button
- `STEP_2_CHECKIN` → User clicks Complete Check-in
- `STEP_3_EMAIL` → User clicks Send (email message sent)
- `COMPLETE` → Show completion message, dismiss

## Files to Create
- `src/components/walkthrough/WalkthroughProvider.tsx`
- `src/components/walkthrough/WalkthroughCard.tsx`
- `src/components/walkthrough/WalkthroughTooltip.tsx`
- `src/components/walkthrough/index.ts`

## Files to Modify
- `src/app/page.tsx` - Wrap with WalkthroughProvider, add start button
- `src/components/tambo/message-input.tsx` - Accept tooltip prop/ref for targeting
- `src/components/hotel/CheckInForm.tsx` - Emit events for upgrade/checkin clicks
- `src/data/mock-data.ts` - Rename Steven Walker → Mark Walker

## Mock Data Changes

Rename Steven Walker (guest-16) → Mark Walker:
- Gold tier, arriving TODAY at 4pm
- Reservation res-12, Room 315 (King)
- Preferences: high_floor, city_view
- Add special request: "Had to wait for room to be ready"

## Acceptance Criteria

- [ ] Fresh visit auto-starts walkthrough
- [ ] Complete all 3 steps successfully
- [ ] Walkthrough doesn't restart on refresh after completion
- [ ] "Start Tour" button works to restart
- [ ] X button dismisses walkthrough
- [ ] Tooltips point to correct elements
- [ ] Chat input pre-fills correctly at each step
