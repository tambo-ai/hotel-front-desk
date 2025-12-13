"use client";

import { z } from "zod";
import { BillingItemSchema, BillingCategoryEnum } from "@/lib/hotel-types";
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
  items: z.array(BillingItemSchema).optional().describe("Billing items (if not provided, fetched from state)"),
  showStagedChanges: z.boolean().optional().describe("Show staged billing changes"),
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
  room: "text-blue-400",
  food: "text-amber-400",
  amenity: "text-purple-400",
  service: "text-emerald-400",
  tax: "text-slate-400",
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
      <div className="bg-slate-800 rounded-lg p-4 text-slate-400">
        No billing data available
      </div>
    );
  }

  // Get items from props or state
  const items = providedItems || (getBillingForReservation ? getBillingForReservation(reservationId) : []) || [];

  // Get staged changes for this reservation
  const stagedChanges = showStagedChanges && state?.stagedBillingChanges
    ? state.stagedBillingChanges.filter((c) => c.reservationId === reservationId)
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
    } else if (change.type === "discount" && change.itemId && change.discountPercent) {
      const item = items.find((i) => i.id === change.itemId);
      if (item) stagedAdjustment -= item.amount * (change.discountPercent / 100);
    }
  }

  const total = subtotal + tax + stagedAdjustment;

  // Items marked for removal
  const removedItemIds = new Set(
    stagedChanges.filter((c) => c.type === "remove").map((c) => c.itemId)
  );

  // Items with discounts
  const discountedItems = new Map(
    stagedChanges
      .filter((c) => c.type === "discount")
      .map((c) => [c.itemId, c.discountPercent])
  );

  // New items to add
  const newItems = stagedChanges.filter((c) => c.type === "add" && c.item).map((c) => c.item!);

  if (compact) {
    return (
      <div className="bg-slate-800 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-slate-400" />
            Billing Statement
          </span>
          <span className="text-lg font-bold text-white">${total.toFixed(2)}</span>
        </div>
        <div className="text-xs text-slate-400">
          {items.length} items • Subtotal: ${subtotal.toFixed(2)}
          {stagedAdjustment !== 0 && (
            <span className={stagedAdjustment < 0 ? "text-emerald-400" : "text-amber-400"}>
              {" "}• Adjustment: {stagedAdjustment < 0 ? "-" : "+"}${Math.abs(stagedAdjustment).toFixed(2)}
            </span>
          )}
        </div>
        {stagedChanges.length > 0 && (
          <div className="mt-2 text-xs text-amber-400">
            {stagedChanges.length} pending change{stagedChanges.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Receipt className="w-5 h-5 text-slate-400" />
          Billing Statement
        </h3>
      </div>

      {/* Items */}
      <div className="divide-y divide-slate-700/50">
        {items.map((item) => {
          const Icon = categoryIcons[item.category];
          const isRemoved = removedItemIds.has(item.id);
          const discount = discountedItems.get(item.id);

          return (
            <div
              key={item.id}
              className={`p-3 flex items-center justify-between ${
                isRemoved ? "opacity-50 bg-red-500/10" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${categoryColors[item.category]}`} />
                <div>
                  <p className={`text-sm text-white ${isRemoved ? "line-through" : ""}`}>
                    {item.description}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {item.isComped ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Gift className="w-3 h-3" />
                    Comped
                  </span>
                ) : isRemoved ? (
                  <div>
                    <span className="text-sm text-slate-400 line-through">
                      ${item.amount.toFixed(2)}
                    </span>
                    <span className="text-xs text-red-400 ml-2 flex items-center gap-1">
                      <Trash2 className="w-3 h-3" />
                      Removed
                    </span>
                  </div>
                ) : discount ? (
                  <div>
                    <span className="text-sm text-slate-400 line-through">
                      ${item.amount.toFixed(2)}
                    </span>
                    <span className="text-sm text-emerald-400 ml-2">
                      ${(item.amount * (1 - discount / 100)).toFixed(2)}
                    </span>
                    <span className="text-xs text-emerald-400 block">-{discount}%</span>
                  </div>
                ) : (
                  <span className="text-sm text-white">${item.amount.toFixed(2)}</span>
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
              className="p-3 flex items-center justify-between bg-emerald-500/10"
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${categoryColors[item.category]}`} />
                <div>
                  <p className="text-sm text-white">{item.description}</p>
                  <p className="text-xs text-emerald-400">New charge (staged)</p>
                </div>
              </div>
              <span className="text-sm text-emerald-400">+${item.amount.toFixed(2)}</span>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="p-4 border-t border-slate-700 bg-slate-700/30 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Subtotal</span>
          <span className="text-white">${subtotal.toFixed(2)}</span>
        </div>
        {tax > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Tax</span>
            <span className="text-white">${tax.toFixed(2)}</span>
          </div>
        )}
        {stagedAdjustment !== 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-amber-400">Pending Adjustments</span>
            <span className={stagedAdjustment < 0 ? "text-emerald-400" : "text-amber-400"}>
              {stagedAdjustment < 0 ? "-" : "+"}${Math.abs(stagedAdjustment).toFixed(2)}
            </span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-600">
          <span className="text-white">Total</span>
          <span className="text-white">${total.toFixed(2)}</span>
        </div>
      </div>

      {stagedChanges.length > 0 && (
        <div className="p-3 bg-amber-500/10 text-center">
          <span className="text-sm text-amber-400">
            {stagedChanges.length} pending change{stagedChanges.length !== 1 ? "s" : ""} - Click "Save" to apply
          </span>
        </div>
      )}
    </div>
  );
}
