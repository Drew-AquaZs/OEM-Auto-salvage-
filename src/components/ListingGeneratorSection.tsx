import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  Sparkles, 
  Copy, 
  Check, 
  DollarSign, 
  ShieldAlert, 
  Tag, 
  Camera, 
  Truck, 
  Flame, 
  FileText, 
  ArrowUpRight, 
  RefreshCw, 
  Car, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Download,
  Trash2,
  Bookmark,
  Image as ImageIcon,
  Wand2,
  SlidersHorizontal,
  Eye,
  ShieldCheck
} from "lucide-react";
import { Chassis, TargetPart, GeneratedListing, ListingRequestParams } from "../types";

export const GENERIC_PART_PRESETS = [
  { id: "alternator", label: "Alternator", icon: "⚡", desc: "OEM High Output Alternator / Stator" },
  { id: "headlight", label: "Headlight", icon: "💡", desc: "Projector Xenon / LED Headlamp Unit" },
  { id: "tail light", label: "Tail Light", icon: "🔴", desc: "Ruby Red / Amber Brake Lamp" },
  { id: "ecu", label: "ECU / Computer", icon: "💻", desc: "Engine Control Module Computer" },
  { id: "throttle body", label: "Throttle Body", icon: "⚙️", desc: "Intake Throttle Body & TPS" },
  { id: "climate control", label: "Climate Control", icon: "❄️", desc: "HVAC Temperature Dash Unit" },
  { id: "instrument cluster", label: "Gauge Cluster", icon: "⏱️", desc: "Speedometer & Tachometer Dial" },
  { id: "mass air flow", label: "MAF Sensor", icon: "🌪️", desc: "Air Flow Meter Sensor Housing" },
  { id: "starter motor", label: "Starter Motor", icon: "🔑", desc: "Heavy Duty Starter Solenoid" },
  { id: "side mirror", label: "Side Mirror", icon: "🪞", desc: "Power Heated Mirror Assembly" }
];

interface ListingGeneratorSectionProps {
  chassisList: Chassis[];
  initialPart?: {
    part: TargetPart;
    chassis: Chassis;
  } | null;
  onClearInitialPart?: () => void;
  onListingSaved?: (partName: string) => void;
}

