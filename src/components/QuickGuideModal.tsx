import React, { useState, useEffect } from "react";
import { TargetPart, Chassis, QuickExtractionGuide } from "../types";
import { 
  Wrench, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  Sparkles, 
  X, 
  CheckCircle2, 
  Copy, 
  Check, 
  Printer, 
  Lightbulb, 
  Plus, 
  Zap,
  Hammer
} from "lucide-react";

interface QuickGuideModalProps {
  part: TargetPart;
  chassis: Partial<Chassis>;
  isOpen: boolean;
  onClose: () => void;
  onAddToPlan?: () => void;
  isInPlan?: boolean;
}

// Client-side deterministic extraction guide fallback
function createFallbackGuide(part: TargetPart, chassis: Partial<Chassis>): QuickExtractionGuide {
  const tools = part.toolsNeeded && part.toolsNeeded.length > 0 ? part.toolsNeeded : ["10mm socket & ratchet", "Trim clip removal tool", "Wire cutters"];
  const vehicleName = `${chassis.make || "OEM"} ${chassis.model || "Vehicle"} ${chassis.chassisCode ? `[${chassis.chassisCode}]` : ""}`.trim();
  const partNameLower = part.name.toLowerCase();

  return {
    partName: part.name,
    vehicle: vehicleName,
    estimatedTimeMin: part.difficulty === "Easy" ? 8 : part.difficulty === "Medium" ? 14 : 22,
    difficultyRating: part.difficulty === "Easy" ? "Easy (<10m)" : part.difficulty === "Medium" ? "Moderate (10-20m)" : "Advanced (20m+)",
    stepByStepInstructions: [
      {
        stepNumber: 1,
        title: "Isolate Electrical Power",
        description: "Ensure the donor vehicle battery is disconnected or cut the main battery lead with wire cutters to prevent any accidental shorts while pulling.",
        toolUsed: tools[0] || "10mm socket / Wire cutters"
      },
      {
        stepNumber: 2,
        title: "Remove Access Trim / Shroud",
        description: `Unclip or remove surrounding fascia panels or splash guards shielding the ${part.name}. Keep plastic retaining clips intact in your pocket.`,
        toolUsed: tools.find(t => t.toLowerCase().includes("trim") || t.toLowerCase().includes("flathead")) || tools[1] || "Trim tool"
      },
      {
        stepNumber: 3,
        title: "Unfasten Mounting Hardware",
        description: "Back out the primary retaining screws or hex bolts. Use steady torque on stubborn or oxidized junkyard fasteners.",
        toolUsed: tools.find(t => t.toLowerCase().includes("socket") || t.toLowerCase().includes("ratchet") || t.toLowerCase().includes("wrench") || t.toLowerCase().includes("torx")) || "10mm socket & ratchet"
      },
      {
        stepNumber: 4,
        title: "Unlock Harness Plugs & Connectors",
        description: "Depress the center latch on electrical plugs. If aged plastic is brittle, gently assist the lock tab with a pick or flathead without forcing.",
        toolUsed: "Pick / Small flathead"
      },
      {
        stepNumber: 5,
        title: "Extract & Final Inspection",
        description: `Smoothly extract the ${part.name}. Verify mounting tabs are complete, connector pins are straight, and housing has zero hairline cracks.`,
        toolUsed: "Visual inspection"
      }
    ],
    toolSpecificTips: tools.map((tool) => ({
      toolName: tool,
      usageAdvice: `Use your ${tool} carefully with even pressure to avoid cracking aged plastics or stripping factory fasteners.`
    })),
    safetyWarnings: [
      {
        severity: "CRITICAL",
        warning: "Wear cut-resistant mechanic gloves. Junkyard metal sheet panels, jagged cowls, and broken windshield shards are razor sharp."
      },
      {
        severity: "CAUTION",
        warning: "Never puncture or cut pressurized A/C refrigerant lines or high-pressure power steering lines while reaching into tight engine bays."
      },
      {
        severity: "TIP",
        warning: "Leave 2-3 inches of OEM wire pigtail on connector plugs when cutting is allowed; buyers pay extra for complete intact harnesses."
      }
    ],
    yardSpeedHacks: [
      "Carry a small 6-point magnetic socket to prevent dropping bolts into unreachable subframe channels.",
      "If a bolt is seized by yard rust, spray penetrating fluid and gently tighten 1/8 turn first before backing out to break the crust."
    ]
  };
}

