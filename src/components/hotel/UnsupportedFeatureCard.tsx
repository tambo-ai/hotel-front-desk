"use client";

import { z } from "zod";
import { AlertTriangle, ExternalLink } from "lucide-react";

/**
 * Feature information mapping for unsupported features.
 * Each entry contains a human-readable name and a list of related actions
 * that ARE supported in the demo.
 */
const featureInfo: Record<
  UnsupportedFeature,
  { displayName: string; canDo: string[] }
> = {
  checkout: {
    displayName: "checkout processing",
    canDo: [
      "View checkout details",
      "See balance due",
      "View room status",
      "View billing statement",
    ],
  },
  create_reservation: {
    displayName: "creating new reservations",
    canDo: [
      "Search existing reservations",
      "View reservation details",
      "View available rooms",
      "Check room availability",
    ],
  },
  extend_stay: {
    displayName: "extending or modifying reservations",
    canDo: [
      "View reservation details",
      "See current checkout date",
      "View room availability",
      "View occupancy data",
    ],
  },
  room_change: {
    displayName: "room changes",
    canDo: [
      "View current room assignment",
      "See available rooms",
      "View room features",
      "Check room status",
    ],
  },
  payment: {
    displayName: "payment processing",
    canDo: [
      "View billing statement",
      "See balance due",
      "View itemized charges",
      "Review billing history",
    ],
  },
  add_charge: {
    displayName: "adding charges to bills",
    canDo: [
      "View current charges",
      "See billing breakdown",
      "View billing categories",
      "Review billing statement",
    ],
  },
};

// Schema for Tambo component registration
export const UnsupportedFeatureCardPropsSchema = z.object({
  feature: z
    .enum([
      "checkout",
      "create_reservation",
      "extend_stay",
      "room_change",
      "payment",
      "add_charge",
    ])
    .describe("The unsupported feature that was requested"),
});

export type UnsupportedFeatureCardProps = z.infer<
  typeof UnsupportedFeatureCardPropsSchema
>;

type UnsupportedFeature = UnsupportedFeatureCardProps["feature"];

export function UnsupportedFeatureCard({
  feature,
}: UnsupportedFeatureCardProps) {
  const info = featureInfo[feature];

  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="space-y-2 min-w-0">
          <h3 className="font-medium text-foreground">Demo Limitation</h3>
          <p className="text-sm text-muted-foreground">
            This demo showcases Tambo&apos;s AI capabilities but doesn&apos;t
            include {info.displayName}.
          </p>
          <div className="text-sm text-foreground">
            <p className="font-medium mb-1">You can still:</p>
            <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
              {info.canDo.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <a
              href="https://github.com/tambo-ai/tambo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Tambo Framework
            </a>
            <a
              href="https://github.com/tambo-ai/hotel-front-desk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Source Code
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
