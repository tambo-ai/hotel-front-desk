"use client";

import { z } from "zod";
import { OccupancyDataSchema } from "@/lib/hotel-types";
import { occupancyData, historicalOccupancy } from "@/data/mock-data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
} from "recharts";
import { TrendingUp } from "lucide-react";

// Schema for Tambo component registration
export const OccupancyChartPropsSchema = z.object({
  data: z.array(OccupancyDataSchema).optional().describe("Occupancy data to display"),
  showCompetitors: z.boolean().optional().describe("Show competitor rate comparison"),
  showHistorical: z.boolean().optional().describe("Show historical comparison"),
  chartType: z.enum(["line", "bar", "composed"]).optional().describe("Chart type"),
  dateRange: z.enum(["week", "month", "custom"]).optional().describe("Date range to show"),
  compact: z.boolean().optional().describe("Compact mode for chat embedding"),
});

export type OccupancyChartProps = z.infer<typeof OccupancyChartPropsSchema>;

export function OccupancyChart({
  data: providedData,
  showCompetitors = false,
  showHistorical = false,
  chartType = "line",
  dateRange = "week",
  compact = false,
}: OccupancyChartProps) {
  // Get data from props or default
  let chartData = providedData || occupancyData;

  // Filter by date range
  const today = new Date();
  if (dateRange === "week") {
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    chartData = chartData.filter((d) => {
      const date = new Date(d.date);
      return date >= weekAgo && date <= today;
    });
  } else if (dateRange === "month") {
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);
    chartData = chartData.filter((d) => {
      const date = new Date(d.date);
      return date >= monthAgo && date <= today;
    });
  }

  // Merge historical data if needed
  let mergedData = chartData.map((d) => ({
    ...d,
    dayLabel: new Date(d.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    shortLabel: new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }),
  }));

  if (showHistorical) {
    mergedData = mergedData.map((d) => {
      const historicalMatch = historicalOccupancy.find((h) => {
        // Match by day of week for last year comparison
        const currentDow = new Date(d.date).getDay();
        const historicalDow = new Date(h.date).getDay();
        return currentDow === historicalDow;
      });
      return {
        ...d,
        historicalOccupancy: historicalMatch?.occupancyRate || null,
      };
    });
  }

  // Calculate summary stats
  const avgOccupancy = Math.round(
    mergedData.reduce((sum, d) => sum + d.occupancyRate, 0) / mergedData.length
  );
  const totalRevenue = mergedData.reduce((sum, d) => sum + d.revenue, 0);

  if (compact) {
    return (
      <div className="bg-slate-800 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Occupancy
          </h3>
          <span className="text-lg font-bold text-white">{avgOccupancy}%</span>
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mergedData}>
              <Line
                type="monotone"
                dataKey="occupancyRate"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
              {showHistorical && (
                <Line
                  type="monotone"
                  dataKey="historicalOccupancy"
                  stroke="#6b7280"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Avg: {avgOccupancy}%</span>
          <span>Revenue: ${totalRevenue.toLocaleString()}</span>
        </div>
      </div>
    );
  }

  const renderChart = () => {
    if (chartType === "bar") {
      return (
        <BarChart data={mergedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="shortLabel" stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" fontSize={12} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #374151",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#fff" }}
          />
          <Legend />
          <Bar dataKey="occupancyRate" name="Occupancy %" fill="#10b981" radius={[4, 4, 0, 0]} />
          {showHistorical && (
            <Bar dataKey="historicalOccupancy" name="Last Year %" fill="#6b7280" radius={[4, 4, 0, 0]} />
          )}
        </BarChart>
      );
    }

    if (chartType === "composed") {
      return (
        <ComposedChart data={mergedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="shortLabel" stroke="#9ca3af" fontSize={12} />
          <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} domain={[0, 100]} />
          <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #374151",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#fff" }}
          />
          <Legend />
          <Bar yAxisId="right" dataKey="revenue" name="Revenue $" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Line yAxisId="left" type="monotone" dataKey="occupancyRate" name="Occupancy %" stroke="#10b981" strokeWidth={2} />
          {showHistorical && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="historicalOccupancy"
              name="Last Year %"
              stroke="#6b7280"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          )}
        </ComposedChart>
      );
    }

    // Default: line chart
    return (
      <LineChart data={mergedData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="shortLabel" stroke="#9ca3af" fontSize={12} />
        <YAxis stroke="#9ca3af" fontSize={12} domain={[0, 100]} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1e293b",
            border: "1px solid #374151",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#fff" }}
          formatter={(value: number, name: string) => [
            `${value}%`,
            name === "occupancyRate" ? "Current" : "Last Year",
          ]}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="occupancyRate"
          name="Occupancy %"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: "#10b981", strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
        {showHistorical && (
          <Line
            type="monotone"
            dataKey="historicalOccupancy"
            name="Last Year %"
            stroke="#6b7280"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: "#6b7280", strokeWidth: 2 }}
          />
        )}
      </LineChart>
    );
  };

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Occupancy Trends
          </h3>
          <div className="flex gap-4 text-sm">
            <div>
              <span className="text-slate-400">Avg: </span>
              <span className="text-white font-medium">{avgOccupancy}%</span>
            </div>
            <div>
              <span className="text-slate-400">Revenue: </span>
              <span className="text-emerald-400 font-medium">${totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily breakdown */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-7 gap-2">
          {mergedData.slice(-7).map((d) => (
            <div key={d.date} className="text-center">
              <div className="text-xs text-slate-500">{d.shortLabel}</div>
              <div
                className={`text-sm font-medium ${
                  d.occupancyRate >= 80
                    ? "text-emerald-400"
                    : d.occupancyRate >= 60
                    ? "text-amber-400"
                    : "text-red-400"
                }`}
              >
                {d.occupancyRate}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
