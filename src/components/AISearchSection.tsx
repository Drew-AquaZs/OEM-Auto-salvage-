import React, { useState } from "react";
import { BrainCircuit, Search, Loader2, Sparkles, AlertCircle, Plus, Check, MapPin, ArrowRightLeft, Wrench, ShieldAlert } from "lucide-react";
import { AISearchResult, Chassis } from "../types";

interface AISearchSectionProps {
  onImportChassis: (chassis: Chassis) => void;
}

export default function AISearchSection({ onImportChassis }: AISearchSectionProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AISearchResult | null>(null);
  const [imported, setImported] = useState(false);

  // Suggested Quick Searches
  const suggestions = [
    { label: "2007 Nissan Maxima (A34 3.5L)", icon: "🇯🇵" },
    { label: "2004 BMW M3 (E46 S54)", icon: "🇩🇪" },
    { label: "2005 Lexus GS300 (2JZ-GE)", icon: "🇯🇵" },
    { label: "2008 Mercedes E55/E63 (W211)", icon: "🇩🇪" },
    { label: "2003 Honda S2000 (AP1/AP2)", icon: "🇯🇵" },
    { label: "2006 Audi S4 (B7 4.2L V8)", icon: "🇩🇪" },
  ];

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setImported(false);

    try {
      const response = await fetch("/api/gemini/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.error || "Failed to retrieve salvage data for this vehicle.");
      }

      setResult(resData.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect to the vehicle analysis service.");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    if (!result) return;

    const make = result.Make?.[0] || "Custom";
    const model = result.Model?.[0] || query || "Model";
    const years = result.Years || [2006];
    const chassisId = `ai-${make.toLowerCase()}-${model.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}-${Date.now().toString().slice(-4)}`;

    const partsArray = (result.Target_Parts || []).map((partName, index) => {
      const tools = result.Required_Tools || ["10mm Socket", "Phillips Screwdriver"];
      const val = result.Est_Value?.[index] || 175;
      const failure = result.failure_reasons?.[index] || "High wear-and-tear mechanical failure causing frequent replacement demand.";
      const interchange = result.interchangeability?.[index] || "Direct matching platform series.";
      const guide = result.extraction_guides?.[index] || "Disconnect electronic plug and unbolt mounting fasteners.";

      return {
        name: partName,
        estValue: val,
        toolsNeeded: index === 0 ? tools.slice(0, 3) : index === 1 ? tools.slice(2, 5) : tools.slice(1, 4),
        failureMode: failure,
        interchangeability: interchange,
        extractionGuide: guide,
        difficulty: val > 280 ? ("Medium" as const) : ("Easy" as const),
      };
    });

    const isGerman = ["bmw", "mercedes", "audi", "vw", "porsche"].some((brand) =>
      make.toLowerCase().includes(brand)
    );
    const isAmerican = ["ford", "chevy", "chevrolet", "dodge", "chrysler", "jeep", "gm"].some((brand) =>
      make.toLowerCase().includes(brand)
    );
    const isSwedish = ["volvo", "saab"].some((brand) => make.toLowerCase().includes(brand));

    const origin = isGerman ? "German" : isAmerican ? "American" : isSwedish ? "Swedish" : "Japanese";

    const newChassis: Chassis = {
      id: chassisId,
      make: make,
      model: model,
      chassisCode: query.toUpperCase().split(" ").slice(-1)[0] || "SPEC",
      years: years,
      origin: origin as any,
      difficultyRating: 2,
      notes: (result as any).notes || "AI-generated salvage profile with instant fast-pull targets.",
      targetParts: partsArray.slice(0, 4),
    };

    onImportChassis(newChassis);
    setImported(true);
  };

  return (
    <div id="ai-vehicle-lookup" className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white">Instant AI Vehicle Salvage Lookup</h3>
        </div>
        <p className="text-sm text-zinc-400">
          Enter any year, make, model, or engine to instantly generate top 3-4 high-demand fast-pull parts, price valuations, and required tools.
        </p>
      </div>

      {/* Search Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(query);
        }}
        className="flex flex-col sm:flex-row gap-2.5"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. 2007 Nissan Maxima, 2004 BMW 330i, 2006 Subaru Forester XT..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-sans"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Car...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Scan Vehicle</span>
            </>
          )}
        </button>
      </form>

      {/* Suggested Quick Searches */}
      <div>
        <span className="text-xs font-mono uppercase text-zinc-500 font-semibold block mb-2">
          Popular Examples:
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => {
                setQuery(s.label);
                handleSearch(s.label);
              }}
              className="text-xs bg-zinc-950 hover:bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors flex items-center gap-1.5"
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <span>ANALYSIS COMPLETE</span>
                <span>•</span>
                <span>{(result.Years || []).join(", ")}</span>
              </div>
              <h4 className="text-xl font-bold text-white mt-0.5">
                {(result.Make || []).join(" ")} {(result.Model || []).join(" ")}
              </h4>
            </div>

            <button
              type="button"
              onClick={handleImport}
              disabled={imported}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all shrink-0 ${
                imported
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md"
              }`}
            >
              {imported ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Vehicle Catalog</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Save into Vehicle Catalog</span>
                </>
              )}
            </button>
          </div>

          {/* Parts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(result.Target_Parts || []).map((partName, idx) => {
              const val = result.Est_Value?.[idx] || 150;
              const reason = result.failure_reasons?.[idx] || "Common wear failure";
              const interchange = result.interchangeability?.[idx] || "Direct matching series";
              const guide = result.extraction_guides?.[idx];

              return (
                <div
                  key={idx}
                  className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
                      <span>Target #{idx + 1}</span>
                      <span className="text-emerald-400 font-bold text-sm">${val}</span>
                    </div>
                    <h5 className="font-semibold text-zinc-100 text-sm">{partName}</h5>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{reason}</p>
                  </div>

                  {interchange && (
                    <div className="text-[11px] text-blue-300/90 bg-blue-500/10 p-2 rounded border border-blue-500/20 font-mono">
                      {interchange}
                    </div>
                  )}

                  {guide && (
                    <div className="text-[11px] text-zinc-400 bg-zinc-950 p-2 rounded border border-zinc-800/80">
                      <span className="text-amber-400 font-semibold block font-mono">Removal:</span>
                      {guide}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Tools needed footer */}
          {result.Required_Tools && result.Required_Tools.length > 0 && (
            <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono uppercase text-zinc-400 font-bold flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5 text-zinc-400" />
                Suggested Toolkit:
              </span>
              {result.Required_Tools.map((t) => (
                <span
                  key={t}
                  className="text-xs bg-zinc-900 text-zinc-300 px-2.5 py-1 rounded-md border border-zinc-800 font-mono"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
