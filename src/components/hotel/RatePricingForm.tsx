"use client";

import { z } from "zod";
import { useHotel } from "@/lib/hotel-store";
import { roomRates } from "@/data/mock-data";
import type { RoomType } from "@/lib/hotel-types";
import { DollarSign, Calendar, TrendingUp, TrendingDown } from "lucide-react";

// Schema for Tambo component registration
export const RatePricingFormPropsSchema = z.object({
  roomType: z.enum(["King", "Queen", "Suite"]).optional().describe("Filter by room type"),
  date: z.string().optional().describe("Filter by specific date"),
  showCompetitors: z.boolean().optional().describe("Show competitor rates"),
  compact: z.boolean().optional().describe("Compact mode for chat embedding"),
});

export type RatePricingFormProps = z.infer<typeof RatePricingFormPropsSchema>;

export function RatePricingForm({
  roomType,
  date,
  showCompetitors = false,
  compact = false,
}: RatePricingFormProps) {
  const { state, stageRateChange, commitRateChange } = useHotel();

  // Get rates filtered by criteria
  let rates = roomRates;
  if (roomType) {
    rates = rates.filter((r) => r.roomType === roomType);
  }
  if (date) {
    rates = rates.filter((r) => r.date === date);
  }

  // Get only future dates (next 7 days)
  const today = new Date().toISOString().split("T")[0];
  rates = rates.filter((r) => r.date >= today).slice(0, 7);

  // Group by date for display
  const ratesByDate = rates.reduce((acc, rate) => {
    if (!acc[rate.date]) acc[rate.date] = [];
    acc[rate.date].push(rate);
    return acc;
  }, {} as Record<string, typeof rates>);

  const dates = Object.keys(ratesByDate).sort();

  // Check for staged changes
  const stagedChange = state.stagedRateChange;

  if (compact) {
    return (
      <div className="bg-slate-800 rounded-lg p-3">
        <h3 className="text-sm font-medium text-white flex items-center gap-2 mb-2">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          Room Rates
        </h3>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {["King", "Queen", "Suite"].map((type) => {
            const rate = rates.find((r) => r.roomType === type && r.date === today);
            return (
              <div key={type} className="bg-slate-700/50 rounded p-2 text-center">
                <div className="text-slate-400">{type}</div>
                <div className="text-white font-medium">${rate?.rate || "—"}</div>
              </div>
            );
          })}
        </div>
        {stagedChange && (
          <div className="mt-2 text-xs text-amber-400">
            Pending: {stagedChange.roomType} ${stagedChange.previousRate} → ${stagedChange.newRate}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          Rate Calendar
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          {roomType ? `${roomType} rooms` : "All room types"} • Next 7 days
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3">
                Date
              </th>
              {(!roomType || roomType === "Queen") && (
                <th className="text-center text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3">
                  Queen
                </th>
              )}
              {(!roomType || roomType === "King") && (
                <th className="text-center text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3">
                  King
                </th>
              )}
              {(!roomType || roomType === "Suite") && (
                <th className="text-center text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3">
                  Suite
                </th>
              )}
              {showCompetitors && (
                <th className="text-center text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3">
                  Competitors
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {dates.map((d) => {
              const dateRates = ratesByDate[d];
              const dateObj = new Date(d);
              const dayOfWeek = dateObj.toLocaleDateString("en-US", { weekday: "short" });
              const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
              const isToday = d === today;

              const getRate = (type: RoomType) => dateRates.find((r) => r.roomType === type);

              return (
                <tr
                  key={d}
                  className={`${isWeekend ? "bg-slate-700/20" : ""} ${isToday ? "bg-blue-500/10" : ""}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <div>
                        <div className="text-white font-medium">
                          {dayOfWeek}
                          {isToday && (
                            <span className="ml-2 text-xs px-1.5 py-0.5 bg-blue-500 text-white rounded">
                              Today
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">
                          {dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                      </div>
                    </div>
                  </td>

                  {(!roomType || roomType === "Queen") && (
                    <td className="px-4 py-3 text-center">
                      <RateCell
                        rate={getRate("Queen")}
                        roomType="Queen"
                        date={d}
                        stagedChange={stagedChange}
                        onRateChange={(newRate) =>
                          stageRateChange("Queen", d, newRate, getRate("Queen")?.rate || 159)
                        }
                      />
                    </td>
                  )}

                  {(!roomType || roomType === "King") && (
                    <td className="px-4 py-3 text-center">
                      <RateCell
                        rate={getRate("King")}
                        roomType="King"
                        date={d}
                        stagedChange={stagedChange}
                        onRateChange={(newRate) =>
                          stageRateChange("King", d, newRate, getRate("King")?.rate || 189)
                        }
                      />
                    </td>
                  )}

                  {(!roomType || roomType === "Suite") && (
                    <td className="px-4 py-3 text-center">
                      <RateCell
                        rate={getRate("Suite")}
                        roomType="Suite"
                        date={d}
                        stagedChange={stagedChange}
                        onRateChange={(newRate) =>
                          stageRateChange("Suite", d, newRate, getRate("Suite")?.rate || 349)
                        }
                      />
                    </td>
                  )}

                  {showCompetitors && (
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {dateRates[0]?.competitorRates?.map((comp) => (
                          <span
                            key={comp.name}
                            className="text-xs px-2 py-0.5 bg-slate-700 text-slate-300 rounded"
                            title={comp.name}
                          >
                            ${comp.rate}
                          </span>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Staged Changes */}
      {stagedChange && (
        <div className="p-4 border-t border-slate-700 bg-amber-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-400 font-medium">Pending Rate Change</p>
              <p className="text-sm text-slate-400">
                {stagedChange.roomType} on {new Date(stagedChange.date).toLocaleDateString()}:{" "}
                <span className="text-slate-300">${stagedChange.previousRate}</span>
                {" → "}
                <span className="text-white">${stagedChange.newRate}</span>
              </p>
            </div>
            <button
              onClick={commitRateChange}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              Apply Rate Change
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RateCell({
  rate,
  roomType,
  date,
  stagedChange,
  onRateChange,
}: {
  rate: { rate: number; competitorRates?: { name: string; rate: number }[] } | undefined;
  roomType: RoomType;
  date: string;
  stagedChange: { roomType: RoomType; date: string; newRate: number; previousRate: number } | null;
  onRateChange: (newRate: number) => void;
}) {
  const currentRate = rate?.rate || 0;
  const isStaged =
    stagedChange?.roomType === roomType && stagedChange?.date === date;
  const displayRate = isStaged ? stagedChange!.newRate : currentRate;

  // Compare to competitors
  const avgCompetitor =
    rate?.competitorRates && rate.competitorRates.length > 0
      ? rate.competitorRates.reduce((sum, c) => sum + c.rate, 0) / rate.competitorRates.length
      : null;

  const comparison =
    avgCompetitor !== null
      ? displayRate > avgCompetitor
        ? "above"
        : displayRate < avgCompetitor
        ? "below"
        : "equal"
      : null;

  return (
    <div className={`relative ${isStaged ? "ring-2 ring-amber-400 rounded-lg" : ""}`}>
      <div className="flex items-center justify-center gap-1">
        <span className={`text-lg font-bold ${isStaged ? "text-amber-400" : "text-white"}`}>
          ${displayRate}
        </span>
        {comparison === "above" && (
          <span title="Above competitors">
            <TrendingUp className="w-3 h-3 text-red-400" />
          </span>
        )}
        {comparison === "below" && (
          <span title="Below competitors">
            <TrendingDown className="w-3 h-3 text-emerald-400" />
          </span>
        )}
      </div>
      {isStaged && (
        <div className="text-xs text-amber-400 mt-0.5">
          was ${stagedChange!.previousRate}
        </div>
      )}
      <div className="mt-1 flex gap-1 justify-center">
        <button
          onClick={() => onRateChange(displayRate - 10)}
          className="text-xs px-2 py-0.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors"
        >
          -$10
        </button>
        <button
          onClick={() => onRateChange(displayRate + 10)}
          className="text-xs px-2 py-0.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors"
        >
          +$10
        </button>
      </div>
    </div>
  );
}
