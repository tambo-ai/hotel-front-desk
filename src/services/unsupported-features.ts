import type {
  HandleUnsupportedFeatureArgs,
  HandleUnsupportedFeatureResult,
  UnsupportedFeature,
} from "@/lib/hotel-types";

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

/**
 * Handles requests for features not supported in this demo.
 * Returns a friendly message explaining the limitation and provides
 * links to documentation and source code.
 */
export function handleUnsupportedFeature(
  args: HandleUnsupportedFeatureArgs
): HandleUnsupportedFeatureResult {
  const info = featureInfo[args.feature];

  return {
    message: `This demo showcases Tambo's AI capabilities but doesn't include ${info.displayName}.`,
    canDo: info.canDo,
    tamboDocsUrl: "https://github.com/tambo-ai/tambo",
    demoSourceUrl: "https://github.com/tambo-ai/hotel-front-desk",
  };
}
