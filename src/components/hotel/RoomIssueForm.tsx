"use client";

import { useState } from "react";
import { z } from "zod";
import { useHotel } from "@/lib/hotel-store";
import { rooms as allRooms, guests } from "@/data/mock-data";
import {
  AlertTriangle,
  Send,
  X,
  CheckCircle,
  Wrench,
  Droplets,
  Thermometer,
  Lightbulb,
  Volume2,
  Bug,
  HelpCircle,
} from "lucide-react";

// Issue category definitions
export const RoomIssueCategoryEnum = z.enum([
  "plumbing",
  "electrical",
  "hvac",
  "noise",
  "cleanliness",
  "pest",
  "maintenance",
  "other",
]);
export type RoomIssueCategory = z.infer<typeof RoomIssueCategoryEnum>;

export const RoomIssuePriorityEnum = z.enum(["low", "medium", "high", "urgent"]);
export type RoomIssuePriority = z.infer<typeof RoomIssuePriorityEnum>;

// Schema for Tambo component registration
export const RoomIssueFormPropsSchema = z.object({
  roomNumber: z.number().describe("Room number with the issue"),
  guestId: z.string().optional().describe("Guest ID reporting the issue"),
  category: RoomIssueCategoryEnum.optional().describe("Pre-selected issue category"),
  priority: RoomIssuePriorityEnum.optional().describe("Pre-selected priority level"),
  description: z.string().optional().describe("Pre-filled issue description"),
  compact: z.boolean().optional().describe("Compact mode for chat embedding"),
  onSubmit: z.function().args().returns(z.void()).optional(),
  onClose: z.function().args().returns(z.void()).optional(),
});

export type RoomIssueFormProps = z.infer<typeof RoomIssueFormPropsSchema>;

const categoryIcons: Record<RoomIssueCategory, React.ReactNode> = {
  plumbing: <Droplets className="w-4 h-4" />,
  electrical: <Lightbulb className="w-4 h-4" />,
  hvac: <Thermometer className="w-4 h-4" />,
  noise: <Volume2 className="w-4 h-4" />,
  cleanliness: <Bug className="w-4 h-4" />,
  pest: <Bug className="w-4 h-4" />,
  maintenance: <Wrench className="w-4 h-4" />,
  other: <HelpCircle className="w-4 h-4" />,
};

const categoryLabels: Record<RoomIssueCategory, string> = {
  plumbing: "Plumbing",
  electrical: "Electrical",
  hvac: "HVAC / Temperature",
  noise: "Noise",
  cleanliness: "Cleanliness",
  pest: "Pest Control",
  maintenance: "General Maintenance",
  other: "Other",
};

const priorityStyles: Record<RoomIssuePriority, string> = {
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  urgent: "bg-red-500/20 text-red-400 border-red-500/30",
};

export function RoomIssueForm({
  roomNumber,
  guestId,
  category: initialCategory,
  priority: initialPriority,
  description: initialDescription,
  compact = false,
  onSubmit,
  onClose,
}: RoomIssueFormProps) {
  const { state } = useHotel();
  const [category, setCategory] = useState<RoomIssueCategory | "">(
    initialCategory || ""
  );
  const [priority, setPriority] = useState<RoomIssuePriority>(
    initialPriority || "medium"
  );
  const [description, setDescription] = useState(initialDescription || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const room = state.rooms.find((r) => r.number === roomNumber) ||
    allRooms.find((r) => r.number === roomNumber);
  const guest = guestId ? guests.find((g) => g.id === guestId) : null;

  const handleSubmit = async () => {
    if (!category || !description.trim()) return;

    setIsSubmitting(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate ticket ID
    const newTicketId = `ISS-${Date.now().toString(36).toUpperCase()}`;
    setTicketId(newTicketId);
    setIsSubmitting(false);
    setSubmitted(true);

    if (onSubmit) {
      onSubmit();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  if (submitted) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Issue Reported Successfully!
        </h3>
        <p className="text-muted-foreground mb-2">
          Ticket ID: <span className="font-mono text-foreground">{ticketId}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Our maintenance team has been notified and will address the issue in room {roomNumber}.
        </p>
        {onClose && (
          <button
            onClick={handleClose}
            className="mt-4 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors"
          >
            Close
          </button>
        )}
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-card border border-border rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Report Room Issue
          </h3>
          <span className="text-xs px-2 py-0.5 bg-secondary text-muted-foreground rounded">
            Room {roomNumber}
          </span>
        </div>

        <div className="space-y-2">
          {/* Category Selection */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as RoomIssueCategory)}
            className="w-full px-2 py-1.5 bg-secondary border border-border rounded text-sm text-foreground"
          >
            <option value="">Select issue type...</option>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          {/* Priority Selection */}
          <div className="flex gap-1">
            {(["low", "medium", "high", "urgent"] as RoomIssuePriority[]).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 px-2 py-1 text-xs rounded border transition-colors ${
                    priority === p
                      ? priorityStyles[p]
                      : "bg-secondary border-border text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              )
            )}
          </div>

          {/* Description */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue..."
            rows={2}
            className="w-full px-2 py-1.5 bg-secondary border border-border rounded text-sm text-foreground resize-none"
          />
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !category || !description.trim()}
            className="flex-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:bg-muted disabled:cursor-not-allowed text-foreground text-sm rounded transition-colors flex items-center justify-center gap-1"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <Send className="w-3 h-3" />
                Submit
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Report Room Issue
            </h3>
            <p className="text-sm text-muted-foreground">Room {roomNumber}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={handleClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Room & Guest Info */}
      {(room || guest) && (
        <div className="px-4 py-3 bg-secondary/50 border-b border-border">
          <div className="flex items-center gap-4 text-sm">
            {room && (
              <span className="text-foreground">
                {room.type} Room • Floor {room.floor}
              </span>
            )}
            {guest && (
              <span className="text-muted-foreground">
                Guest: {guest.firstName} {guest.lastName}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Form */}
      <div className="p-4 space-y-4">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Issue Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(categoryLabels) as RoomIssueCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`p-3 rounded-lg border transition-colors flex flex-col items-center gap-1 ${
                  category === cat
                    ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                    : "bg-secondary border-border text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                {categoryIcons[cat]}
                <span className="text-xs">{categoryLabels[cat]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Priority Selection */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Priority Level
          </label>
          <div className="flex gap-2">
            {(["low", "medium", "high", "urgent"] as RoomIssuePriority[]).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                    priority === p
                      ? priorityStyles[p]
                      : "bg-secondary border-border text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Issue Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please describe the issue in detail..."
            rows={4}
            className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border flex items-center justify-end gap-3">
        {onClose && (
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-border text-foreground hover:bg-secondary rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !category || !description.trim()}
          className="px-6 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-muted disabled:cursor-not-allowed text-foreground rounded-lg transition-colors flex items-center gap-2"
        >
          {isSubmitting ? (
            "Submitting..."
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Issue
            </>
          )}
        </button>
      </div>
    </div>
  );
}