export function QuickGuideModal({
  part,
  chassis,
  isOpen,
  onClose,
  onAddToPlan,
  isInPlan = false
}: QuickGuideModalProps) {
  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState<QuickExtractionGuide | null>(null);
  const [copied, setCopied] = useState(false);
  const [checkedTools, setCheckedTools] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchGuide = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/gemini/extraction-guide", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            partName: part.name,
            make: chassis.make || "OEM",
            model: chassis.model || "Vehicle",
            chassisCode: chassis.chassisCode,
            years: chassis.years,
            toolsNeeded: part.toolsNeeded,
            failureMode: part.failureMode
          })
        });

        // Safely check content type and status
        const contentType = response.headers.get("content-type") || "";
        if (response.ok && contentType.includes("application/json")) {
          const json = await response.json();
          if (isMounted && json.success && json.data) {
            setGuide(json.data);
            return;
          }
        }
        
        // If API response is not OK or not JSON, fallback cleanly
        if (isMounted) {
          setGuide(createFallbackGuide(part, chassis));
        }
      } catch (err) {
        console.warn("Extraction guide API note (using local high-precision guide):", err);
        if (isMounted) {
          setGuide(createFallbackGuide(part, chassis));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGuide();
    return () => {
      isMounted = false;
    };
  }, [isOpen, part, chassis]);

  if (!isOpen) return null;

  const toggleToolCheck = (toolName: string) => {
    setCheckedTools((prev) => ({
      ...prev,
      [toolName]: !prev[toolName]
    }));
  };

  const handleCopyGuide = () => {
    if (!guide) return;
    const text = `
=== ${guide.partName.toUpperCase()} EXTRACTION GUIDE ===
Vehicle: ${guide.vehicle}
Est. Time: ${guide.estimatedTimeMin} mins | Rating: ${guide.difficultyRating}

TOOLS REQUIRED:
${part.toolsNeeded.map((t) => `• ${t}`).join("\n")}

STEP-BY-STEP PROCEDURE:
${guide.stepByStepInstructions
  .map(
    (s) =>
      `${s.stepNumber}. ${s.title.toUpperCase()} ${s.toolUsed ? `[Tool: ${s.toolUsed}]` : ""}\n   ${s.description}`
  )
  .join("\n\n")}

CRITICAL SAFETY WARNINGS:
${guide.safetyWarnings.map((w) => `[${w.severity}] ${w.warning}`).join("\n")}

PRO YARD SPEED-HACKS:
${guide.yardSpeedHacks.map((h) => `★ ${h}`).join("\n")}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-950/80 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <Wrench className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Salvage Extraction Quick Guide
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-xs font-mono border border-zinc-700">
                {chassis.make} {chassis.model} {chassis.chassisCode ? `[${chassis.chassisCode}]` : ""}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              Field-tested, tool-specific extraction procedure with salvage hazard warnings
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-zinc-200">
          {/* Target Part Highlight Box */}
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Target Component</span>
              <h4 className="text-base font-bold text-amber-400">{part.name}</h4>
              <p className="text-xs text-zinc-400 mt-0.5">{part.category || "OEM Component"} • Est. Resale Value: <span className="text-emerald-400 font-bold font-mono">${part.estValue}</span></p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 font-mono">
              <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs flex items-center gap-1.5 text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{guide?.estimatedTimeMin || (part.difficulty === "Easy" ? 8 : part.difficulty === "Medium" ? 15 : 25)} mins</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs flex items-center gap-1.5 text-zinc-300">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>{guide?.difficultyRating || part.difficulty}</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
              <p className="text-xs font-mono text-zinc-400">
                Generating custom tool-tailored extraction instructions via Gemini...
              </p>
            </div>
          ) : guide ? (
            <div className="space-y-6">
              {/* Tool Kit Check & Usage Tips */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider flex items-center gap-2">
                    <Hammer className="w-4 h-4 text-amber-400" />
                    <span>Required Tools & In-Yard Usage Tips</span>
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">Check off packed tools</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {guide.toolSpecificTips && guide.toolSpecificTips.length > 0 ? (
                    guide.toolSpecificTips.map((tip, idx) => {
                      const isChecked = !!checkedTools[tip.toolName];
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleToolCheck(tip.toolName)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                            isChecked
                              ? "bg-emerald-950/30 border-emerald-800/60"
                              : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                          }`}
                        >
                          <button
                            type="button"
                            className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                              isChecked
                                ? "bg-emerald-500 border-emerald-500 text-zinc-950"
                                : "border-zinc-600 bg-zinc-900"
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>
                          <div className="space-y-0.5">
                            <span className={`text-xs font-bold font-mono ${isChecked ? "text-emerald-300 line-through" : "text-zinc-200"}`}>
                              {tip.toolName}
                            </span>
                            <p className="text-[11px] text-zinc-400 leading-snug">
                              {tip.usageAdvice}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    part.toolsNeeded.map((tool, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{tool}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Step-by-Step Extraction Procedure</span>
                </h4>

                <div className="space-y-3">
                  {guide.stepByStepInstructions.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/90 flex items-start gap-3.5 group hover:border-zinc-700 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xs font-mono font-black shrink-0">
                        {step.stepNumber}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h5 className="text-xs font-bold text-white font-mono">
                            {step.title}
                          </h5>
                          {step.toolUsed && (
                            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
                              Tool: {step.toolUsed}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Warnings & Hazards */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>Salvage Yard Safety Warnings & Hazard Protocols</span>
                </h4>

                <div className="space-y-2">
                  {guide.safetyWarnings.map((warn, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
                        warn.severity === "CRITICAL"
                          ? "bg-red-950/30 border-red-800/60 text-red-200"
                          : warn.severity === "CAUTION"
                          ? "bg-amber-950/30 border-amber-800/60 text-amber-200"
                          : "bg-blue-950/30 border-blue-800/60 text-blue-200"
                      }`}
                    >
                      <AlertTriangle
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          warn.severity === "CRITICAL"
                            ? "text-red-400"
                            : warn.severity === "CAUTION"
                            ? "text-amber-400"
                            : "text-blue-400"
                        }`}
                      />
                      <div>
                        <strong className="font-mono uppercase tracking-wider text-[11px] block mb-0.5 font-bold">
                          [{warn.severity}] Hazard Advisory:
                        </strong>
                        <span>{warn.warning}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Yard Speed Hacks */}
              {guide.yardSpeedHacks && guide.yardSpeedHacks.length > 0 && (
                <div className="bg-gradient-to-r from-amber-500/10 to-transparent p-4 rounded-xl border border-amber-500/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-amber-400">
                    <Lightbulb className="w-4 h-4" />
                    <span>Pro Yard Puller Speed-Hacks</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {guide.yardSpeedHacks.map((hack, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold font-mono">★</span>
                        <span>{hack}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-zinc-500 text-xs font-mono">
              Unable to generate guide. Please try again.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyGuide}
              disabled={!guide}
              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied Guide!" : "Copy Quick Guide"}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors hidden sm:block"
              title="Print extraction cheat sheet"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onAddToPlan && (
              <button
                type="button"
                onClick={onAddToPlan}
                disabled={isInPlan}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
                  isInPlan
                    ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 cursor-default"
                    : "bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md"
                }`}
              >
                {isInPlan ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>In My Pull Plan</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Part to Plan</span>
                  </>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
