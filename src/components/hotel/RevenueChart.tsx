"use client";

import { z } from "zod";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

// Schema for Tambo component registration
export const RevenueChartPropsSchema = z.object({
  currentRevenue: z.number().describe("Current/actual revenue"),
  projectedRevenue: z.number().describe("Projected revenue after changes"),
  currentRate: z.number().optional().describe("Current room rate"),
  newRate: z.number().optional().describe("New proposed rate"),
  affectedRooms: z.number().optional().describe("Number of rooms affected"),
  roomType: z.string().optional().describe("Room type being adjusted"),
  date: z.string().optional().describe("Date of the projection"),
  compact: z.boolean().optional().describe("Compact mode for chat embedding"),
});

export type RevenueChartProps = z.infer<typeof RevenueChartPropsSchema>;

export function RevenueChart({
  currentRevenue,
  projectedRevenue,
  currentRate,
  newRate,
  affectedRooms,
  roomType,
  date,
  compact = false,
}: RevenueChartProps) {
  const difference = projectedRevenue - currentRevenue;
  const percentChange =
    currentRevenue > 0 ? (difference / currentRevenue) * 100 : 0;
  const isPositive = difference >= 0;

  const chartData = [
    { name: "Current", value: currentRevenue, fill: "#3b82f6" },
    {
      name: "Projected",
      value: projectedRevenue,
      fill: isPositive ? "#10b981" : "#ef4444",
    },
  ];

  if (compact) {
    return (
      <div className="bg-card border border-border rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Revenue Projection
          </h3>
          <div
            className={`flex items-center gap-1 ${isPositive ? "text-emerald-400" : "text-red-400"}`}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="font-bold">
              {isPositive ? "+" : ""}${difference.toFixed(0)}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-secondary/50 rounded p-2">
            <div className="text-muted-foreground text-xs">Current</div>
            <div className="text-foreground font-medium">
              ${currentRevenue.toFixed(0)}
            </div>
          </div>
          <div
            className={`rounded p-2 ${isPositive ? "bg-emerald-500/20" : "bg-red-500/20"}`}
          >
            <div className="text-muted-foreground text-xs">Projected</div>
            <div
              className={`font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}
            >
              ${projectedRevenue.toFixed(0)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Revenue Projection
          </h3>
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              isPositive
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="font-medium">
              {isPositive ? "+" : ""}
              {percentChange.toFixed(1)}%
            </span>
          </div>
        </div>
        {(roomType || date) && (
          <p className="text-sm text-muted-foreground mt-1">
            {roomType && <span>{roomType} rooms</span>}
            {roomType && date && <span> • </span>}
            {date && <span>{new Date(date).toLocaleDateString()}</span>}
          </p>
        )}
      </div>

      <div className="p-4">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                horizontal={false}
              />
              <XAxis
                type="number"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickFormatter={(v) => `$${v}`}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="var(--muted-foreground)"
                fontSize={12}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
                formatter={(value: number | undefined) => [
                  `$${(value ?? 0).toFixed(2)}`,
                  "Revenue",
                ]}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-foreground">
              ${currentRevenue.toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground">Current Revenue</div>
          </div>
          <div
            className={`rounded-lg p-3 text-center ${isPositive ? "bg-emerald-500/20" : "bg-red-500/20"}`}
          >
            <div
              className={`text-2xl font-bold ${isPositive ? "text-emerald-400" : "text-red-400"}`}
            >
              {isPositive ? "+" : ""}${difference.toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground">Difference</div>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-foreground">
              ${projectedRevenue.toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground">
              Projected Revenue
            </div>
          </div>
        </div>

        {/* Rate Change Details */}
        {currentRate && newRate && (
          <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Rate Change Details
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Current Rate:</span>
                <span className="text-foreground ml-2">
                  ${currentRate}/night
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">New Rate:</span>
                <span
                  className={`ml-2 ${newRate < currentRate ? "text-emerald-400" : "text-amber-400"}`}
                >
                  ${newRate}/night
                </span>
              </div>
              {affectedRooms && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">
                    Affected Inventory:
                  </span>
                  <span className="text-foreground ml-2">
                    {affectedRooms} rooms
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
