# P3-5: Thread Management Improvements

**Priority**: P3 - UX Improvement
**UX Issues**: UX-013, UX-014
**Screenshot**: `.playwright-mcp/iter4-10-mobile-thread-history-menu.png`

---

## Problems

1. **No way to delete threads** - History accumulates with no cleanup
2. **Dropdown shows "Assistant"** - Should show current thread name

---

## Impact

- Thread list gets cluttered over time
- Users can't clean up old/irrelevant conversations
- Harder to find relevant past conversations
- Generic "Assistant" label not helpful

## Current State

- Thread dropdown shows "Assistant" as header
- List of past threads with auto-generated names
- No delete option
- No way to rename threads

---

## Tasks

### Thread Deletion
- [ ] Add delete icon/button for each thread in dropdown
- [ ] Confirm before deleting (or allow undo)
- [ ] Handle deleting current thread (switch to another)
- [ ] Ensure deleted threads removed from storage

### Thread Names
- [ ] Show current thread name in dropdown header
- [ ] If no name, show first message preview or "New Conversation"
- [ ] Consider: Allow renaming threads

### UI Improvements
- [ ] Add "Clear All Threads" option (with confirmation)
- [ ] Show thread count somewhere
- [ ] Better visual distinction between current and other threads
- [ ] Date/time indicator for old threads

---

## Mockup

```
Current:
┌──────────────────────┐
│ ▾ Assistant          │
├──────────────────────┤
│ + New Thread    ⇧⌥N │
│ TechCorp Group Bo... │
│ Robert Taylor's B... │
│ Guest Check-In &...  │
└──────────────────────┘

Improved:
┌──────────────────────┐
│ ▾ TechCorp Group Booking │
├──────────────────────┤
│ + New Thread         │
├──────────────────────┤
│ TechCorp Group... 🗑  │  ← Current (highlighted)
│ Robert Taylor's...🗑  │  ← Delete icons
│ Guest Check-In... 🗑  │
├──────────────────────┤
│ Clear All Threads    │
└──────────────────────┘
```

---

## Acceptance Criteria

- [ ] Can delete individual threads
- [ ] Dropdown header shows current thread name
- [ ] Deletion has confirmation or undo
- [ ] UI updates immediately after delete
- [ ] Can still create new threads after deleting all

## Technical Notes

- Threads managed by Tambo hooks
- May need custom thread management wrapper
- Check `src/lib/thread-hooks.ts` for existing logic
- Deletion should update localStorage if used
