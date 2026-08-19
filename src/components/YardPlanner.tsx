import React, { useState } from "react";
import { YardPlanItem } from "../types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { 
  ClipboardList, 
  Wrench, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  DollarSign, 
  Clock, 
  Share2, 
  Copy, 
  Check, 
  Printer, 
  Car,
  Download,
  FileSpreadsheet,
  Tag,
  TrendingUp,
  Percent
} from "lucide-react";
import { YardInventoryAlerts } from "./YardInventoryAlerts";

interface YardPlannerProps {
  planItems: YardPlanItem[];
  onRemoveItem: (planItemId: string) => void;
  onClearPlan: () => void;
  onCreateListing?: (item: YardPlanItem) => void;
  onUpdateItemValue?: (planItemId: string, newValue: number) => void;
  onUpdateItemStatus?: (planItemId: string, status: "target" | "pulled" | "listed") => void;
}

// Calculate realistic salvage yard pull price (Pick-n-Pull flat fee / core rate)
export const getEstimatedPullCost = (item: YardPlanItem): number => {
  const name = item.part.name.toLowerCase();
  const category = (item.part.category || "").toLowerCase();
  
  if (category.includes("sensor") || name.includes("sensor") || name.includes("relay") || name.includes("switch")) {
    return 16;
  }
  if (name.includes("ecu") || name.includes("ecm") || name.includes("computer") || name.includes("amplifier") || name.includes("cluster")) {
    return 32;
  }
  if (name.includes("throttle") || name.includes("alternator") || name.includes("starter")) {
    return 34;
  }
  if (name.includes("headlight") || name.includes("tail light") || name.includes("lamp")) {
    return 26;
  }
  if (name.includes("harness") || name.includes("wiring")) {
    return 24;
  }
  // Standard ~18% self-serve salvage yard fee, min $15
  return Math.max(15, Math.round(item.part.estValue * 0.18));
};