export const ListingGeneratorSection: React.FC<ListingGeneratorSectionProps> = ({
  chassisList,
  initialPart,
  onClearInitialPart,
  onListingSaved
}) => {
  // Input form state
  const [selectedChassisId, setSelectedChassisId] = useState<string>(
    initialPart?.chassis.id || chassisList[0]?.id || ""
  );
  const [selectedPartName, setSelectedPartName] = useState<string>(
    initialPart?.part.name || ""
  );
  const [customMake, setCustomMake] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [customYears, setCustomYears] = useState("");
  const [customChassisCode, setCustomChassisCode] = useState("");
  const [customPartName, setCustomPartName] = useState("");
  const [estValue, setEstValue] = useState<number>(120);
  const [condition, setCondition] = useState<"OEM Tested Good" | "Used Clean Working" | "Salvage Core Pull" | "Grade A Clean">("OEM Tested Good");
  const [partNumber, setPartNumber] = useState("");
  const [customNotes, setCustomNotes] = useState("");
  const [mode, setMode] = useState<"preset" | "custom">("preset");

  // Output and UI states
  const [activePlatform, setActivePlatform] = useState<"facebook" | "ebay" | "craigslist">("facebook");
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState<GeneratedListing | null>(null);
  const [savedListings, setSavedListings] = useState<Array<{ id: string; timestamp: string; listing: GeneratedListing; meta: string }>>([]);
  
  // Image Generation States
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isAiGeneratedImage, setIsAiGeneratedImage] = useState(false);
  const [imageCaption, setImageCaption] = useState<string | null>(null);
  const [imageAngle, setImageAngle] = useState<string>("3/4 isometric clean studio view");
  const [imageOverlay, setImageOverlay] = useState<string>("OEM TESTED 100% WORKING");
  const [selectedGenericPart, setSelectedGenericPart] = useState<string>("alternator");

  // Copy notification states
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Load saved listings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("oem_salvage_saved_listings");
      if (saved) {
        setSavedListings(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load saved listings", e);
    }
  }, []);

  // Update selection when initialPart changes
  useEffect(() => {
    if (initialPart) {
      setMode("preset");
      setSelectedChassisId(initialPart.chassis.id);
      setSelectedPartName(initialPart.part.name);
      setEstValue(initialPart.part.estValue);
      // Auto generate
      generateListingForParams({
        partName: initialPart.part.name,
        make: initialPart.chassis.make,
        model: initialPart.chassis.model,
        chassisCode: initialPart.chassis.chassisCode,
        years: initialPart.chassis.years,
        estValue: initialPart.part.estValue,
        condition: "OEM Tested Good",
        category: initialPart.part.category,
        failureMode: initialPart.part.failureMode,
        interchangeability: initialPart.part.interchangeability
      });
    }
  }, [initialPart]);

  // Synchronize part selection when chassis changes
  const activeChassis = chassisList.find((c) => c.id === selectedChassisId);

  useEffect(() => {
    if (activeChassis && !selectedPartName && activeChassis.targetParts.length > 0) {
      setSelectedPartName(activeChassis.targetParts[0].name);
      setEstValue(activeChassis.targetParts[0].estValue);
    }
  }, [activeChassis, selectedPartName]);

  const handleChassisChange = (id: string) => {
    setSelectedChassisId(id);
    const ch = chassisList.find((c) => c.id === id);
    if (ch && ch.targetParts.length > 0) {
      setSelectedPartName(ch.targetParts[0].name);
      setEstValue(ch.targetParts[0].estValue);
    }
  };

  const handlePartChange = (name: string) => {
    setSelectedPartName(name);
    if (activeChassis) {
      const p = activeChassis.targetParts.find((pt) => pt.name === name);
      if (p) {
        setEstValue(p.estValue);
      }
    }
  };

  // Generate Listing Handler
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    let params: ListingRequestParams;

    if (mode === "preset") {
      if (!activeChassis) return;
      const targetP = activeChassis.targetParts.find((p) => p.name === selectedPartName) || activeChassis.targetParts[0];
      if (!targetP) return;

      params = {
        partName: targetP.name,
        make: activeChassis.make,
        model: activeChassis.model,
        chassisCode: activeChassis.chassisCode,
        years: activeChassis.years,
        estValue: estValue || targetP.estValue,
        condition,
        category: targetP.category,
        partNumber: partNumber.trim() || undefined,
        failureMode: targetP.failureMode,
        interchangeability: targetP.interchangeability,
        customNotes: customNotes.trim() || undefined
      };
    } else {
      if (!customMake.trim() || !customModel.trim() || !customPartName.trim()) {
        alert("Please provide vehicle Make, Model, and Part Name.");
        return;
      }

      params = {
        partName: customPartName.trim(),
        make: customMake.trim(),
        model: customModel.trim(),
        chassisCode: customChassisCode.trim() || undefined,
        years: customYears.trim() || "2000-2015",
        estValue: Number(estValue) || 120,
        condition,
        partNumber: partNumber.trim() || undefined,
        customNotes: customNotes.trim() || undefined
      };
    }

    await generateListingForParams(params);
  };

  const generateListingForParams = async (params: ListingRequestParams) => {
    setLoading(true);
    try {
      const res = await fetch("/api/gemini/generate-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
      });

      const data = await res.json();
      if (data.success && data.data) {
        setListing(data.data);
      } else {
        throw new Error(data.error || "Failed to generate listing");
      }
    } catch (err: any) {
      console.error("Listing Generation Error:", err);
      // Construct instant client-side fallback
      const baseVal = Number(params.estValue) || 120;
      const anchorVal = Math.round(baseVal * 1.18);
      const bottomVal = Math.round(baseVal * 0.85);

      const fallback: GeneratedListing = {
        title: `OEM ${params.make} ${params.model} ${params.partName}`,
        suggestedPrice: baseVal,
        anchorAskingPrice: anchorVal,
        bottomCashPrice: bottomVal,
        ebayTitle: `OEM ${params.make} ${params.model} ${params.partName} ${params.chassisCode || ""} Factory Genuine`.slice(0, 80),
        ebayDescription: `GENUINE OEM ${params.make.toUpperCase()} ${params.model.toUpperCase()} ${params.partName.toUpperCase()}\n\n• Condition: ${params.condition || "OEM Tested Good"}\n• 100% Genuine Factory OEM Part\n• Inspected: Clean electrical pins, unbroken mounting tabs, no crack damage\n• Direct Bolt-on Fitment: ${params.interchangeability || `${params.make} ${params.model}`}\n\nFast 1-business day shipping with tracking. Tested and packaged securely.`,
        facebookTitle: `${params.make} ${params.model} OEM ${params.partName} - Working & Clean`,
        facebookDescription: `Selling clean factory OEM ${params.partName} from a ${params.make} ${params.model} (${params.chassisCode || "Chassis"}).\n\n• Condition: ${params.condition || "OEM Tested Good"}\n• Authentic factory part (not cheap aftermarket replica)\n• Inspected tabs and electrical connectors\n• Fits: ${params.interchangeability || `${params.make} ${params.model}`}\n\nAsking: $${anchorVal} (Cash / Venmo on pickup).\nSerious buyers only. Located for local pickup. Can ship if buyer covers postage.\n\nTAGS:\n#${params.make.replace(/\s+/g, '')} #${params.model.replace(/\s+/g, '')} #${params.partName.replace(/\s+/g, '')} #OEMParts #CarParts #SalvageParts`,
        craigslistDescription: `OEM ${params.make} ${params.model} ${params.partName}\n\nCondition: ${params.condition || "OEM Tested Good"}\nOriginal factory part removed cleanly with standard tools.\nCompatibility: ${params.interchangeability || `${params.make} ${params.model}`}\n\nPrice: $${anchorVal} cash on pickup. Message or text to arrange pickup.`,
        bulletFeatures: [
          `Original factory OEM part for ${params.make} ${params.model}`,
          "All connector pins and mounting points clean and intact",
          "Direct plug-and-play replacement",
          "High reliability tested pull"
        ],
        interchangeText: params.interchangeability || `Fits ${params.make} ${params.model} platforms.`,
        itemSpecifics: {
          Brand: params.make,
          Condition: params.condition || "Used OEM",
          Placement: "Direct Replacement"
        },
        tags: [
          `${params.make} ${params.partName}`,
          `${params.model} parts`,
          `OEM ${params.partName}`,
          "auto parts",
          "salvage pull"
        ],
        shippingAdvice: "Use USPS Priority Padded Flat Rate Envelope or sturdy 8x6x4 box with double bubble-wrap.",
        photoChecklist: [
          "1. Face shot of complete part in clear light",
          "2. Close up of OEM part number / barcode label",
          "3. Connector pins to verify straight & corrosion-free",
          "4. Mounting tabs to verify zero cracks"
        ],
        antiLowballClause: `Price is $${anchorVal} ($${bottomVal} firm cash today). Already priced under dealer and eBay averages. Serious buyers only.`
      };
      setListing(fallback);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSaveListing = () => {
    if (!listing) return;
    const newItem = {
      id: `saved-${Date.now()}`,
      timestamp: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      listing,
      meta: `${listing.title} • $${listing.anchorAskingPrice}`
    };
    const next = [newItem, ...savedListings.slice(0, 19)];
    setSavedListings(next);
    localStorage.setItem("oem_salvage_saved_listings", JSON.stringify(next));
    copyToClipboard(listing.title, "saved");
    
    if (onListingSaved) {
      const partName = mode === "preset" ? selectedPartName : customPartName;
      onListingSaved(partName);
    }
  };

  const handleDeleteSaved = (id: string) => {
    const next = savedListings.filter(s => s.id !== id);
    setSavedListings(next);
    localStorage.setItem("oem_salvage_saved_listings", JSON.stringify(next));
  };

  // Image Generation Handler for Generic Part Types (e.g. alternator, headlight, ecu, etc.)
  const handleGenerateImage = async (
    overridePartType?: string,
    overrideAngle?: string,
    overrideOverlay?: string
  ) => {
    setGeneratingImage(true);
    const targetType =
      overridePartType ||
      (mode === "preset" ? selectedPartName : customPartName) ||
      selectedGenericPart ||
      "alternator";

    const targetMake = mode === "preset" ? activeChassis?.make : customMake;
    const targetModel = mode === "preset" ? activeChassis?.model : customModel;
    const targetAngle = overrideAngle || imageAngle;
    const targetOverlay = overrideOverlay || imageOverlay;

    try {
      const res = await fetch("/api/gemini/generate-part-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partType: targetType,
          make: targetMake || undefined,
          model: targetModel || undefined,
          angle: targetAngle,
          overlayTag: targetOverlay
        })
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        setIsAiGeneratedImage(!!data.isAiGenerated);
        setImageCaption(data.caption || `Marketplace Specimen: ${targetType}`);
      } else {
        throw new Error(data.error || "Failed to generate image");
      }
    } catch (err) {
      console.error("Image generation error:", err);
    } finally {
      setGeneratingImage(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    const cleanName = (selectedPartName || customPartName || selectedGenericPart || "OEM_Part").replace(/\s+/g, "_");
    link.download = `${cleanName}_marketplace_specimen.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    copyToClipboard("Downloaded", "image-download");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900 border border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-amber-500/5 blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                MAX-PROFIT LISTING GENERATOR
              </span>
              <span className="text-xs font-mono text-zinc-400">1-Click Multi-Marketplace Poster</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Automated Marketplace Listing Studio
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
              Instantly create high-converting, SEO-optimized listings for <strong className="text-white">Facebook Marketplace</strong>, <strong className="text-white">eBay Motors</strong>, <strong className="text-white">OfferUp</strong>, and <strong className="text-white">Craigslist</strong> with profit-maximizing price anchors, search tag blocks, and anti-lowball safeguards.
            </p>
          </div>

          {initialPart && (
            <div className="bg-zinc-950/80 border border-amber-500/40 p-3 rounded-xl flex items-center gap-3 shrink-0">
              <div>
                <span className="text-[10px] uppercase font-mono text-amber-400 font-bold block">
                  Quick Loaded from Catalog
                </span>
                <span className="text-xs font-bold text-white">
                  {initialPart.chassis.make} {initialPart.chassis.model} • {initialPart.part.name}
                </span>
              </div>
              {onClearInitialPart && (
                <button
                  type="button"
                  onClick={onClearInitialPart}
                  className="text-xs text-zinc-400 hover:text-white px-2 py-1 bg-zinc-800 rounded-lg"
                >
                  Reset
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form (4 cols on large screens) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Car className="w-4 h-4 text-amber-400" />
                Target Part Selection
              </h3>

              {/* Mode Toggle */}
              <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setMode("preset")}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    mode === "preset"
                      ? "bg-amber-500 text-zinc-950 font-bold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  From Catalog
                </button>
                <button
                  type="button"
                  onClick={() => setMode("custom")}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    mode === "custom"
                      ? "bg-amber-500 text-zinc-950 font-bold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Custom
                </button>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-3.5">
              {mode === "preset" ? (
                <>
                  {/* Select Chassis */}
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">
                      Select Vehicle Platform:
                    </label>
                    <select
                      value={selectedChassisId}
                      onChange={(e) => handleChassisChange(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
                    >
                      {chassisList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.make} {c.model} [{c.chassisCode}] ({c.years[0]}-{c.years[c.years.length - 1]})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Part */}
                  {activeChassis && (
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">
                        Select Target Part:
                      </label>
                      <select
                        value={selectedPartName}
                        onChange={(e) => handlePartChange(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
                      >
                        {activeChassis.targetParts.map((p) => (
                          <option key={p.name} value={p.name}>
                            {p.name} (Est. ${p.estValue})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Custom Vehicle Inputs */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Make:</label>
                      <input
                        type="text"
                        placeholder="e.g. Infiniti"
                        value={customMake}
                        onChange={(e) => setCustomMake(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Model:</label>
                      <input
                        type="text"
                        placeholder="e.g. G35 Coupe"
                        value={customModel}
                        onChange={(e) => setCustomModel(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Years:</label>
                      <input
                        type="text"
                        placeholder="e.g. 2003-2007"
                        value={customYears}
                        onChange={(e) => setCustomYears(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Chassis / Trim:</label>
                      <input
                        type="text"
                        placeholder="e.g. V35 / Sport"
                        value={customChassisCode}
                        onChange={(e) => setCustomChassisCode(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Part Name:</label>
                    <input
                      type="text"
                      placeholder="e.g. Engine ECU & Key Set / ABS Module"
                      value={customPartName}
                      onChange={(e) => setCustomPartName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </>
              )}

              {/* Common Specifications */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-850">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Market Value ($):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-zinc-500 text-xs font-mono">$</span>
                    <input
                      type="number"
                      value={estValue}
                      onChange={(e) => setEstValue(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-7 pr-3 py-2 text-xs text-emerald-400 font-bold font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Condition:</label>
                  <select
                    value={condition}
                    onChange={(e: any) => setCondition(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2 text-xs text-zinc-200 font-mono focus:outline-none focus:border-amber-500"
                  >
                    <option value="OEM Tested Good">OEM Tested Good</option>
                    <option value="Used Clean Working">Used Clean Working</option>
                    <option value="Grade A Clean">Grade A Unblemished</option>
                    <option value="Salvage Core Pull">Salvage Core Pull</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  OEM Part # / Stamped Code (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. 23710-AM601 / Bosch 0261..."
                  value={partNumber}
                  onChange={(e) => setPartNumber(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Special Notes / Flaws / Color (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Black bezel, tested cold AC, includes wiring pigtail"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold font-mono text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Writing Max-Profit Listings...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Complete Listings</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* AI Marketplace Photo Placeholder Generator (Left Column) */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-xs font-mono uppercase tracking-wider">
                  Photo Placeholder Studio
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                Gemini AI
              </span>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed font-mono">
              Generate studio-grade placeholder images for generic part types (e.g. alternator, headlight, ECU) ready for marketplace listings.
            </p>

            {/* Generic Part Preset Chips */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-zinc-400">
                Target Part Type:
              </label>
              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
                {GENERIC_PART_PRESETS.map((p) => {
                  const isSelected = selectedGenericPart === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedGenericPart(p.id);
                        if (mode === "custom") {
                          setCustomPartName(p.label);
                        }
                      }}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                        isSelected
                          ? "bg-amber-500/15 border-amber-500/50 text-white shadow-sm"
                          : "bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                      }`}
                    >
                      <span className="text-sm">{p.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{p.label}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Angle & Watermark Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                  Camera Angle:
                </label>
                <select
                  value={imageAngle}
                  onChange={(e) => setImageAngle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-amber-500"
                >
                  <option value="3/4 isometric clean studio view">3/4 Studio Angle</option>
                  <option value="front face optic close-up">Front Optic Face</option>
                  <option value="rear connector pins and wiring harness">Pins & Wiring</option>
                  <option value="oem sticker barcode label and casting numbers">OEM Part# Label</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                  Trust Badge:
                </label>
                <select
                  value={imageOverlay}
                  onChange={(e) => setImageOverlay(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-amber-500"
                >
                  <option value="OEM TESTED 100% WORKING">OEM Tested 100%</option>
                  <option value="GENUINE OEM SPEC">Genuine OEM Spec</option>
                  <option value="CLEAN SALVAGE PULL">Clean Salvage Pull</option>
                  <option value="FAST SAME-DAY SHIPPING">Fast Shipping</option>
                </select>
              </div>
            </div>

            {/* Primary Generate Photo Button */}
            <button
              type="button"
              id="generate-part-image-btn"
              onClick={() => handleGenerateImage()}
              disabled={generatingImage}
              className="w-full py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
            >
              {generatingImage ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Rendering Specimen Image...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-amber-400" />
                  <span>Generate Photo Placeholder</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Saved Listings Shelf */}
          {savedListings.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                  Saved Listings Archive ({savedListings.length})
                </span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                {savedListings.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800/80 flex items-center justify-between gap-2 hover:border-zinc-700 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setListing(item.listing)}
                      className="text-left flex-1 min-w-0"
                    >
                      <p className="text-xs font-semibold text-zinc-200 truncate">{item.listing.title}</p>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">
                        ${item.listing.anchorAskingPrice} Asking • {item.timestamp}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSaved(item.id)}
                      className="text-zinc-500 hover:text-red-400 p-1"
                      title="Delete saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Listing Outputs & Profit Strategizer (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Marketplace Photo Placeholder Studio Card */}
          {generatedImage && (
            <div className="bg-zinc-900 border border-amber-500/40 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-sm">
                        Marketplace Photo Placeholder Specimen
                      </h3>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        isAiGeneratedImage
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                      }`}>
                        {isAiGeneratedImage ? "Gemini AI Studio Photo" : "Studio Blueprint Specimen"}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                      {imageCaption || "Clean high-contrast specimen ready for Facebook / eBay"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={downloadImage}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                    title="Download high-resolution image file"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Image</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGenerateImage()}
                    disabled={generatingImage}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors border border-zinc-700 disabled:opacity-50"
                    title="Regenerate image"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${generatingImage ? "animate-spin text-amber-400" : ""}`} />
                    <span>Regenerate</span>
                  </button>
                </div>
              </div>

              {/* High-Impact Image Presentation Stage */}
              <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 flex flex-col items-center justify-center p-2 min-h-[280px]">
                <img
                  src={generatedImage}
                  alt="Marketplace Listing Specimen"
                  referrerPolicy="no-referrer"
                  className="max-h-80 w-auto object-contain rounded-lg shadow-2xl transition-all hover:scale-[1.01]"
                />
              </div>

              {/* Quick Angle Switcher Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs font-mono">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-zinc-500 text-[11px]">Quick Angles:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setImageAngle("3/4 isometric clean studio view");
                      handleGenerateImage(undefined, "3/4 isometric clean studio view");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[11px] transition-colors"
                  >
                    3/4 Angle
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImageAngle("front face optic close-up");
                      handleGenerateImage(undefined, "front face optic close-up");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[11px] transition-colors"
                  >
                    Front Face
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImageAngle("rear connector pins and wiring harness");
                      handleGenerateImage(undefined, "rear connector pins and wiring harness");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[11px] transition-colors"
                  >
                    Pins & Plug
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImageAngle("oem sticker barcode label and casting numbers");
                      handleGenerateImage(undefined, "oem sticker barcode label and casting numbers");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[11px] transition-colors"
                  >
                    Label & Part#
                  </button>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                  <span>Trust Stamp:</span>
                  <span className="text-amber-400 font-bold">{imageOverlay}</span>
                </div>
              </div>
            </div>
          )}

          {listing ? (
            <>
              {/* Profit Maximizer Pricing Bar */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      Profit Maximization Pricing Matrix
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      Recommended Pricing & Negotiation Strategy
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPreviewModal(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      <span>Quick Preview</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveListing}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      {copiedType === "saved" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span>{copiedType === "saved" ? "Listing Saved!" : "Save to Stash"}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                  {/* Asking Anchor Price */}
                  <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold">
                        Post / Asking Price (Anchor)
                      </span>
                      <p className="text-2xl font-black text-amber-300 font-mono mt-0.5">
                        ${listing.anchorAskingPrice}
                      </p>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-2 leading-tight">
                      Listed 18% higher so buyers feel great negotiating down to your target.
                    </p>
                  </div>

                  {/* Target Market Value */}
                  <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                        Target Market Value
                      </span>
                      <p className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
                        ${listing.suggestedPrice}
                      </p>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-2 leading-tight">
                      Realistic average completed sales price on eBay / specialty forums.
                    </p>
                  </div>

                  {/* Rock Bottom Cash Floor */}
                  <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-blue-400 uppercase font-semibold">
                        Bottom Dollar Floor (Cash)
                      </span>
                      <p className="text-2xl font-black text-blue-400 font-mono mt-0.5">
                        ${listing.bottomCashPrice}
                      </p>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-2 leading-tight">
                      Never accept below this amount. Saves your yard labor profit margin.
                    </p>
                  </div>
                </div>
              </div>

              {/* Platform Selector Tabs */}
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                <button
                  type="button"
                  onClick={() => setActivePlatform("facebook")}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                    activePlatform === "facebook"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Facebook Marketplace & OfferUp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePlatform("ebay")}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                    activePlatform === "ebay"
                      ? "bg-amber-600 text-white shadow-md"
                      : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>eBay Motors</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePlatform("craigslist")}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                    activePlatform === "craigslist"
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Craigslist & Enthusiast Forums</span>
                </button>
              </div>

              {/* Platform Output View */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg space-y-4">
                
                {/* 1. TITLE BLOCK */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400 uppercase font-semibold flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      Optimized Listing Title:
                      {activePlatform === "ebay" && (
                        <span className="text-[10px] text-zinc-500 font-normal">
                          ({listing.ebayTitle.length}/80 chars)
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          activePlatform === "ebay"
                            ? listing.ebayTitle
                            : activePlatform === "facebook"
                            ? listing.facebookTitle
                            : listing.title,
                          "title"
                        )
                      }
                      className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      {copiedType === "title" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied Title!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Title</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-sm font-semibold text-white font-mono select-all">
                    {activePlatform === "ebay"
                      ? listing.ebayTitle
                      : activePlatform === "facebook"
                      ? listing.facebookTitle
                      : listing.title}
                  </div>
                </div>

                {/* 2. DESCRIPTION BLOCK */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400 uppercase font-semibold flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                      Item Description & Terms:
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          activePlatform === "ebay"
                            ? listing.ebayDescription
                            : activePlatform === "facebook"
                            ? listing.facebookDescription
                            : listing.craigslistDescription,
                          "desc"
                        )
                      }
                      className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      {copiedType === "desc" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied Description!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Description</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 text-xs text-zinc-200 whitespace-pre-wrap font-mono leading-relaxed max-h-72 overflow-y-auto scrollbar-thin select-all">
                    {activePlatform === "ebay"
                      ? listing.ebayDescription
                      : activePlatform === "facebook"
                      ? listing.facebookDescription
                      : listing.craigslistDescription}
                  </div>
                </div>

                {/* 3. SEARCH TAGS & KEYWORDS BLOCK (Crucial for FB / Marketplace reach) */}
                {listing.tags && listing.tags.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-zinc-850">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-zinc-400 uppercase font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Algorithm Search Tags & Keywords:
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            listing.tags.map((t) => (t.startsWith("#") ? t : `#${t.replace(/\s+/g, "")}`)).join(" "),
                            "tags"
                          )
                        }
                        className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1"
                      >
                        {copiedType === "tags" ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copied Tags!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Tag Block</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {listing.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700"
                        >
                          #{tag.replace(/^#/, "").replace(/\s+/g, "")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. ANTI-LOWBALL / FIRM PRICE QUICK COPY */}
                {listing.antiLowballClause && (
                  <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono text-red-400 font-bold flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-red-400" />
                        Instant Chat Reply (Anti-Lowball Shield):
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(listing.antiLowballClause, "lowball")}
                        className="text-[11px] font-mono text-zinc-400 hover:text-white flex items-center gap-1"
                      >
                        {copiedType === "lowball" ? "Copied!" : "Copy Response"}
                      </button>
                    </div>
                    <p className="text-xs font-mono text-zinc-300 italic">
                      "{listing.antiLowballClause}"
                    </p>
                  </div>
                )}
              </div>

              {/* High-Dollar Execution Guide (Photos & Packaging) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Photo Checklist */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-amber-400" />
                      Top-Dollar Photo Checklist:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleGenerateImage(listing.title)}
                      disabled={generatingImage}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
                    >
                      <Wand2 className="w-3 h-3 text-amber-400" />
                      <span>{generatingImage ? "Rendering..." : "Generate AI Photo"}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-tight">
                    Taking these 4 photos eliminates buyer hesitation and secures asking price:
                  </p>
                  <ul className="space-y-1.5 text-xs text-zinc-300 font-mono">
                    {listing.photoChecklist?.map((photo, i) => (
                      <li key={i} className="flex items-start gap-2 bg-zinc-950 p-2 rounded-lg border border-zinc-800/80">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{photo}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Packaging & Shipping Strategy */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4.5 space-y-2.5">
                  <span className="text-xs font-mono uppercase text-blue-400 font-bold flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-blue-400" />
                    Shipping & Protection Protocol:
                  </span>
                  <p className="text-[11px] text-zinc-400 leading-tight">
                    Recommended packing specs to prevent transport damage and shipping claims:
                  </p>
                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs text-zinc-200 font-mono leading-relaxed">
                    {listing.shippingAdvice}
                  </div>
                  <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-200">
                    💡 <strong>Flipper Tip:</strong> Local pickup on FB Marketplace saves 13.25% eBay fees + $15 shipping postage directly into your pocket.
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center space-y-4 flex flex-col items-center justify-center min-h-[380px]">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md">
                <h3 className="text-lg font-bold text-white">Select a Part to Generate Listings</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Choose any vehicle and target part from the left panel or click <strong className="text-amber-400">"Create Listing"</strong> on any card in the catalog or your pull plan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleGenerate()}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold font-mono text-xs flex items-center gap-2 transition-all shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate for {activeChassis ? `${activeChassis.make} ${activeChassis.model}` : "Selected Car"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Preview Modal (Mock Facebook Marketplace) */}
      {showPreviewModal && listing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-[500px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* FB Nav Bar */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setShowPreviewModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                  <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
                </button>
                <h3 className="font-bold text-gray-900">Marketplace</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <ExternalLink className="w-4 h-4 text-gray-700" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-gray-50/50">
              {/* Image Placeholder */}
              <div className="w-full aspect-[4/3] bg-gray-200 flex items-center justify-center relative">
                {generatedImage ? (
                  <img src={generatedImage} alt={listing.facebookTitle} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center space-y-2">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="text-gray-500 text-sm font-medium">Add Photos Here</p>
                  </div>
                )}
                {/* Dots indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                </div>
              </div>

              {/* Title & Price */}
              <div className="p-4 bg-white space-y-2">
                <h2 className="text-[22px] font-bold text-gray-900 leading-tight">
                  {listing.facebookTitle}
                </h2>
                <p className="text-xl font-bold text-gray-900">
                  ${listing.anchorAskingPrice}
                </p>
                <p className="text-sm text-gray-500 mt-1">Listed a few minutes ago in Your City</p>
              </div>

              {/* Action Buttons */}
              <div className="px-4 py-3 bg-white flex items-center gap-2 border-b border-gray-200">
                <button type="button" className="flex-1 bg-[#0866FF] hover:bg-[#075ce5] text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                  <span className="text-sm">Message</span>
                </button>
                <button type="button" className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                  <span className="text-sm">Save</span>
                </button>
                <button type="button" className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                  <span className="text-sm">Share</span>
                </button>
              </div>

              {/* Condition */}
              <div className="p-4 bg-white border-b border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3 text-[17px]">Details</h3>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Condition</span>
                  <span className="font-semibold text-gray-900">Used - {condition.includes("Tested") ? "Like new" : "Good"}</span>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 bg-white border-b border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2 text-[17px]">Seller's Description</h3>
                <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {listing.facebookDescription}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
