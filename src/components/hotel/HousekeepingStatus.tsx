"use client";

import { z } from "zod";
import { HousekeepingTaskSchema } from "@/lib/hotel-types";
import { useHotel } from "@/lib/hotel-store";
import {
  Sparkles,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
} from "lucide-react";

// Schema for Tambo component registration
export const HousekeepingStatusPropsSchema = z.object({
  tasks: z
    .array(HousekeepingTaskSchema)
    .optional()
    .describe("Tasks to display (defaults to all from state)"),
  filterStatus: z
    .enum(["dirty", "in_progress", "ready"])
    .optional()
    .describe("Filter by status"),
  filterPriority: z
    .enum(["normal", "rush"])
    .optional()
    .describe("Filter by priority"),
  compact: z.boolean().optional().describe("Compact mode for chat embedding"),
});

export type HousekeepingStatusProps = z.infer<
  typeof HousekeepingStatusPropsSchema
>;

const statusConfig = {
  dirty: {
    icon: AlertTriangle,
    bg: "bg-warning/10",
    text: "text-warning",
    label: "Needs Cleaning",
  },
  in_progress: {
    icon: Clock,
    bg: "bg-info/10",
    text: "text-info",
    label: "In Progress",
  },
  ready: {
    icon: CheckCircle,
    bg: "bg-success/10",
    text: "text-success",
    label: "Ready",
  },
};

export function HousekeepingStatus({
  tasks: providedTasks,
  filterStatus,
  filterPriority,
  compact = false,
}: HousekeepingStatusProps) {
  const { state } = useHotel();

  // Get tasks from props or state
  let tasks = providedTasks || state.housekeepingTasks;

  // Apply filters
  if (filterStatus) {
    tasks = tasks.filter((t) => t.status === filterStatus);
  }
  if (filterPriority) {
    tasks = tasks.filter((t) => t.priority === filterPriority);
  }

  // Sort: rush first, then by status (dirty -> in_progress -> ready)
  const statusOrder = { dirty: 0, in_progress: 1, ready: 2 };
  tasks = [...tasks].sort((a, b) => {
    if (a.priority === "rush" && b.priority !== "rush") return -1;
    if (a.priority !== "rush" && b.priority === "rush") return 1;
    return statusOrder[a.status] - statusOrder[b.status];
  });

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
        <div className="mb-3 rounded-full bg-muted p-3">
          <Sparkles className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">No housekeeping tasks</p>
      </div>
    );
  }

  // Count by status
  const counts = {
    dirty: tasks.filter((t) => t.status === "dirty").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    ready: tasks.filter((t) => t.status === "ready").length,
  };

  if (compact) {
    return (
      <div className="rounded-lg border border-border bg-card p-3">
        <h3 className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          Housekeeping ({tasks.length})
        </h3>
        <div className="mb-2 flex gap-3 text-xs">
          <span className="text-warning">{counts.dirty} dirty</span>
          <span className="text-info">{counts.in_progress} in progress</span>
          <span className="text-success">{counts.ready} ready</span>
        </div>
        <div className="space-y-1">
          {tasks.slice(0, 5).map((task) => {
            const config = statusConfig[task.status];
            return (
              <div
                key={task.id}
                className={`flex items-center justify-between rounded-md px-2.5 py-2 ${config.bg}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {task.roomNumber}
                  </span>
                  {task.priority === "rush" && (
                    <span className="rounded bg-destructive px-1 py-0.5 text-[9px] font-semibold text-white">
                      RUSH
                    </span>
                  )}
                </div>
                <span className={`text-xs ${config.text}`}>{config.label}</span>
              </div>
            );
          })}
          {tasks.length > 5 && (
            <p className="pt-1 text-center text-xs text-muted-foreground">
              +{tasks.length - 5} more tasks
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          Housekeeping Status
        </h3>
        <div className="mt-1.5 flex gap-4 text-xs">
          <span className="text-warning">{counts.dirty} dirty</span>
          <span className="text-info">{counts.in_progress} in progress</span>
          <span className="text-success">{counts.ready} ready</span>
        </div>
      </div>

      <div>
        {tasks.map((task, idx) => {
          const config = statusConfig[task.status];
          const Icon = config.icon;

          return (
            <div
              key={task.id}
              className={`flex items-center justify-between border-b border-border p-3 last:border-0 ${
                task.priority === "rush" ? "bg-destructive/5" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-secondary">
                  <span className="text-sm font-semibold text-foreground">
                    {task.roomNumber}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      Room {task.roomNumber}
                    </span>
                    {task.priority === "rush" && (
                      <span className="rounded bg-destructive px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        RUSH
                      </span>
                    )}
                  </div>
                  {task.notes && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {task.notes}
                    </p>
                  )}
                  {task.assignedTo && (
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <User className="h-3 w-3" />
                      {task.assignedTo}
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 ${config.bg}`}
              >
                <Icon className={`h-3.5 w-3.5 ${config.text}`} />
                <span className={`text-xs font-medium ${config.text}`}>
                  {config.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