export default function YardPlanner({
  planItems,
  onRemoveItem,
  onClearPlan,
  onCreateListing,
  onUpdateItemValue,
  onUpdateItemStatus
}: YardPlannerProps) {
  // Track pulled items in yard
  const [pulledParts, setPulledParts] = useState<Record<string, boolean>>({});
  // Track packed tools in bag
  const [packedTools, setPackedTools] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);

  // Master unique tools list
  const masterTools = Array.from(
    new Set(planItems.flatMap((item) => item.part.toolsNeeded))
  ).sort();

  const totalEstRevenue = planItems.reduce((acc, item) => acc + item.part.estValue, 0);
  const totalPullCost = planItems.reduce((acc, item) => acc + getEstimatedPullCost(item), 0);
  const totalNetProfit = Math.max(0, totalEstRevenue - totalPullCost);
  const overallMarginPct = totalEstRevenue > 0 ? Math.round((totalNetProfit / totalEstRevenue) * 100) : 0;

  const harvestedRevenue = planItems
    .filter((item) => pulledParts[item.id])
    .reduce((acc, item) => acc + item.part.estValue, 0);

  const togglePulled = (id: string, currentStatus?: string) => {
    if (onUpdateItemStatus) {
      onUpdateItemStatus(id, currentStatus === "pulled" ? "target" : "pulled");
    } else {
      setPulledParts((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const toggleTool = (tool: string) => {
    setPackedTools((prev) => ({ ...prev, [tool]: !prev[tool] }));
  };

  const copyPlanText = () => {
    if (planItems.length === 0) return;
    const lines = [
      `=== SALVAGE YARD PULL PLAN ===`,
      `Total Projected Revenue: $${totalEstRevenue}`,
      `Total Parts: ${planItems.length}`,
      ``,
      `--- TARGET PARTS ---`,
      ...planItems.map(
        (item, i) =>
          `${i + 1}. [${item.chassisMake} ${item.chassisModel} (${item.chassisCode})] ${item.part.name} - $${item.part.estValue} (${item.part.difficulty})`
      ),
      ``,
      `--- TOOLBOX CHECKLIST ---`,
      ...masterTools.map((t) => `• ${t}`),
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportToPDF = () => {
    if (planItems.length === 0) return;

    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text(`Yard Pull Plan - ${new Date().toLocaleDateString()}`, 14, 22);
    
    const tableData = planItems.map(item => [
      "[  ]",
      `${item.chassisMake} ${item.chassisModel}`,
      item.part.name,
      item.part.toolsNeeded.join(", ")
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["Done", "Vehicle", "Target Part", "Required Tools"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [40, 40, 40] },
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 50 },
        2: { cellWidth: 50 },
        3: { cellWidth: "auto" }
      }
    });

    doc.save("yard_pull_plan.pdf");
  };

  const exportToCSV = () => {
    if (planItems.length === 0) return;

    const headers = [
      "Vehicle Make",
      "Vehicle Model",
      "Chassis Code",
      "Part Name",
      "Category",
      "Est Resale Value ($)",
      "Difficulty",
      "Status",
      "Tools Needed",
      "Extraction Guide",
      "Failure Mode & Demand"
    ];

    const escapeCsv = (str: string | number | undefined | null) => {
      if (str === undefined || str === null) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = planItems.map((item) => [
      escapeCsv(item.chassisMake),
      escapeCsv(item.chassisModel),
      escapeCsv(item.chassisCode),
      escapeCsv(item.part.name),
      escapeCsv(item.part.category || "OEM Part"),
      escapeCsv(item.part.estValue),
      escapeCsv(item.part.difficulty),
      escapeCsv(pulledParts[item.id] ? "Pulled" : "Pending"),
      escapeCsv(item.part.toolsNeeded.join(", ")),
      escapeCsv(item.part.extractionGuide || ""),
      escapeCsv(item.part.failureMode || "")
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const dateStr = new Date().toISOString().split("T")[0];
    link.setAttribute("download", `salvage-yard-pull-plan-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  if (planItems.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center max-w-2xl mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
          <ClipboardList className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Your Yard Pull Plan is Empty</h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-md mx-auto">
            Browse the vehicle catalog or search with AI to add high-profit fast-pull targets to your trip checklist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="yard-pull-plan-view" className="space-y-6 max-w-5xl mx-auto">
      {/* Top Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <span className="text-xs font-mono uppercase text-zinc-400 font-semibold block mb-1">
            Projected Revenue
          </span>
          <div className="text-3xl font-black text-amber-400 font-mono">
            ${totalEstRevenue.toLocaleString()}
          </div>
          {harvestedRevenue > 0 && (
            <span className="text-xs text-emerald-400 font-mono mt-1 block">
              ${harvestedRevenue} harvested so far
            </span>
          )}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <span className="text-xs font-mono uppercase text-zinc-400 font-semibold block mb-1 flex items-center justify-between">
            <span>Net Arbitrage Profit</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              {overallMarginPct}% Margin
            </span>
          </span>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            +${totalNetProfit.toLocaleString()}
          </div>
          <span className="text-xs text-zinc-400 font-mono mt-1 block">
            Est. Pull Cost: ~${totalPullCost}
          </span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <span className="text-xs font-mono uppercase text-zinc-400 font-semibold block mb-1">
            Target Parts
          </span>
          <div className="text-3xl font-black text-white font-mono">
            {planItems.length} <span className="text-base font-normal text-zinc-400">items</span>
          </div>
          <span className="text-xs text-zinc-400 font-mono mt-1 block">
            {Object.values(pulledParts).filter(Boolean).length} of {planItems.length} pulled
          </span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <span className="text-xs font-mono uppercase text-zinc-400 font-semibold block mb-1">
            Tools to Pack
          </span>
          <div className="text-3xl font-black text-blue-400 font-mono">
            {masterTools.length} <span className="text-base font-normal text-zinc-400">tools</span>
          </div>
          <span className="text-xs text-zinc-400 font-mono mt-1 block">
            {Object.values(packedTools).filter(Boolean).length} of {masterTools.length} packed in bag
          </span>
        </div>
      </div>

      {/* Real-time Yard Inventory Alert Monitor */}
      <YardInventoryAlerts
        planItems={planItems}
        onUpdateItemValue={onUpdateItemValue}
        onCreateListing={onCreateListing}
      />

      {/* Main Content Layout: Target Checklist + Toolbag */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Pull Checklist */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Salvage Yard Pull List</h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={exportToPDF}
                  className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors print:hidden"
                  title="Generate printer-friendly PDF checklist"
                >
                  <Printer className="w-3.5 h-3.5 text-blue-400" />
                  <span>Export PDF</span>
                </button>

                <button
                  type="button"
                  id="export-csv-btn"
                  onClick={exportToCSV}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors print:hidden"
                  title="Export target list to CSV for offline spreadsheets or printing"
                >
                  {exported ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>{exported ? "CSV Downloaded!" : "Export CSV"}</span>
                </button>

                <button
                  type="button"
                  onClick={copyPlanText}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors print:hidden"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy List"}</span>
                </button>

                <button
                  type="button"
                  onClick={onClearPlan}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-mono font-medium transition-colors print:hidden"
                >
                  Clear Plan
                </button>
              </div>
            </div>

            {/* List of items */}
            <div className="space-y-3">
              {planItems.map((item) => {
                const isPulled = item.status === "pulled" || item.status === "listed" || !!pulledParts[item.id];
                const pullCost = getEstimatedPullCost(item);
                const resaleVal = item.part.estValue;
                const netProfit = Math.max(0, resaleVal - pullCost);
                const marginPct = resaleVal > 0 ? Math.round((netProfit / resaleVal) * 100) : 0;
                const roiMultiplier = pullCost > 0 ? (resaleVal / pullCost).toFixed(1) : "0.0";

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col gap-3.5 ${
                      isPulled
                        ? "bg-emerald-950/20 border-emerald-500/30 opacity-75"
                        : "bg-zinc-950/80 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => togglePulled(item.id, item.status)}
                          className="mt-0.5 text-zinc-500 hover:text-amber-400 transition-colors shrink-0"
                        >
                          {isPulled ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-zinc-500" />
                          )}
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono font-bold text-amber-400">
                              {item.chassisMake} {item.chassisModel}
                            </span>
                            <span className="text-xs font-mono text-zinc-500">
                              ({item.chassisCode})
                            </span>
                            {item.status === "listed" && (
                              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30 font-bold ml-1">
                                ACTIVE LISTING
                              </span>
                            )}
                            {item.status === "sold" && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-bold ml-1">
                                SOLD
                              </span>
                            )}
                          </div>
                          <h4
                            className={`text-sm font-semibold text-zinc-100 mt-0.5 ${
                              isPulled ? "line-through text-zinc-400" : ""
                            }`}
                          >
                            {item.part.name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-zinc-400 font-mono">
                            <span className="text-emerald-400 font-bold">${item.part.estValue} Resale</span>
                            <span>•</span>
                            <span>{item.part.difficulty} pull</span>
                            <span>•</span>
                            <span>Tools: {item.part.toolsNeeded.join(", ")}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3 sm:mt-0 self-start sm:self-center shrink-0 w-full sm:w-auto">
                        {onCreateListing && (
                          <button
                            type="button"
                            onClick={() => onCreateListing(item)}
                            className="min-h-[44px] flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
                            title="Generate ready-to-post marketplace listings"
                          >
                            <Tag className="w-4 h-4 text-amber-400" />
                            <span>List for Sale</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-500 hover:text-red-400 p-2 rounded-xl hover:bg-zinc-800 border border-zinc-800 sm:border-transparent transition-colors"
                          title="Remove from plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Financial Progress Bar & Arbitrage Margin Breakdown */}
                    <div className="bg-zinc-900/90 rounded-lg p-2.5 border border-zinc-800/80 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-zinc-400">Profit Margin:</span>
                          <span className={`font-bold ${marginPct >= 75 ? "text-emerald-400" : marginPct >= 50 ? "text-amber-400" : "text-blue-400"}`}>
                            {marginPct}%
                          </span>
                          <span className="text-zinc-500 text-[10px]">({roiMultiplier}x ROI)</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                          <span className="text-zinc-500">Yard Core:</span>
                          <span className="text-zinc-300 font-semibold">${pullCost}</span>
                          <span className="text-zinc-600">→</span>
                          <span className="text-zinc-500">Resale:</span>
                          <span className="text-emerald-300 font-semibold">${resaleVal}</span>
                          <span className="text-zinc-600">|</span>
                          <span className="text-emerald-400 font-bold">+${netProfit} profit</span>
                        </div>
                      </div>

                      {/* Visual Margin Progress Bar */}
                      <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800 relative">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            marginPct >= 75
                              ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                              : marginPct >= 50
                              ? "bg-gradient-to-r from-amber-500 to-emerald-400"
                              : "bg-gradient-to-r from-blue-500 to-cyan-400"
                          }`}
                          style={{ width: `${Math.min(100, Math.max(8, marginPct))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Master Toolbag Checklist */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Wrench className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="font-bold text-white text-base">Tool Bag Checklist</h3>
                <p className="text-xs text-zinc-400">Everything needed for this trip</p>
              </div>
            </div>

            <div className="space-y-2">
              {masterTools.map((tool) => {
                const isPacked = !!packedTools[tool];
                return (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => toggleTool(tool)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between gap-3 text-xs font-mono transition-all ${
                      isPacked
                        ? "bg-blue-950/20 border-blue-500/40 text-blue-200"
                        : "bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isPacked ? (
                        <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-zinc-600 shrink-0" />
                      )}
                      <span className={isPacked ? "line-through opacity-80" : "font-medium"}>
                        {tool}
                      </span>
                    </div>
                    {isPacked && (
                      <span className="text-[10px] text-blue-400 font-bold uppercase">Packed</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800/80 text-xs text-zinc-400 space-y-1">
              <span className="font-bold text-zinc-300 font-mono block">Pro Yard Tip:</span>
              <p className="leading-relaxed">
                Pack a battery-powered 1/4" impact driver with standard socket adapters to cut your removal time in half.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
