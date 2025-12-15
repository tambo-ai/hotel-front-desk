"use client";

import { useState } from "react";
import { z } from "zod";
import { BillingItemSchema } from "@/lib/hotel-types";
import {
  X,
  Receipt,
  Percent,
  Trash2,
  Coffee,
  Sparkles,
  BedDouble,
} from "lucide-react";

// Schema for Tambo component registration
export const BillingItemDetailPropsSchema = z.object({
  item: BillingItemSchema.describe("Billing item to display details for"),
  onApplyDiscount: z.function().args(z.number()).returns(z.void()).optional(),
  onRemove: z.function().returns(z.void()).optional(),
  onClose: z.function().returns(z.void()).optional(),
});

export type BillingItemDetailProps = z.infer<
  typeof BillingItemDetailPropsSchema
>;

const categoryIcons = {
  room: BedDouble,
  food: Coffee,
  amenity: Sparkles,
  service: Receipt,
  tax: Percent,
};

const categoryLabels = {
  room: "Room Charge",
  food: "Food & Beverage",
  amenity: "Amenity",
  service: "Service",
  tax: "Tax",
};

export function BillingItemDetail({
  item,
  onApplyDiscount,
  onRemove,
  onClose,
}: BillingItemDetailProps) {
  const [discountPercent, setDiscountPercent] = useState(20);
  const [showDiscountInput, setShowDiscountInput] = useState(false);

  // Defensive check
  if (!item) {
    return null;
  }

  const Icon = categoryIcons[item.category] || Receipt;
  const categoryLabel = categoryLabels[item.category] || "Charge";

  const handleApplyDiscount = () => {
    if (onApplyDiscount && discountPercent > 0 && discountPercent <= 100) {
      onApplyDiscount(discountPercent);
      if (onClose) onClose();
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
      if (onClose) onClose();
    }
  };

  const discountedAmount = item.amount * (1 - discountPercent / 100);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon className="w-5 h-5 text-blue-400" />
            Billing Item Details
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Item Info */}
          <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Description</span>
              <span className="text-foreground font-medium">
                {item.description}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span className="text-foreground">{categoryLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="text-foreground">
                {new Date(item.date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-muted-foreground">Amount</span>
              <span
                className={`font-bold ${item.isComped ? "text-emerald-400 line-through" : "text-foreground"}`}
              >
                ${item.amount.toFixed(2)}
              </span>
            </div>
            {item.isComped && (
              <div className="flex justify-center">
                <span className="text-emerald-400 text-sm bg-emerald-500/20 px-3 py-1 rounded-full">
                  Comped
                </span>
              </div>
            )}
          </div>

          {/* Discount Section */}
          {!item.isComped && item.category !== "tax" && (
            <div className="space-y-3">
              {!showDiscountInput ? (
                <button
                  onClick={() => setShowDiscountInput(true)}
                  className="w-full px-4 py-2 bg-secondary hover:bg-muted text-foreground rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Percent className="w-4 h-4" />
                  Apply Discount
                </button>
              ) : (
                <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="text-muted-foreground text-sm">
                      Discount %
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={discountPercent}
                      onChange={(e) =>
                        setDiscountPercent(parseInt(e.target.value) || 0)
                      }
                      className="flex-1 px-3 py-2 bg-muted text-foreground rounded-lg text-center"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">New Amount</span>
                    <span className="text-emerald-400 font-medium">
                      ${discountedAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowDiscountInput(false)}
                      className="flex-1 px-3 py-2 bg-muted hover:bg-secondary text-foreground rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleApplyDiscount}
                      className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm"
                    >
                      Apply {discountPercent}% Off
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-secondary hover:bg-muted text-foreground rounded-lg font-medium transition-colors"
          >
            Close
          </button>
          {!item.isComped && item.category !== "tax" && onRemove && (
            <button
              onClick={handleRemove}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
