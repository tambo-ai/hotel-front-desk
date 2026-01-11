# P1-3: Fix All Keyboard Shortcuts

**Priority**: P1 - Major
**Bug IDs**: BUG-012, BUG-013, BUG-014, BUG-016
**Screenshots**: `.playwright-mcp/iter7-02-after-k-press.png`, `.playwright-mcp/iter7-04-escape-closes-chat.png`, `.playwright-mcp/iter7-07-alt-shift-n-test.png`, `.playwright-mcp/iter7-06-thread-menu-keyboard-shortcut.png`

---

## Problems

Multiple keyboard shortcut issues:

1. **"K" shortcut misleading** - Button shows "Search... K" but requires Cmd+K
2. **Escape doesn't close chat** - Standard dismissal pattern not working
3. **Alt+Shift+N broken** - Displayed shortcut for "New Thread" doesn't work
4. **Unicode symbols confusing** - Shortcuts show as ⇧⌥N instead of readable text

## Impact

- Users expect keyboard shortcuts to work as shown
- No keyboard-only way to close chat panel
- Accessibility concerns
- Frustrating for power users

## Tasks

### Fix 1: K Shortcut Display
- [ ] Change button text from "K" to "⌘K" (or platform-appropriate)
- [ ] OR implement K alone as shortcut (if feasible)
- [ ] Ensure Windows shows "Ctrl+K"

### Fix 2: Escape to Close Chat
- [ ] Add `keydown` event listener for Escape
- [ ] Close chat panel when Escape pressed
- [ ] Ensure it works regardless of focus location
- [ ] Don't interfere with other Escape uses (close modals first)

### Fix 3: Alt+Shift+N for New Thread
- [ ] Implement the keyboard shortcut handler
- [ ] Trigger same action as clicking "New Thread"
- [ ] Verify shortcut works globally (not just when menu open)
- [ ] Consider alternative shortcut if conflicts exist

### Fix 4: Readable Shortcut Labels
- [ ] Replace Unicode symbols with readable text
- [ ] "⇧⌥N" → "Alt+Shift+N" or "Option+Shift+N" on Mac
- [ ] OR add tooltip that explains the symbols
- [ ] Ensure consistency across all shortcut displays

## Acceptance Criteria

- [ ] Button shows correct shortcut (⌘K or Ctrl+K)
- [ ] Escape key closes chat panel
- [ ] Alt+Shift+N creates new thread
- [ ] All displayed shortcuts actually work
- [ ] Shortcuts are readable/understandable

## Technical Notes

- Likely need global event listener in layout or app component
- Check for existing keyboard handling code to extend
- Consider using a keyboard shortcut library (e.g., `react-hotkeys-hook`)
- Platform detection needed for Cmd vs Ctrl
