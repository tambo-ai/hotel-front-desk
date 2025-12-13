"use client";

import { z } from "zod";
import { BillingItemSchema } from "@/lib/hotel-types";
import { useHotel } from "@/lib/hotel-store";
import {
  Receipt,
  Coffee,
  Sparkles,
  BedDouble,
  Percent,
  Trash2,
  Gift,
} from "lucide-react";

// Schema for Tambo component registration
export const BillingStatementPropsSchema = z.object({
  reservationId: z.string().describe("Reservation ID to show billing for"),
  items: z
    .array(BillingItemSchema)
    .optional()
    .describe("Billing items (if not provided, fetched from state)"),
  showStagedChanges: z
    .boolean()
    .optional()
    .describe("Show staged billing changes"),
  compact: z.boolean().optional().describe("Compact mode for chat embedding"),
});

export type BillingStatementProps = z.infer<typeof BillingStatementPropsSchema>;

const categoryIcons = {
  room: BedDouble,
  food: Coffee,
  amenity: Sparkles,
  service: Receipt,
  tax: Percent,
};

const categoryColors = {
  room: "text-info",
  food: "text-warning",
  amenity: "text-accent",
  service: "text-success",
  tax: "text-muted-foreground",
};

export function BillingStatement({
  reservationId,
  items: providedItems,
  showStagedChanges = true,
  compact = false,
}: BillingStatementProps) {
  const hotelContext = useHotel();
  const state = hotelContext?.state;
  const getBillingForReservation = hotelContext?.getBillingForReservation;

  // Defensive check for undefined reservationId
  if (!reservationId) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No billing data available
        </p>
      </div>
    );
  }

  // Get items from props or state
  const items =
    providedItems ||
    (getBillingForReservation ? getBillingForReservation(reservationId) : []) ||
    [];

  // Get staged changes for this reservation
  const stagedChanges =
    showStagedChanges && state?.stagedBillingChanges
      ? state.stagedBillingChanges.filter(
          (c) => c.reservationId === reservationId,
        )
      : [];

  // Calculate totals
  const subtotal = items
    .filter((item) => !item.isComped && item.category !== "tax")
    .reduce((sum, item) => sum + item.amount, 0);

  const taxItems = items.filter((item) => item.category === "tax");
  const tax = taxItems.reduce((sum, item) => sum + item.amount, 0);

  // Calculate impact of staged changes
  let stagedAdjustment = 0;
  for (const change of stagedChanges) {
    if (change.type === "add" && change.item) {
      stagedAdjustment += change.item.amount;
    } else if (change.type === "remove" && change.itemId) {
      const item = items.find((i) => i.id === change.itemId);
      if (item) stagedAdjustment -= item.amount;
    } else if (
      change.type === "discount" &&
      change.itemId &&
      change.discountPercent
    ) {
      const item = items.find((i) => i.id === change.itemId);
      if (item)
        stagedAdjustment -= item.amount * (change.discountPercent / 100);
    }
  }

  const total = subtotal + tax + stagedAdjustment;

  // Items marked for removal
  const removedItemIds = new Set(
    stagedChanges.filter((c) => c.type === "remove").map((c) => c.itemId),
  );

  // Items with discounts
  const discountedItems = new Map(
    stagedChanges
      .filter((c) => c.type === "discount")
      .map((c) => [c.itemId, c.discountPercent]),
  );

  // New items to add
  const newItems = stagedChanges
    .filter((c) => c.type === "add" && c.item)
    .map((c) => c.item!);

  if (compact) {
    return (
      <div className="rounded-lg border border-border bg-card p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Receipt className="h-4 w-4 text-muted-foreground" />
            Billing Statement
          </span>
          <span className="text-base font-semibold text-foreground">
            ${total.toFixed(2)}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          {items.length} items • Subtotal: ${subtotal.toFixed(2)}
          {stagedAdjustment !== 0 && (
            <span
              className={stagedAdjustment < 0 ? "text-success" : "text-warning"}
            >
              {" "}
              • Adjustment: {stagedAdjustment < 0 ? "-" : "+"}$
              {Math.abs(stagedAdjustment).toFixed(2)}
            </span>
          )}
        </div>
        {stagedChanges.length > 0 && (
          <div className="mt-2 text-xs text-warning">
            {stagedChanges.length} pending change
            {stagedChanges.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Receipt className="h-4 w-4 text-muted-foreground" />
          Billing Statement
        </h3>
      </div>

      {/* Items */}
      <div>
        {items.map((item) => {
          const Icon = categoryIcons[item.category];
          const isRemoved = removedItemIds.has(item.id);
          const discount = discountedItems.get(item.id);

          return (
            <div
              key={item.id}
              className={`flex items-center justify-between border-b border-border px-4 py-2.5 last:border-0 ${
                isRemoved ? "bg-destructive/5 opacity-50" : ""
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`h-4 w-4 ${categoryColors[item.category]}`} />
                <div>
                  <p
                    className={`text-sm text-foreground ${isRemoved ? "line-through" : ""}`}
                  >
                    {item.description}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {item.isComped ? (
                  <span className="flex items-center gap-1 text-xs text-success">
                    <Gift className="h-3 w-3" />
                    Comped
                  </span>
                ) : isRemoved ? (
                  <div>
                    <span className="text-sm text-muted-foreground line-through">
                      ${item.amount.toFixed(2)}
                    </span>
                    <span className="ml-2 flex items-center gap-1 text-xs text-destructive">
                      <Trash2 className="h-3 w-3" />
                      Removed
                    </span>
                  </div>
                ) : discount ? (
                  <div>
                    <span className="text-sm text-muted-foreground line-through">
                      ${item.amount.toFixed(2)}
                    </span>
                    <span className="ml-2 text-sm text-success">
                      ${(item.amount * (1 - discount / 100)).toFixed(2)}
                    </span>
                    <span className="block text-xs text-success">
                      -{discount}%
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-foreground">
                    ${item.amount.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* New staged items */}
        {newItems.map((item, i) => {
          const Icon = categoryIcons[item.category];
          return (
            <div
              key={`new-${i}`}
              className="flex items-center justify-between border-b border-border bg-success/5 px-4 py-2.5 last:border-0"
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`h-4 w-4 ${categoryColors[item.category]}`} />
                <div>
                  <p className="text-sm text-foreground">{item.description}</p>
                  <p className="text-[11px] text-success">
                    New charge (staged)
                  </p>
                </div>
              </div>
              <span className="text-sm text-success">
                +${item.amount.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="space-y-1.5 border-t border-border bg-muted/30 p-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">${subtotal.toFixed(2)}</span>
        </div>
        {tax > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span className="text-foreground">${tax.toFixed(2)}</span>
          </div>
        )}
        {stagedAdjustment !== 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-warning">Pending Adjustments</span>
            <span
              className={stagedAdjustment < 0 ? "text-success" : "text-warning"}
            >
              {stagedAdjustment < 0 ? "-" : "+"}$
              {Math.abs(stagedAdjustment).toFixed(2)}
            </span>
          </div>
        )}
        <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
          <span className="text-foreground">Total</span>
          <span className="text-foreground">${total.toFixed(2)}</span>
        </div>
      </div>

      {stagedChanges.length > 0 && (
        <div className="bg-warning/10 p-3 text-center">
          <span className="text-xs text-warning">
            {stagedChanges.length} pending change
            {stagedChanges.length !== 1 ? "s" : ""} - Click "Save" to apply
          </span>
        </div>
      )}
    </div>
  );
}
