# P4-2: Text-to-UI Conversions (Operational Workflows)

**Priority**: P4 - UX Improvement
**Issues**: Group booking, VIP prep, cancellations, no-shows, billing

---

## Overview

Medium-impact text-to-UI opportunities for less frequent but important hotel operations.

---

## 1. Group Booking Form

**Screenshot**: `.playwright-mcp/iter6-04-create-group-reservation.png`

**Current**: AI provides text instructions for group bookings

**Better**: Multi-step group booking wizard
```
[Group Booking Form]
Step 1: Group Details
  Company/Group Name: [TechCorp        ]
  Contact Person:     [John Smith      ]
  Email:             [john@techcorp.com]
  Phone:             [(555) 123-4567   ]

Step 2: Room Requirements
  Number of Rooms: [10]
  Room Type:       [Mix ▾]
  Check-in:        [Jan 15]
  Check-out:       [Jan 18]

Step 3: Special Requests
  [ ] Conference room needed
  [ ] Group dinner arrangement
  [ ] Airport shuttle
  [Additional notes: _______]

[← Back] [Continue →]
```

---

## 2. VIP Preparation Checklist

**Screenshot**: `.playwright-mcp/iter6-06-vip-preparation-checklist.png`

**Current**: AI lists preparation steps in text

**Better**: Interactive checklist component
```
[VIP Arrival Checklist - Sarah Chen (Platinum)]
Arriving: Today 10:00 AM | Room 301 (Suite)

Pre-Arrival:
  [✓] Room inspected and approved
  [✓] Welcome amenities placed
  [ ] Fresh flowers delivered
  [ ] Personalized welcome letter

Room Setup:
  [✓] Premium toiletries
  [ ] Preferred newspaper (WSJ)
  [ ] Mini-bar stocked per preferences

Staff Notifications:
  [ ] Front desk briefed
  [ ] Concierge notified
  [ ] Restaurant aware of dietary needs

[Mark All Complete] [Print Checklist]
```

---

## 3. Cancellation Request Form

**Screenshot**: `.playwright-mcp/iter6-11-cancellation-request.png`

**Current**: AI explains cancellation policy in text

**Better**: Cancellation processing form
```
[Process Cancellation]
Reservation: RT3456 - Robert Taylor
Room: 303 (King) | Jan 9-11

Cancellation Reason:
  [Flight cancelled ▾]

Cancellation Fee:
  Policy: 24-hour notice required
  Fee Amount: $189.00

  [ ] Waive cancellation fee
  Waiver Reason: [____________]

Refund Method:
  ( ) Original payment method
  ( ) Hotel credit
  ( ) No refund (per policy)

[Cancel Reservation] [Keep Reservation]
```

---

## 4. No-Show Handler

**Screenshot**: `.playwright-mcp/iter6-13-noshow-procedure.png`

**Current**: AI explains no-show procedure in text

**Better**: Pending arrivals action panel
```
[Pending Arrivals - Past ETA]
These guests haven't checked in yet:

| Guest          | ETA   | Status    | Actions              |
| John Doe       | 14:00 | 3h late   | [Contact] [No-Show]  |
| Jane Smith     | 16:00 | 1h late   | [Contact] [Extend]   |

No-Show Actions:
  - Charge first night (per policy)
  - Release room
  - Send notification email

[Process No-Show] automatically charges and releases room
```

---

## 5. Charge Dispute Form

**Screenshot**: `.playwright-mcp/iter6-17-minibar-dispute.png`

**Current**: AI discusses dispute resolution in text

**Better**: Dispute resolution interface
```
[Charge Dispute - Room 303]
Guest: Robert Taylor
Disputed Charge: Mini-bar - $24.00

Guest's Claim:
  [Did not consume items ▾]

Options:
  ( ) Approve charge as-is
  ( ) Remove charge completely
  ( ) Adjust to: $[____]

Resolution Notes:
  [Guest states items were already open on arrival]

Manager Approval: [ ] Required for amounts over $50

[Resolve Dispute]
```

---

## 6. Discount Application Form

**Screenshot**: `.playwright-mcp/iter6-18-apply-discount-303.png`

**Current**: AI asks about discount type in text

**Better**: Discount selector with preview
```
[Apply Discount - Room 303]
Current Bill: $756.00

Discount Type:
  ( ) Percentage: [10]%  → New Total: $680.40
  ( ) Fixed Amount: $[__] off
  ( ) Comp (100% off)

Reason:
  [Service recovery ▾]

  Other reasons: AAA, Senior, Employee, Loyalty, Error correction

Authorization:
  [ ] Manager approval required

[Apply Discount] [Cancel]
```

---

## Tasks

- [ ] Create GroupBookingForm component
- [ ] Create VIPChecklist component
- [ ] Create CancellationForm component
- [ ] Create NoShowHandler component
- [ ] Create DisputeForm component
- [ ] Create DiscountForm component
- [ ] Register all with Tambo
- [ ] Update AI to use these components

## Acceptance Criteria

- [ ] Each workflow has dedicated UI component
- [ ] Components pre-fill with relevant data
- [ ] Actions provide confirmation feedback
- [ ] All match existing design system
