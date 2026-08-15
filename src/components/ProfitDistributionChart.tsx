import React, { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { YardPlanItem, Chassis, TargetPart } from "../types";
import { MarketInsightsSection } from "./MarketInsightsSection";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Flame, 
  Layers, 
  DollarSign, 
  Car,
  Sparkles
} from "lucide-react";

interface ProfitDistributionChartProps {
  planItems: YardPlanItem[];
  chassisList: Chassis[];
  onAddPartToPlan?: (chassis: Partial<Chassis>, part: TargetPart) => void;
  onCreateListing?: (chassis: Chassis, part: TargetPart) => void;
  isPartInPlan?: (partName: string) => boolean;
}

const OriginColors: Record<string, string> = {
  Japanese: "#f59e0b", // Amber
  German: "#3b82f6",   // Blue
  American: "#10b981", // Emerald
  Swedish: "#a855f7",  // Purple
};

export default function ProfitDistributionChart({
  planItems,
  chassisList,
  onAddPartToPlan,
  onCreateListing,
  isPartInPlan
}: ProfitDistributionChartProps) {
  // Main Sub-Tab within Profit Analytics
  const [subTab, setSubTab] = useState<"valuation" | "market-insights">("valuation");
  const [viewSource, setViewSource] = useState<"catalog" | "plan">("catalog");

  // Aggregate by Manufacturer / Brand
  const data = useMemo(() => {
    const map: Record<string, { make: string; origin: string; totalValue: number; partsCount: number }> = {};

    if (viewSource === "plan") {
      planItems.forEach((item) => {
        const make = item.chassisMake || "Custom";
        const matched = chassisList.find((c) => c.make === make);
        const origin = matched ? matched.origin : "Japanese";

        if (!map[make]) {
          map[make] = { make, origin, totalValue: 0, partsCount: 0 };
        }
        map[make].totalValue += item.part.estValue;
        map[make].partsCount += 1;
      });
    } else {
      chassisList.forEach((c) => {
        const make = c.make;
        const totalCarValue = c.targetParts.reduce((sum, p) => sum + p.estValue, 0);

        if (!map[make]) {
          map[make] = { make, origin: c.origin, totalValue: 0, partsCount: 0 };
        }
        map[make].totalValue += totalCarValue;
        map[make].partsCount += c.targetParts.length;
      });
    }

    return Object.values(map).sort((a, b) => b.totalValue - a.totalValue);
  }, [viewSource, planItems, chassisList]);

  const totalValue = data.reduce((acc, d) => acc + d.totalValue, 0);

  return (
    <div id="profit-analytics-view" className="space-y-6 max-w-5xl mx-auto">
      {/* Top Sub-Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 p-2 rounded-2xl">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSubTab("valuation")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              subTab === "valuation"
                ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
            }`}
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>Make & Portfolio Valuation</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab("market-insights")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              subTab === "market-insights"
                ? "bg-zinc-800 text-white shadow-sm border border-amber-500/40"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300">Market Insights</span>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase">
              Forum Trends
            </span>
          </button>
        </div>

        <div className="text-xs font-mono text-zinc-400 px-3 py-1 bg-zinc-950 rounded-xl border border-zinc-800 hidden sm:flex items-center gap-2">
          <span>Tracked Capital:</span>
          <span className="text-emerald-400 font-bold">${totalValue.toLocaleString()}</span>
        </div>
      </div>

      {/* Sub-Tab 1: Valuation Chart */}
      {subTab === "valuation" && (
        <div id="profit-analytics" className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
          {/* Header & Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Salvage Profit & Make Valuation</h3>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Compare total profit potential by vehicle manufacturer
              </p>
            </div>

            <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setViewSource("catalog")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  viewSource === "catalog"
                    ? "bg-zinc-800 text-white font-bold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                All Catalog Vehicles
              </button>
              <button
                type="button"
                onClick={() => setViewSource("plan")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  viewSource === "plan"
                    ? "bg-amber-500 text-zinc-950 font-bold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                My Yard Plan ({planItems.length})
              </button>
            </div>
          </div>

          {data.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-sm">
              No data available for the selected view. Add parts to your pull plan to see analytics.
            </div>
          ) : (
            <>
              {/* Chart Display */}
              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis
                      dataKey="make"
                      stroke="#71717a"
                      fontSize={12}
                      tickLine={false}
                      axisLine={{ stroke: "#3f3f46" }}
                    />
                    <YAxis
                      stroke="#71717a"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "#3f3f46" }}
                      tickFormatter={(val) => `$${val}`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl shadow-xl text-xs font-mono space-y-1">
                              <p className="font-bold text-zinc-100 text-sm">{item.make}</p>
                              <p className="text-zinc-400">Platform: {item.origin}</p>
                              <p className="text-emerald-400 font-bold text-sm">
                                Total Valuation: ${item.totalValue.toLocaleString()}
                              </p>
                              <p className="text-zinc-500">{item.partsCount} target parts</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="totalValue" radius={[6, 6, 0, 0]}>
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={OriginColors[entry.origin] || "#f59e0b"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Legend & Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-zinc-800">
                {Object.entries(OriginColors).map(([origin, color]) => {
                  const originTotal = data
                    .filter((d) => d.origin === origin)
                    .reduce((acc, d) => acc + d.totalValue, 0);

                  if (originTotal === 0) return null;

                  return (
                    <div key={origin} className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1 font-mono">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                        <span>{origin}</span>
                      </div>
                      <span className="text-lg font-bold text-white font-mono">
                        ${originTotal.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* Sub-Tab 2: Grounded Market Insights */}
      {subTab === "market-insights" && (
        <MarketInsightsSection
          onAddPartToPlan={onAddPartToPlan}
          onCreateListing={onCreateListing}
          isPartInPlan={isPartInPlan}
        />
      )}
    </div>
  );
}
