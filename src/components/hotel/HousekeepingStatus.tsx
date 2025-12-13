"use client";

import { z } from "zod";
import { HousekeepingTaskSchema } from "@/lib/hotel-types";
import { useHotel } from "@/lib/hotel-store";
import { Sparkles, Clock, CheckCircle, AlertTriangle, User } from "lucide-react";

// Schema for Tambo component registration
export const HousekeepingStatusPropsSchema = z.object({
  tasks: z.array(HousekeepingTaskSchema).optional().describe("Tasks to display (defaults to all from state)"),
  filterStatus: z.enum(["dirty", "in_progress", "ready"]).optional().describe("Filter by status"),
  filterPriority: z.enum(["normal", "rush"]).optional().describe("Filter by priority"),
  compact: z.boolean().optional().describe("Compact mode for chat embedding"),
});

export type HousekeepingStatusProps = z.infer<typeof HousekeepingStatusPropsSchema>;

const statusConfig = {
  dirty: {
    icon: AlertTriangle,
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    label: "Needs Cleaning",
  },
  in_progress: {
    icon: Clock,
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    label: "In Progress",
  },
  ready: {
    icon: CheckCircle,
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
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
      <div className="bg-slate-800 rounded-lg p-6 text-center">
        <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-2" />
        <p className="text-slate-400">No housekeeping tasks</p>
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
      <div className="bg-slate-800 rounded-lg p-3">
        <h3 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Housekeeping ({tasks.length})
        </h3>
        <div className="flex gap-3 mb-2 text-xs">
          <span className="text-amber-400">{counts.dirty} dirty</span>
          <span className="text-blue-400">{counts.in_progress} in progress</span>
          <span className="text-emerald-400">{counts.ready} ready</span>
        </div>
        <div className="space-y-1">
          {tasks.slice(0, 5).map((task) => {
            const config = statusConfig[task.status];
            return (
              <div
                key={task.id}
                className={`flex items-center justify-between p-2 rounded ${config.bg}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-sm">{task.roomNumber}</span>
                  {task.priority === "rush" && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-red-500 text-white rounded">
                      RUSH
                    </span>
                  )}
                </div>
                <span className={`text-xs ${config.text}`}>{config.label}</span>
              </div>
            );
          })}
          {tasks.length > 5 && (
            <p className="text-xs text-slate-500 text-center pt-1">
              +{tasks.length - 5} more tasks
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-slate-400" />
          Housekeeping Status
        </h3>
        <div className="flex gap-4 mt-2 text-sm">
          <span className="text-amber-400">{counts.dirty} dirty</span>
          <span className="text-blue-400">{counts.in_progress} in progress</span>
          <span className="text-emerald-400">{counts.ready} ready</span>
        </div>
      </div>

      <div className="divide-y divide-slate-700/50">
        {tasks.map((task) => {
          const config = statusConfig[task.status];
          const Icon = config.icon;

          return (
            <div
              key={task.id}
              className={`p-4 flex items-center justify-between ${
                task.priority === "rush" ? "bg-red-500/10" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
                  <span className="text-white font-bold">{task.roomNumber}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">Room {task.roomNumber}</span>
                    {task.priority === "rush" && (
                      <span className="text-xs px-2 py-0.5 bg-red-500 text-white rounded">
                        RUSH
                      </span>
                    )}
                  </div>
                  {task.notes && (
                    <p className="text-sm text-slate-400 mt-0.5">{task.notes}</p>
                  )}
                  {task.assignedTo && (
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {task.assignedTo}
                    </p>
                  )}
                </div>
              </div>

              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg}`}>
                <Icon className={`w-4 h-4 ${config.text}`} />
                <span className={`text-sm ${config.text}`}>{config.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
