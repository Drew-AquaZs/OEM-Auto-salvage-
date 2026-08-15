import React, { useState, useEffect } from "react";
import { TrendingPartInsight, TargetPart, Chassis } from "../types";
import { 
  Flame, 
  Search, 
  ExternalLink, 
  Clock, 
  TrendingUp, 
  MessageSquare, 
  Sparkles, 
  Plus, 
  Check, 
  Tag, 
  DollarSign, 
  AlertCircle,
  RefreshCw,
  Globe,
  Radio
} from "lucide-react";

interface MarketInsightsSectionProps {
  onAddPartToPlan?: (chassis: Partial<Chassis>, part: TargetPart) => void;
  onCreateListing?: (chassis: Chassis, part: TargetPart) => void;
  isPartInPlan?: (partName: string) => boolean;
}

const FORUM_SEGMENTS = [
  { id: "JDM / Japanese Enthusiast", label: "JDM / Japanese", desc: "Honda K-Series, Nissan Silvia/Z, Subaru WRX, Lexus IS" },
  { id: "Euro / BMW & VAG", label: "Euro / BMW & VAG", desc: "BMW E46/E90/E39, Audi/VW 1.8T/2.0T, Mercedes W203/W211" },
  { id: "American Muscle / LS Truck", label: "American LS & Trucks", desc: "GM GMT800 4.8/5.3/6.0, Ford Foxbody/Modular 4.6, Dodge Hemi" },
  { id: "All Platforms / Universal Flips", label: "All Universal Flips", desc: "Highest margin sensors, modules & mechanical swaps across all makes" }
];

