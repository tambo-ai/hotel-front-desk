"use client";

import { z } from "zod";
import { useHotel } from "@/lib/hotel-store";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

// Schema for Tambo component registration
export const RoomTypeBreakdownPropsSchema = z.object({
  data: z
    .array(
      z.object({
        roomType: z.string(),
        available: z.number(),
        total: z.number(),
      }),
    )
    .optional()
    .describe("Room availability by type"),
  date: z.string().optional().describe("Date for the breakdown"),
  showAvailableOnly: z
    .boolean()
    .optional()
    .describe("Show only available room counts"),
  compact: z.boolean().optional().describe("Compact mode for chat embedding"),
});

export type RoomTypeBreakdownProps = z.infer<
  typeof RoomTypeBreakdownPropsSchema
>;

const COLORS = {
  King: "oklch(0.6 0.1 250)",
  Queen: "oklch(0.62 0.1 155)",
  Suite: "oklch(0.6 0.1 264)",
};

export function RoomTypeBreakdown({
  data: providedData,
  date,
  showAvailableOnly = true,
  compact = false,
}: RoomTypeBreakdownProps) {
  const { state } = useHotel();

  // Calculate from state if not provided
  const chartData =
    providedData ||
    (() => {
      const roomTypes = ["King", "Queen", "Suite"] as const;
      return roomTypes.map((type) => {
        const roomsOfType = state.rooms.filter((r) => r.type === type);
        const available = roomsOfType.filter(
          (r) => r.status === "available" || r.status === "clean",
        ).length;
        return {
          roomType: type,
          available,
          total: roomsOfType.length,
        };
      });
    })();

  const totalAvailable = chartData.reduce((sum, d) => sum + d.available, 0);
  const totalRooms = chartData.reduce((sum, d) => sum + d.total, 0);

  // Prepare pie data
  const pieData = chartData.map((d) => ({
    name: d.roomType,
    value: showAvailableOnly ? d.available : d.total,
    available: d.available,
    total: d.total,
  }));

  if (compact) {
    return (
      <div className="rounded-lg border border-border bg-card p-3">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <PieChartIcon className="h-3.5 w-3.5" />
            Room Availability
          </h3>
          <span className="text-xs text-muted-foreground">
            {totalAvailable}/{totalRooms}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={16}
                  outerRadius={28}
                  strokeWidth={0}
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={COLORS[entry.name as keyof typeof COLORS]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="min-w-0 flex-1 space-y-1.5">
            {chartData.map((d) => (
              <div
                key={d.roomType}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <div className="flex min-w-0 items-center gap-1.5">
                  <div
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        COLORS[d.roomType as keyof typeof COLORS],
                    }}
                  />
                  <span className="truncate text-muted-foreground">
                    {d.roomType}
                  </span>
                </div>
                <span className="shrink-0 font-medium text-foreground">
                  {d.available}/{d.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
            Room Availability
          </h3>
          {date && (
            <span className="text-xs text-muted-foreground">
              {new Date(date).toLocaleDateString()}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {totalAvailable} of {totalRooms} rooms available
        </p>
      </div>

      <div className="p-4">
        {/* Chart and legend in a row that wraps */}
        <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start">
          {/* Pie Chart - fixed size */}
          <div className="h-[140px] w-[140px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={COLORS[entry.name as keyof typeof COLORS]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                  formatter={(
                    value: number | undefined,
                    name: string | undefined,
                    props: unknown,
                  ) => {
                    const p = props as {
                      payload?: { available: number; total: number };
                    };
                    const n = name ?? "";
                    if (p.payload) {
                      return [
                        `${p.payload.available}/${p.payload.total} rooms`,
                        n,
                      ];
                    }
                    return [`${value ?? 0}`, n];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend and Stats */}
          <div className="min-w-0 flex-1 space-y-2 self-stretch">
            {chartData.map((d) => {
              const occupancyRate = ((d.total - d.available) / d.total) * 100;
              return (
                <div
                  key={d.roomType}
                  className="rounded-md border border-border bg-muted/30 p-2.5"
                >
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <div
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            COLORS[d.roomType as keyof typeof COLORS],
                        }}
                      />
                      <span className="truncate text-sm font-medium text-foreground">
                        {d.roomType}
                      </span>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-foreground">
                      {d.available}
                      <span className="font-normal text-muted-foreground">
                        /{d.total}
                      </span>
                    </span>
                  </div>
                  <div className="relative h-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="absolute left-0 top-0 h-full rounded-full transition-all"
                      style={{
                        width: `${occupancyRate}%`,
                        backgroundColor:
                          COLORS[d.roomType as keyof typeof COLORS],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
