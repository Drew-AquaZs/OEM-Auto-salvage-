import React, { useState } from "react";
import { Sparkles, Loader2, AlertCircle, Check, Copy, ArrowRight, Tag, MapPin, DollarSign, Plus } from "lucide-react";
import { Chassis } from "../types";

interface YardDropParserSectionProps {
  knownChassis: Chassis[];
  onAddParsedTarget?: (target: {
    name: string;
    estValue: number;
    toolsNeeded: string[];
    failureMode: string[];
    origin: string;
    cleanVehicleName: string;
    yardRow: string;
  }) => void;
}

interface ParsedDropResult {
  Yard_Row: string;
  Clean_Vehicle_Name: string;
  Actionable_Hit: boolean;
  Part_To_Pull: string;
  Estimated_Profit: number;
}

export default function YardDropParserSection({
  knownChassis,
  onAddParsedTarget,
}: YardDropParserSectionProps) {
  const [rawString, setRawString] = useState("07 NISS MAXM BRN Row 14");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ParsedDropResult | null>(null);
  const [saved, setSaved] = useState(false);

  const sampleDrops = [
    "07 NISS MAXM BRN Row 14",
    "02 TOY SUPRA BLUE ROW 7",
    "BMW e46 m3 slvr row 22",
    "05 NISS SKYLINE BNR34 SPec R-11",
    "99 Benz E55 blk row3",
  ];

  const handleParse = async (inputStr: string) => {
    if (!inputStr.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setSaved(false);

    try {
      const response = await fetch("/api/gemini/parse-drop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawString: inputStr,
          knownChassis: knownChassis,
        }),
      });

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.error || "Failed to decode the inventory string.");
      }

      setResult(resData.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to parse the yard drop payload.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToChecklist = () => {
    if (!result || !onAddParsedTarget) return;

    onAddParsedTarget({
      name: result.Part_To_Pull,
      estValue: result.Estimated_Profit,
      toolsNeeded: ["10mm Socket & Ratchet", "Screwdriver"],
      failureMode: ["Extracted via yard inventory scanner."],
      origin:
        result.Clean_Vehicle_Name.toLowerCase().includes("nissan") ||
        result.Clean_Vehicle_Name.toLowerCase().includes("toyota")
          ? "Japanese"
          : "German",
      cleanVehicleName: result.Clean_Vehicle_Name,
      yardRow: result.Yard_Row,
    });

    setSaved(true);
  };

  return (
    <div
      id="yard-drop-scanner"
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6"
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Tag className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-bold text-white">Junkyard Inventory Code Scanner</h3>
        </div>
        <p className="text-sm text-zinc-400">
          Paste abbreviated yard text (e.g., from Pick-n-Pull, LKQ, or yard drop alerts) to instantly decode vehicle, row number, and target parts to pull.
        </p>
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleParse(rawString);
        }}
        className="flex flex-col sm:flex-row gap-2.5"
      >
        <input
          type="text"
          value={rawString}
          onChange={(e) => setRawString(e.target.value)}
          placeholder="e.g. 07 NISS MAXM BRN Row 14"
          className="flex-1 px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
        />
        <button
          type="submit"
          disabled={loading || !rawString.trim()}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Decoding...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Decode Row</span>
            </>
          )}
        </button>
      </form>

      {/* Quick Samples */}
      <div>
        <span className="text-xs font-mono uppercase text-zinc-500 font-semibold block mb-2">
          Sample Drops:
        </span>
        <div className="flex flex-wrap gap-2">
          {sampleDrops.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setRawString(s);
                handleParse(s);
              }}
              className="text-xs bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded-lg border border-zinc-800 font-mono transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-bold">
                <MapPin className="w-3.5 h-3.5" />
                <span>LOCATION: {result.Yard_Row || "Unspecified Row"}</span>
              </div>
              <h4 className="text-lg font-bold text-white mt-1">
                {result.Clean_Vehicle_Name}
              </h4>
            </div>

            {onAddParsedTarget && (
              <button
                type="button"
                onClick={handleAddToChecklist}
                disabled={saved}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all shrink-0 ${
                  saved
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-md"
                }`}
              >
                {saved ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Plan & Catalog</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to Yard Plan</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-800">
              <span className="text-[11px] uppercase font-mono text-zinc-400 font-semibold block mb-1">
                Recommended Target Part:
              </span>
              <span className="text-sm font-bold text-zinc-100">{result.Part_To_Pull}</span>
            </div>

            <div className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-800">
              <span className="text-[11px] uppercase font-mono text-zinc-400 font-semibold block mb-1">
                Estimated Value:
              </span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                ${result.Estimated_Profit}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
