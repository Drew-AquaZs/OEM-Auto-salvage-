import React, { useState } from "react";
import { Chassis, TargetPart } from "../types";
import { QuickGuideModal } from "./QuickGuideModal";
import { 
  Wrench, 
  CircleDollarSign, 
  AlertTriangle, 
  ArrowRightLeft, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Check, 
  Sparkles, 
  Zap, 
  Clock, 
  BookOpen, 
  ShieldAlert, 
  Tag 
} from "lucide-react";

interface ChassisCardProps {
  key?: React.Key;
  chassis: Chassis;
  onAddPart: (part: TargetPart) => void;
  onRemovePart: (partName: string) => void;
  isPartSelected: (partName: string) => boolean;
  selectedCategory?: string;
  selectedTool?: string;
  onCreateListing?: (chassis: Chassis, part: TargetPart) => void;
}

export default function ChassisCard({
  chassis,
  onAddPart,
  onRemovePart,
  isPartSelected,
  selectedCategory,
  selectedTool,
  onCreateListing,
}: ChassisCardProps) {
  // Track which part has its details expanded (null = none or index)
  const [expandedPart, setExpandedPart] = useState<string | null>(null);
  const [quickGuidePart, setQuickGuidePart] = useState<TargetPart | null>(null);

  const toggleExpand = (partName: string) => {
    setExpandedPart((prev) => (prev === partName ? null : partName));
  };

  const totalChassisValue = chassis.targetParts.reduce((sum, p) => sum + p.estValue, 0);

  const getOriginBadge = (origin: string) => {
    switch (origin) {
      case "Japanese":
        return {
          bg: "bg-red-500/10 border-red-500/30 text-red-300",
          flag: "🇯🇵",
          label: "Japanese JDM",
        };
      case "German":
        return {
          bg: "bg-blue-500/10 border-blue-500/30 text-blue-300",
          flag: "🇩🇪",
          label: "German Euro",
        };
      case "American":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
          flag: "🇺🇸",
          label: "American",
        };
      case "Swedish":
        return {
          bg: "bg-purple-500/10 border-purple-500/30 text-purple-300",
          flag: "🇸🇪",
          label: "Swedish",
        };
      default:
        return {
          bg: "bg-amber-500/10 border-amber-500/30 text-amber-300",
          flag: "🚗",
          label: origin,
        };
    }
  };

  const originInfo = getOriginBadge(chassis.origin);

  // Filter parts if category or tool filter is active
  const filteredParts = chassis.targetParts.filter((part) => {
    const categoryMatch =
      !selectedCategory || selectedCategory === "All" || part.category === selectedCategory;
    const toolMatch =
      !selectedTool ||
      selectedTool === "All" ||
      part.toolsNeeded.some((t) => t.toLowerCase() === selectedTool.toLowerCase());
    return categoryMatch && toolMatch;
  });

  const displayParts = filteredParts.length > 0 ? filteredParts : chassis.targetParts;

  return (
    <div
      id={`vehicle-card-${chassis.id}`}
      className="bg-zinc-900 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-lg hover:border-zinc-700/80 transition-all duration-200 flex flex-col justify-between"
    >
      {/* Vehicle Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-b from-zinc-850 to-zinc-900 border-b border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`text-xs font-mono font-medium px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${originInfo.bg}`}
              >
                <span>{originInfo.flag}</span>
                <span>{originInfo.label}</span>
              </span>
              <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800">
                Chassis: {chassis.chassisCode}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {chassis.make} <span className="text-amber-400">{chassis.model}</span>
            </h3>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              Model Years: {chassis.years.join(", ")}
            </p>
          </div>

          {/* Potential Total Valuation Pill */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 bg-zinc-950/90 border border-zinc-800 rounded-xl p-3 sm:p-2.5 sm:text-right">
            <div className="sm:text-right">
              <span className="text-[10px] text-zinc-400 uppercase font-mono font-semibold block">
                Max Potential
              </span>
              <span className="text-[10px] text-zinc-500 block font-mono">
                {chassis.targetParts.length} target parts
              </span>
            </div>
            <span className="text-xl sm:text-lg font-black text-emerald-400 font-mono">
              ${totalChassisValue.toLocaleString()}
            </span>
          </div>
        </div>

        {chassis.notes && (
          <p className="text-xs text-zinc-400 mt-3 pt-3 border-t border-zinc-800/60 leading-relaxed font-sans">
            <span className="text-zinc-300 font-semibold">Note: </span>
            {chassis.notes}
          </p>
        )}
      </div>

      {/* Target Parts List */}
      <div className="p-3.5 sm:p-4 space-y-3 flex-1">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-mono font-semibold px-1">
          <span>HIGH-VALUE TARGET PARTS</span>
          <span>{displayParts.length} AVAILABLE</span>
        </div>

        <div className="space-y-3">
          {displayParts.map((part) => {
            const isSelected = isPartSelected(part.name);
            const isExpanded = expandedPart === part.name;

            return (
              <div
                key={part.name}
                className={`rounded-xl border transition-all duration-150 overflow-hidden ${
                  isSelected
                    ? "bg-amber-950/20 border-amber-500/50 ring-1 ring-amber-500/20"
                    : "bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700"
                }`}
              >
                {/* Part Header & Action: Single-column flex on mobile, row on desktop */}
                <div className="p-3.5 sm:p-4 flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm sm:text-base font-semibold text-zinc-100 leading-snug">
                          {part.name}
                        </h4>
                        {part.category && (
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                            {part.category}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono">
                        <span className="text-emerald-400 font-bold text-base sm:text-sm">
                          ${part.estValue}
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-300 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-zinc-400" />
                          {part.difficulty === "Easy"
                            ? "Under 10 mins"
                            : part.difficulty === "Medium"
                            ? "10-20 mins"
                            : "20+ mins"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions (Toggle Plan, Quick Guide Pop-up, View Details, & Create Listing) - Large 44px+ touch targets on mobile */}
                  <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-end gap-2 pt-1 border-t border-zinc-850 sm:border-0 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => setQuickGuidePart(part)}
                      className="min-h-[44px] sm:min-h-[36px] px-3 py-2 rounded-xl text-xs font-semibold font-mono text-cyan-300 hover:text-cyan-200 bg-cyan-950/30 hover:bg-cyan-950/50 border border-cyan-500/40 active:bg-cyan-900/40 flex items-center justify-center gap-1.5 transition-colors touch-manipulation"
                      title="Open Gemini-tailored step-by-step extraction guide with tool-specific instructions and safety warnings"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Quick Guide</span>
                    </button>

                    {onCreateListing && (
                      <button
                        type="button"
                        onClick={() => onCreateListing(chassis, part)}
                        className="min-h-[44px] sm:min-h-[36px] px-3 py-2 rounded-xl text-xs font-semibold font-mono text-amber-300 hover:text-amber-200 bg-amber-950/30 hover:bg-amber-950/50 border border-amber-500/40 active:bg-amber-900/40 flex items-center justify-center gap-1.5 transition-colors touch-manipulation"
                        title="Generate ready-to-post marketplace listings"
                      >
                        <Tag className="w-3.5 h-3.5 text-amber-400" />
                        <span>List</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleExpand(part.name)}
                      className="min-h-[44px] sm:min-h-[36px] px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 active:bg-zinc-750 flex items-center justify-center gap-1.5 transition-colors touch-manipulation"
                      title="View inline extraction notes"
                    >
                      <span>{isExpanded ? "Hide Details" : "Details"}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-zinc-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-400" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        isSelected ? onRemovePart(part.name) : onAddPart(part)
                      }
                      className={`min-h-[44px] sm:min-h-[36px] px-3.5 py-2 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all shadow-sm touch-manipulation active:scale-[0.98] ${
                        isSelected
                          ? "bg-amber-500 text-zinc-950 hover:bg-amber-400 ring-2 ring-amber-500/30"
                          : "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 hover:text-white"
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>In Plan</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Collapsible Details Drawer */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-3 border-t border-zinc-800/80 bg-zinc-950 space-y-3.5 text-xs text-zinc-300 animate-fadeIn">
                    {/* Failure Mode & Demand */}
                    <div>
                      <span className="text-[11px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5 mb-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        Why Mechanics & Flippers Buy:
                      </span>
                      <p className="text-zinc-300 leading-relaxed bg-zinc-900/90 p-3 rounded-xl border border-zinc-800">
                        {part.failureMode}
                      </p>
                    </div>

                    {/* Interchange Compatibility */}
                    <div>
                      <span className="text-[11px] font-mono uppercase text-blue-400 font-bold flex items-center gap-1.5 mb-1.5">
                        <ArrowRightLeft className="w-3.5 h-3.5 text-blue-400" />
                        Interchange & Donor Fits:
                      </span>
                      <p className="text-zinc-300 font-mono text-[11px] leading-relaxed bg-zinc-900/90 p-3 rounded-xl border border-zinc-800">
                        {part.interchangeability}
                      </p>
                    </div>

                    {/* Tools Needed */}
                    <div>
                      <span className="text-[11px] font-mono uppercase text-zinc-400 font-bold flex items-center gap-1.5 mb-2">
                        <Wrench className="w-3.5 h-3.5 text-zinc-400" />
                        Required Pocket Tools:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {part.toolsNeeded.map((t) => (
                          <span
                            key={t}
                            className="bg-zinc-900 text-zinc-200 px-3 py-1.5 rounded-lg text-xs font-mono border border-zinc-750 inline-flex items-center"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Extraction Pro-Tip */}
                    <div className="bg-amber-500/10 border border-amber-500/25 p-3.5 rounded-xl space-y-1.5">
                      <span className="text-[11px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                        Salvage Yard Removal Tip:
                      </span>
                      <p className="text-zinc-200 leading-relaxed">{part.extractionGuide}</p>
                    </div>

                    {/* Rarity & Performance Modifiers */}
                    {(part.rarityModifier || part.perfModImpact) && (
                      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                        {part.rarityModifier && (
                          <div className="text-xs text-zinc-300 bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                            <span className="font-bold text-amber-400 font-mono text-[11px] mr-1 block sm:inline">
                              Rarity Bonus:
                            </span>
                            {part.rarityModifier}
                          </div>
                        )}
                        {part.perfModImpact && (
                          <div className="text-xs text-zinc-300 bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                            <span className="font-bold text-blue-400 font-mono text-[11px] mr-1 block sm:inline">
                              Resale Demand:
                            </span>
                            {part.perfModImpact}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Guide Pop-up Modal */}
      {quickGuidePart && (
        <QuickGuideModal
          part={quickGuidePart}
          chassis={chassis}
          isOpen={!!quickGuidePart}
          onClose={() => setQuickGuidePart(null)}
          onAddToPlan={() => {
            if (!isPartSelected(quickGuidePart.name)) {
              onAddPart(quickGuidePart);
            }
          }}
          isInPlan={isPartSelected(quickGuidePart.name)}
        />
      )}
    </div>
  );
}
