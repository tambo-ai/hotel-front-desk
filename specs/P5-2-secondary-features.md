# P5-2: Secondary New Features

**Priority**: P5 - New Features (Lower Priority)
**Issues**: MISSING-005, MISSING-006, MISSING-007, MISSING-008

---

## Overview

Additional features that would enhance the demo but aren't core to the check-in/checkout workflow.

---

## 1. Full Guest Database Search

**Issue**: MISSING-005

**Current**: Search only finds guests with current reservations

**Needed**: Search all guests including:
- Past guests (checked out)
- Future reservations
- Guest profiles without current bookings

**Use Cases**:
- "Is Sarah Chen a returning guest?"
- "When did John Smith last stay with us?"
- "Find all reservations for company XYZ"

**Implementation**:
```typescript
export function searchGuests(query: string): Guest[] {
  // Search by name, email, phone, company
  return allGuests.filter(guest =>
    guest.name.toLowerCase().includes(query.toLowerCase()) ||
    guest.email?.includes(query) ||
    guest.phone?.includes(query) ||
    guest.company?.toLowerCase().includes(query.toLowerCase())
  );
}
```

**Tasks**:
- [ ] Create comprehensive guest search function
- [ ] Include historical data in search
- [ ] Show guest history (past stays, lifetime value)
- [ ] Differentiate between active and past guests

---

## 2. Payment Processing (Simulated)

**Issue**: MISSING-006

**Current**: Cannot process payments or update billing

**Needed**: Simulated payment flow for demo
- Accept payment (credit card placeholder)
- Split payment between methods
- Apply credits/adjustments
- Generate receipt

**Note**: For demo, this is UI/workflow only - no real payment processing

**Tasks**:
- [ ] Create payment form component
- [ ] Support multiple payment methods (simulated)
- [ ] Show payment confirmation
- [ ] Generate receipt view
- [ ] Update bill status after payment

---

## 3. Thread Delete Functionality

**Issue**: MISSING-007

**Current**: Cannot delete individual conversation threads

**Implementation**:
See P3-5 spec for full details on thread management improvements.

**Tasks**:
- [ ] Add delete button to thread list
- [ ] Implement thread deletion
- [ ] Handle deleting current thread
- [ ] Clear from localStorage

---

## 4. Guest Attribute Filtering

**Issue**: MISSING-008

**Current**: Cannot filter guests by allergies, dietary restrictions, etc.

**Needed**: Filter guests by:
- Allergies (nut, shellfish, dairy, etc.)
- Dietary preferences (vegetarian, vegan, gluten-free)
- Accessibility needs (wheelchair, hearing impaired)
- VIP status (Gold, Platinum, etc.)
- Special requests

**Use Cases**:
- Kitchen needs list of guests with food allergies
- Housekeeping needs rooms needing accessibility setup
- Marketing wants to identify VIP guests

**Tasks**:
- [ ] Add filterable attributes to guest data
- [ ] Create filter component for guest list
- [ ] Support multiple filter combinations
- [ ] Export filtered results

---

## 5. Print Reports

**Mentioned in testing**: "Is there a way to print reports?"

**Needed**: Print-friendly versions of:
- Daily arrivals/departures
- Occupancy reports
- Revenue summaries
- Guest lists

**Implementation**:
- Add print button to reports page
- Create print-specific CSS
- Use `@media print` styles
- OR generate PDF

**Tasks**:
- [ ] Add print styles to reports
- [ ] Add print button to report pages
- [ ] Test print output for readability
- [ ] Consider PDF export option

---

## 6. Guest Messaging (Stretch)

**Mentioned in testing**: "Can I send a message to a guest?"

**Needed**: In-app notification to guest
- Room ready notification
- Checkout reminder
- Special offers

**Note**: This would be simulated for demo (show "sent" but no actual delivery)

**Tasks**:
- [ ] Create message composer component
- [ ] Template messages for common scenarios
- [ ] Show message log per guest
- [ ] Simulated "delivery" confirmation

---

## Prioritization Within P5-2

1. **High**: Full guest search - Frequently needed
2. **High**: Guest attribute filtering - Safety implications (allergies)
3. **Medium**: Payment processing UI - Important for complete demo
4. **Medium**: Print reports - Common ask
5. **Low**: Thread delete - Convenience feature
6. **Low**: Guest messaging - Nice to have

---

## Acceptance Criteria

- [ ] Can search all guests (not just current)
- [ ] Can process simulated payments
- [ ] Can delete conversation threads
- [ ] Can filter guests by attributes
- [ ] Can print reports
- [ ] Each feature has appropriate UI

## Technical Notes

- These can be implemented incrementally
- Focus on UI/workflow demonstration
- No real backend integrations needed for demo
- Consider which add most demo value
