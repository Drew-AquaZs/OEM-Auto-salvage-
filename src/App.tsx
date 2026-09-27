import React, { useState, useEffect } from "react";
import { CUSTOM_PRESETS } from "./chassisData";
import { Chassis, TargetPart, YardPlanItem } from "./types";
import ChassisCard from "./components/ChassisCard";
import YardPlanner from "./components/YardPlanner";
import AISearchSection from "./components/AISearchSection";
import YardDropParserSection from "./components/YardDropParserSection";
import ProfitDistributionChart from "./components/ProfitDistributionChart";
import AddVehicleModal from "./components/AddVehicleModal";
import { ListingGeneratorSection } from "./components/ListingGeneratorSection";
import { 
  Car, 
  ClipboardList, 
  Sparkles, 
  BarChart3, 
  Search, 
  Plus, 
  ArrowUpDown, 
  Filter, 
  Wrench, 
  ChevronRight, 
  Layers,
  Clock,
  CircleDollarSign,
  Tag,
  ShoppingBag
} from "lucide-react";

type ActiveTab = "catalog" | "plan" | "listings" | "ai-tools" | "analytics";

export default function App() {
  const [chassisList, setChassisList] = useState<Chassis[]>(CUSTOM_PRESETS);
  const [activeTab, setActiveTab] = useState<ActiveTab>("catalog");
  const [selectedOrigin, setSelectedOrigin] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "max-value" | "easiest">("default");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTool, setSelectedTool] = useState("All");
  const [yardPlan, setYardPlan] = useState<YardPlanItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [listingInitialPart, setListingInitialPart] = useState<{
    part: TargetPart;
    chassis: Chassis;
  } | null>(null);

  // Load saved plan from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("salvage_yard_plan");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setYardPlan(parsed.filter((item) => item && typeof item.id === "string" && item.part));
        }
      }
    } catch (e) {
      console.error("Failed to load saved plan:", e);
    }
  }, []);

  // Save plan to localStorage
  const savePlan = (newPlan: YardPlanItem[]) => {
    setYardPlan(newPlan);
    try {
      localStorage.setItem("salvage_yard_plan", JSON.stringify(newPlan));
    } catch (e) {
      console.error("Failed to persist plan:", e);
    }
  };

  const handleAddPart = (chassis: Chassis, part: TargetPart) => {
    const id = `${chassis.id}_${part.name}`;
    if (yardPlan.some((item) => item.id === id)) return;

    const newItem: YardPlanItem = {
      id,
      chassisId: chassis.id,
      chassisMake: chassis.make,
      chassisModel: chassis.model,
      chassisCode: chassis.chassisCode,
      part,
    };
    savePlan([...yardPlan, newItem]);
  };

  const handleRemovePart = (planItemId: string) => {
    const next = yardPlan.filter((item) => item.id !== planItemId);
    savePlan(next);
  };

  const handleClearPlan = () => {
    savePlan([]);
  };

  const handleUpdateItemStatus = (id: string, status: "target" | "pulled" | "listed") => {
    const next = yardPlan.map((item) => 
      item.id === id ? { ...item, status } : item
    );
    savePlan(next);
  };

  const isPartSelected = (chassisId: string, partName: string) => {
    const planItemId = `${chassisId}_${partName}`;
    return yardPlan.some((item) => item.id === planItemId);
  };

  const handleCreateListing = (chassis: Chassis, part: TargetPart) => {
    setListingInitialPart({ chassis, part });
    setActiveTab("listings");
  };

  const handleCreateListingFromPlan = (item: YardPlanItem) => {
    const existing = chassisList.find((c) => c.id === item.chassisId);
    const chassisObj: Chassis = existing || {
      id: item.chassisId,
      make: item.chassisMake,
      model: item.chassisModel,
      chassisCode: item.chassisCode,
      years: [2005],
      origin: "Japanese",
      difficultyRating: 2,
      notes: "",
      targetParts: [item.part]
    };

    setListingInitialPart({
      chassis: chassisObj,
      part: item.part
    });
    setActiveTab("listings");
  };

  const handleListingSaved = (partName: string, chassisId?: string) => {
    if (!chassisId) return;
    const targetId = `${chassisId}_${partName}`;
    const next = yardPlan.map((item) => 
      item.id === targetId ? { ...item, status: "listed" as const } : item
    );
    savePlan(next);
  };

  const handleUpdateItemValue = (planItemId: string, newValue: number) => {
    const next = yardPlan.map((item) => {
      if (item.id === planItemId) {
        return {
          ...item,
          part: {
            ...item.part,
            estValue: newValue,
          },
        };
      }
      return item;
    });
    savePlan(next);
  };

  const handleAddPartFromMarketInsights = (chassisData: Partial<Chassis>, part: TargetPart) => {
    const id = `trending_${chassisData.make || "Vehicle"}_${part.name}`;
    if (yardPlan.some((item) => item.id === id || item.part.name === part.name)) return;

    const newItem: YardPlanItem = {
      id,
      chassisId: chassisData.id || `custom-${Date.now()}`,
      chassisMake: chassisData.make || "Trending Platform",
      chassisModel: chassisData.model || "Market Target",
      chassisCode: chassisData.chassisCode || "OEM",
      part,
    };
    savePlan([...yardPlan, newItem]);
  };

  // Import newly generated chassis from AI search
  const handleImportChassis = (newChassis: Chassis) => {
    setChassisList((prev) => [newChassis, ...prev]);
    setActiveTab("catalog");
  };

  const handleAddParsedTarget = (target: {
    name: string;
    estValue: number;
    toolsNeeded: string[];
    failureMode: string[];
    origin: string;
    cleanVehicleName: string;
    yardRow: string;
  }) => {
    const cleanId = `parsed-${Date.now()}`;
    const part: TargetPart = {
      name: target.name,
      estValue: target.estValue,
      toolsNeeded: target.toolsNeeded,
      failureMode: target.failureMode.join("; "),
      interchangeability: "Verified matching platform interchange.",
      extractionGuide: "Extract with standard hand tools in specified yard row.",
      difficulty: target.estValue > 250 ? "Medium" : "Easy",
      category: "Drivetrain & Electronics",
    };

    const newChassis: Chassis = {
      id: cleanId,
      make: target.cleanVehicleName.split(" ")[1] || "Target",
      model: target.cleanVehicleName.split(" ").slice(2).join(" ") || target.cleanVehicleName,
      chassisCode: target.yardRow ? `Row ${target.yardRow}` : "Row N/A",
      years: [parseInt(target.cleanVehicleName.split(" ")[0]) || 2007],
      origin: target.origin as any,
      difficultyRating: 2,
      notes: `Matched from yard inventory drop: ${target.cleanVehicleName} (Row ${target.yardRow}).`,
      targetParts: [part],
    };

    setChassisList((prev) => [newChassis, ...prev]);
    handleAddPart(newChassis, part);
    setActiveTab("plan");
  };

  // Filter and sort chassis list
  const filteredChassis = chassisList.filter((item) => {
    const originMatch = selectedOrigin === "All" || item.origin === selectedOrigin;
    const categoryMatch =
      selectedCategory === "All" ||
      item.targetParts.some((p) => p.category === selectedCategory);

    const queryText = `${item.make} ${item.model} ${item.chassisCode} ${item.origin} ${item.targetParts
      .map((p) => p.name)
      .join(" ")}`.toLowerCase();
    const searchMatch = !searchQuery || queryText.includes(searchQuery.toLowerCase());

    return originMatch && categoryMatch && searchMatch;
  });

  const sortedChassis = [...filteredChassis].sort((a, b) => {
    if (sortBy === "max-value") {
      const valA = a.targetParts.reduce((sum, p) => sum + p.estValue, 0);
      const valB = b.targetParts.reduce((sum, p) => sum + p.estValue, 0);
      return valB - valA;
    }
    if (sortBy === "easiest") {
      return a.difficultyRating - b.difficultyRating;
    }
    return 0;
  });

  const totalYardPlanValue = yardPlan.reduce((acc, i) => acc + i.part.estValue, 0);

  const availableCategories = Array.from(
    new Set(chassisList.flatMap((c) => c.targetParts.map((p) => p.category).filter(Boolean)))
  ) as string[];

  const origins = ["All", "Japanese", "German", "American", "Swedish"];

  return (
    <div id="app-container" className="min-h-screen bg-[#090a0b] text-zinc-200 font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  Salvage<span className="text-amber-400">Pull</span>
                </h1>
                <span className="text-[10px] font-mono font-bold uppercase bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
                  Yard Planner
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                High-profit OEM fast-pull targets for salvage yards & pick-a-parts
              </p>
            </div>
          </div>

          {/* Quick Plan summary & Add Vehicle button */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {yardPlan.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab("plan")}
                className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-mono transition-colors"
              >
                <ClipboardList className="w-4 h-4 text-amber-400" />
                <span className="text-zinc-300 font-semibold">{yardPlan.length} parts</span>
                <span className="text-emerald-400 font-bold">${totalYardPlanValue}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 px-3.5 py-1.5 rounded-xl font-bold text-xs font-mono flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>

        {/* Primary Tab Navigation */}
        <div className="max-w-7xl mx-auto mt-3.5 pt-2 border-t border-zinc-850 flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-2 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab("catalog")}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-medium font-mono flex items-center justify-center gap-2 transition-all shrink-0 ${
              activeTab === "catalog"
                ? "bg-zinc-800 text-white font-bold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <Car className={`w-4 h-4 ${activeTab === "catalog" ? "text-amber-400" : ""}`} />
            <span>Catalog ({chassisList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("plan")}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-medium font-mono flex items-center justify-center gap-2 transition-all shrink-0 ${
              activeTab === "plan"
                ? "bg-zinc-800 text-white font-bold shadow-sm border border-amber-500/20"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <ClipboardList className={`w-4 h-4 ${activeTab === "plan" ? "text-emerald-400" : ""}`} />
            <span>Yard Plan</span>
            {yardPlan.length > 0 && (
              <span className={`bg-amber-500 text-zinc-950 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab !== "plan" ? "opacity-70" : ""}`}>
                {yardPlan.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("listings")}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-medium font-mono flex items-center justify-center gap-2 transition-all shrink-0 ${
              activeTab === "listings"
                ? "bg-amber-500/10 text-amber-300 font-bold shadow-sm border border-amber-500/40"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <ShoppingBag className={`w-4 h-4 ${activeTab === "listings" ? "text-amber-400" : ""}`} />
            <span>Auto Listing</span>
            <span className="hidden sm:inline bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ml-1">
              Max Profit
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ai-tools")}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-medium font-mono flex items-center justify-center gap-2 transition-all shrink-0 ${
              activeTab === "ai-tools"
                ? "bg-zinc-800 text-white font-bold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === "ai-tools" ? "text-blue-400" : ""}`} />
            <span>AI Scanners</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("analytics")}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-medium font-mono flex items-center justify-center gap-2 transition-all shrink-0 ${
              activeTab === "analytics"
                ? "bg-zinc-800 text-white font-bold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <BarChart3 className={`w-4 h-4 ${activeTab === "analytics" ? "text-purple-400" : ""}`} />
            <span>Analytics</span>
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        
        {/* VIEW 1: VEHICLE CATALOG */}
        {activeTab === "catalog" && (
          <div className="space-y-6">
            {/* Search & Filtering Control Bar */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-md">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Search input */}
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by vehicle (e.g. Maxima, E46, WRX) or part..."
                    className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>

                {/* Sort and Category selectors */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono text-zinc-400 shrink-0">Category:</span>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2 text-xs text-zinc-200 font-mono focus:outline-none focus:border-amber-500"
                    >
                      <option value="All">All Categories</option>
                      {availableCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono text-zinc-400 shrink-0">Sort By:</span>
                    <select
                      value={sortBy}
                      onChange={(e: any) => setSortBy(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2 text-xs text-zinc-200 font-mono focus:outline-none focus:border-amber-500"
                    >
                      <option value="default">Default Catalog Order</option>
                      <option value="max-value">Highest Value First ($)</option>
                      <option value="easiest">Easiest Pull Difficulty</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Origin Platform Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-800/80">
                <span className="text-xs font-mono text-zinc-400 font-semibold mr-1">
                  Origin:
                </span>
                {origins.map((orig) => {
                  const count =
                    orig === "All"
                      ? chassisList.length
                      : chassisList.filter((c) => c.origin === orig).length;
                  return (
                    <button
                      key={orig}
                      type="button"
                      onClick={() => setSelectedOrigin(orig)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                        selectedOrigin === orig
                          ? "bg-amber-500 text-zinc-950 font-bold shadow-sm"
                          : "bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
                      }`}
                    >
                      {orig === "All"
                        ? `All (${count})`
                        : orig === "Japanese"
                        ? `🇯🇵 Japanese (${count})`
                        : orig === "German"
                        ? `🇩🇪 German (${count})`
                        : orig === "American"
                        ? `🇺🇸 American (${count})`
                        : `🇸🇪 Swedish (${count})`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vehicle Cards Grid */}
            {sortedChassis.length === 0 ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-3">
                <Car className="w-12 h-12 text-zinc-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No vehicles found</h3>
                <p className="text-xs text-zinc-400">
                  Try adjusting your search keywords or clear the origin platform filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedOrigin("All");
                    setSelectedCategory("All");
                    setSelectedTool("All");
                  }}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-mono rounded-xl mt-2"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedChassis.map((chassis) => (
                  <ChassisCard
                    key={chassis.id}
                    chassis={chassis}
                    onAddPart={(part) => handleAddPart(chassis, part)}
                    onRemovePart={(partName) => handleRemovePart(`${chassis.id}_${partName}`)}
                    isPartSelected={(partName) => isPartSelected(chassis.id, partName)}
                    selectedCategory={selectedCategory}
                    selectedTool={selectedTool}
                    onCreateListing={handleCreateListing}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: YARD PULL PLAN & TOOLBOX */}
        {activeTab === "plan" && (
          <YardPlanner
            planItems={yardPlan}
            onRemoveItem={handleRemovePart}
            onClearPlan={handleClearPlan}
            onCreateListing={handleCreateListingFromPlan}
            onUpdateItemValue={handleUpdateItemValue}
            onUpdateItemStatus={handleUpdateItemStatus}
          />
        )}

        {/* VIEW 3: AUTOMATED MARKETPLACE LISTING STUDIO */}
        {activeTab === "listings" && (
          <ListingGeneratorSection
            chassisList={chassisList}
            initialPart={listingInitialPart}
            onClearInitialPart={() => setListingInitialPart(null)}
            onListingSaved={handleListingSaved}
          />
        )}

        {/* VIEW 4: AI SCANNER & INVENTORY DECODERS */}
        {activeTab === "ai-tools" && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <AISearchSection onImportChassis={handleImportChassis} />
            <YardDropParserSection
              knownChassis={chassisList}
              onAddParsedTarget={handleAddParsedTarget}
            />
          </div>
        )}

        {/* VIEW 5: PROFIT ANALYTICS & MARKET INSIGHTS */}
        {activeTab === "analytics" && (
          <ProfitDistributionChart
            planItems={yardPlan}
            chassisList={chassisList}
            onAddPartToPlan={handleAddPartFromMarketInsights}
            onCreateListing={handleCreateListing}
            isPartInPlan={(partName) => yardPlan.some((item) => item.part.name === partName)}
          />
        )}
      </main>

      {/* Add Custom Vehicle Modal */}
      <AddVehicleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddVehicle={(newVehicle) => {
          setChassisList((prev) => [newVehicle, ...prev]);
          setActiveTab("catalog");
        }}
      />

      {/* Clean, unobtrusive footer */}
      <footer className="mt-auto border-t border-zinc-850 py-5 px-4 text-center text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SalvagePull • Fast-Pull Arbitrage & Yard Checklist</span>
          <span className="text-zinc-600">JDM, Euro, Domestic & Nordic 2000-2015 Targets</span>
        </div>
      </footer>
    </div>
  );
}