export function MarketInsightsSection({ onAddPartToPlan, onCreateListing, isPartInPlan }: MarketInsightsSectionProps) {
  const [selectedSegment, setSelectedSegment] = useState(FORUM_SEGMENTS[0].id);
  const [customSearch, setCustomSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<TrendingPartInsight[]>([]);
  const [sources, setSources] = useState<Array<{ title: string; url: string }>>([]);
  const [searchedAt, setSearchedAt] = useState<string | null>(null);
  const [addedPartNames, setAddedPartNames] = useState<Record<string, boolean>>({});

  const fetchInsights = async (segment: string, query?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/gemini/market-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ segment, customQuery: query || undefined }),
      });

      const contentType = response.headers.get("content-type") || "";
      if (response.ok && contentType.includes("application/json")) {
        const json = await response.json();
        if (json.success && json.data) {
          setInsights(json.data.trendingParts || []);
          setSources(json.data.sources || []);
          setSearchedAt(json.data.searchedAt || new Date().toISOString());
        } else {
          throw new Error(json.error || "Failed to fetch market insights");
        }
      } else {
        throw new Error("Temporary service communication blip. Please retry.");
      }
    } catch (err: any) {
      setError(err.message || "Network error fetching trending parts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights(selectedSegment);
  }, [selectedSegment]);

  const handleCustomSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSearch.trim()) return;
    fetchInsights(selectedSegment, customSearch.trim());
  };

  const handleAddToPlan = (item: TrendingPartInsight) => {
    if (!onAddPartToPlan) return;

    // Construct mock chassis & part
    const targetPart: TargetPart = {
      name: item.partName,
      estValue: item.estResaleValue,
      toolsNeeded: ["10mm Socket", "12mm Socket", "Trim Tool", "Wire Cutters"],
      failureMode: item.demandDriver,
      interchangeability: `Compatible with ${item.vehicleChassis} and related swap platforms.`,
      extractionGuide: `Extract from ${item.vehicleChassis}. Check electrical pins and mounting clips.`,
      difficulty: "Medium",
      category: item.category,
      rarityModifier: `Trending +${item.priceTrendPct}% on enthusiast forums.`
    };

    const chassisInfo: Partial<Chassis> = {
      id: `trending-${item.rank}-${Date.now()}`,
      make: item.vehicleChassis.split(" ")[1] || "OEM",
      model: item.vehicleChassis.split(" ").slice(2).join(" ") || "Vehicle",
      chassisCode: item.vehicleChassis.match(/\[(.*?)\]/)?.[1] || "OEM",
      years: [2005],
      origin: "Japanese",
      targetParts: [targetPart]
    };

    onAddPartToPlan(chassisInfo, targetPart);
    setAddedPartNames((prev) => ({ ...prev, [item.partName]: true }));
  };

  const handleCreateListingClick = (item: TrendingPartInsight) => {
    if (!onCreateListing) return;

    const targetPart: TargetPart = {
      name: item.partName,
      estValue: item.estResaleValue,
      toolsNeeded: ["10mm Socket", "12mm Socket", "Trim Tool"],
      failureMode: item.demandDriver,
      interchangeability: `High demand on ${item.forumsDiscussing.join(", ")}`,
      extractionGuide: "OEM Salvage Pull",
      difficulty: "Medium",
      category: item.category
    };

    const chassisObj: Chassis = {
      id: `trending-list-${item.rank}`,
      make: item.vehicleChassis.split(" ")[1] || "OEM",
      model: item.vehicleChassis.split(" ").slice(2).join(" ") || "Vehicle",
      chassisCode: item.vehicleChassis.match(/\[(.*?)\]/)?.[1] || "OEM",
      years: [2005],
      origin: "Japanese",
      difficultyRating: 2,
      notes: item.demandDriver,
      targetParts: [targetPart]
    };

    onCreateListing(chassisObj, targetPart);
  };

  return (
    <div className="space-y-6" id="market-insights-container">
      {/* Search & Segment Header */}
      <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Flame className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Live Enthusiast Forum Trends & Demand Grounding
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Real-time Google search grounding across major car forums (Zilvia, ClubLexus, Bimmerpost, LS1Tech, CivicX, Reddit r/ProjectCar) to identify the top 5 highest-demand salvage yard flips.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-[11px] font-mono text-emerald-400 font-bold">
              <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
              <span>Search Grounded</span>
            </span>
            <button
              type="button"
              onClick={() => fetchInsights(selectedSegment, customSearch || undefined)}
              disabled={loading}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors disabled:opacity-50"
              title="Refresh trends"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-amber-400" : ""}`} />
            </button>
          </div>
        </div>

        {/* Segment Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2">
          {FORUM_SEGMENTS.map((seg) => {
            const isActive = selectedSegment === seg.id && !customSearch;
            return (
              <button
                key={seg.id}
                type="button"
                onClick={() => {
                  setCustomSearch("");
                  setSelectedSegment(seg.id);
                }}
                className={`p-3 rounded-xl text-left transition-all border font-mono ${
                  isActive
                    ? "bg-amber-500/10 border-amber-500/50 text-white shadow-lg shadow-amber-500/5"
                    : "bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${isActive ? "text-amber-400" : "text-zinc-300"}`}>
                    {seg.label}
                  </span>
                  {isActive && <Flame className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <p className="text-[10px] text-zinc-500 line-clamp-1">{seg.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Custom Grounded Search Form */}
        <form onSubmit={handleCustomSearchSubmit} className="flex gap-2 pt-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={customSearch}
              onChange={(e) => setCustomSearch(e.target.value)}
              placeholder="Or search specific query, e.g. 'Toyota Supra MK4 2JZ sensors' or 'Foxbody Mustang 5.0 harness'..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/60"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !customSearch.trim()}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs font-mono rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Search Forums</span>
          </button>
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 flex items-center gap-3 text-red-300 text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col items-center justify-center py-16 text-center space-y-3">
            <div className="w-10 h-10 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-white font-mono">Grounding live search with Google Gemini...</p>
              <p className="text-xs text-zinc-500">Scanning automotive enthusiast forums, build threads, and classifieds</p>
            </div>
          </div>
        </div>
      ) : (
        /* Top 5 Trending Parts Cards */
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Top 5 Trending Flips by Forum Demand</span>
            </h4>
            {searchedAt && (
              <span className="text-[10px] text-zinc-500 font-mono">
                Updated: {new Date(searchedAt).toLocaleTimeString()}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {insights.map((item) => {
              const inPlan = isPartInPlan ? isPartInPlan(item.partName) : addedPartNames[item.partName];

              return (
                <div
                  key={item.rank}
                  className="bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700/80 rounded-2xl p-5 transition-all shadow-md group relative overflow-hidden"
                >
                  {/* Top Rank Badge */}
                  <div className="absolute top-0 left-0">
                    <div className="bg-amber-500 text-zinc-950 text-[11px] font-mono font-black px-3 py-1 rounded-br-xl flex items-center gap-1 shadow-sm">
                      <span>#{item.rank} TRENDING</span>
                      {item.rank === 1 && <Flame className="w-3.5 h-3.5 fill-current" />}
                    </div>
                  </div>

                  <div className="pt-3 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Main Details */}
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                          {item.partName}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px] font-mono font-medium">
                          {item.vehicleChassis}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold">
                          {item.category}
                        </span>
                      </div>

                      {/* Demand Driver */}
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        <strong className="text-amber-400 font-mono">Why It's Trending: </strong>
                        {item.demandDriver}
                      </p>

                      {/* Forum Badges & Tags */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800/80">
                          <MessageSquare className="w-3 h-3 text-cyan-400" />
                          <span className="text-zinc-500">Active On:</span>
                          <span className="text-zinc-200 font-medium">
                            {item.forumsDiscussing?.join(", ") || "Enthusiast Classifieds"}
                          </span>
                        </div>

                        {item.searchKeywords && item.searchKeywords.slice(0, 3).map((kw, i) => (
                          <span key={i} className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right: Valuation, Velocity & Actions */}
                    <div className="flex sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-zinc-800">
                      <div className="text-left lg:text-right">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-emerald-400 font-mono">
                            ${item.estResaleValue}
                          </span>
                          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            +{item.priceTrendPct}% Surge
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono mt-0.5 justify-start lg:justify-end">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          <span>Velocity: {item.daysToSell}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {onCreateListing && (
                          <button
                            type="button"
                            onClick={() => handleCreateListingClick(item)}
                            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors border border-zinc-700"
                            title="Generate instant marketplace listing for this part"
                          >
                            <Tag className="w-3.5 h-3.5 text-amber-400" />
                            <span>List</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleAddToPlan(item)}
                          disabled={inPlan}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
                            inPlan
                              ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 cursor-default"
                              : "bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md"
                          }`}
                        >
                          {inPlan ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>In Pull Plan</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add to Plan</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grounding Source Citations */}
          {sources.length > 0 && (
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-400">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Google Search Grounding Sources & Reference Links</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-mono text-zinc-400 hover:text-amber-300 transition-colors"
                  >
                    <span>{src.title}</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
