"use client";

import { z } from "zod";
import { useHotel } from "@/lib/hotel-store";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

// Schema for Tambo component registration
export const RoomTypeBreakdownPropsSchema = z.object({
  data: z.array(z.object({
    roomType: z.string(),
    available: z.number(),
    total: z.number(),
  })).optional().describe("Room availability by type"),
  date: z.string().optional().describe("Date for the breakdown"),
  showAvailableOnly: z.boolean().optional().describe("Show only available room counts"),
  compact: z.boolean().optional().describe("Compact mode for chat embedding"),
});

export type RoomTypeBreakdownProps = z.infer<typeof RoomTypeBreakdownPropsSchema>;

const COLORS = {
  King: "#3b82f6",
  Queen: "#10b981",
  Suite: "#8b5cf6",
};

export function RoomTypeBreakdown({
  data: providedData,
  date,
  showAvailableOnly = true,
  compact = false,
}: RoomTypeBreakdownProps) {
  const { state } = useHotel();

  // Calculate from state if not provided
  const chartData = providedData || (() => {
    const roomTypes = ["King", "Queen", "Suite"] as const;
    return roomTypes.map((type) => {
      const roomsOfType = state.rooms.filter((r) => r.type === type);
      const available = roomsOfType.filter(
        (r) => r.status === "available" || r.status === "clean"
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
      <div className="bg-slate-800 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-white flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-purple-400" />
            Room Availability
          </h3>
          <span className="text-sm text-slate-400">
            {totalAvailable}/{totalRooms} available
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={40}
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
          <div className="flex-1 space-y-1">
            {chartData.map((d) => (
              <div key={d.roomType} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS[d.roomType as keyof typeof COLORS] }}
                  />
                  <span className="text-slate-300">{d.roomType}</span>
                </div>
                <span className="text-white font-medium">
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
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-purple-400" />
            Room Availability by Type
          </h3>
          {date && (
            <span className="text-sm text-slate-400">
              {new Date(date).toLocaleDateString()}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-400 mt-1">
          {totalAvailable} of {totalRooms} rooms available
        </p>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-8">
          {/* Pie Chart */}
          <div className="w-64 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
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
                    backgroundColor: "#1e293b",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number, name: string, props: unknown) => {
                    const p = props as { payload?: { available: number; total: number } };
                    if (p.payload) {
                      return [`${p.payload.available}/${p.payload.total} rooms`, name];
                    }
                    return [`${value}`, name];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend and Stats */}
          <div className="flex-1 space-y-4">
            {chartData.map((d) => {
              const occupancyRate = ((d.total - d.available) / d.total) * 100;
              return (
                <div key={d.roomType} className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: COLORS[d.roomType as keyof typeof COLORS] }}
                      />
                      <span className="text-white font-medium">{d.roomType}</span>
                    </div>
                    <span className="text-lg font-bold text-white">
                      {d.available}
                      <span className="text-slate-400 text-sm font-normal">/{d.total}</span>
                    </span>
                  </div>
                  <div className="relative h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{
                        width: `${occupancyRate}%`,
                        backgroundColor: COLORS[d.roomType as keyof typeof COLORS],
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-slate-400">
                    <span>{d.available} available</span>
                    <span>{d.total - d.available} occupied</span>
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
