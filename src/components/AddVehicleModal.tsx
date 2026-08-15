import React, { useState } from "react";
import { Chassis, TargetPart } from "../types";
import { X, Plus, Trash2, Car, Sparkles } from "lucide-react";

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVehicle: (newChassis: Chassis) => void;
}

export default function AddVehicleModal({ isOpen, onClose, onAddVehicle }: AddVehicleModalProps) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [chassisCode, setChassisCode] = useState("");
  const [years, setYears] = useState("");
  const [origin, setOrigin] = useState<string>("Japanese");
  const [notes, setNotes] = useState("");

  const [parts, setParts] = useState<
    Array<{
      name: string;
      estValue: number;
      toolsNeeded: string;
      failureMode: string;
      difficulty: "Easy" | "Medium" | "Hard";
    }>
  >([
    {
      name: "",
      estValue: 150,
      toolsNeeded: "10mm Socket, Phillips Screwdriver",
      failureMode: "",
      difficulty: "Easy",
    },
  ]);

  if (!isOpen) return null;

  const handleAddPartRow = () => {
    setParts((prev) => [
      ...prev,
      {
        name: "",
        estValue: 100,
        toolsNeeded: "10mm Socket",
        failureMode: "",
        difficulty: "Easy",
      },
    ]);
  };

  const handleRemovePartRow = (index: number) => {
    if (parts.length <= 1) return;
    setParts((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePartChange = (index: number, field: string, value: any) => {
    setParts((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make.trim() || !model.trim()) return;

    const yearsArr = years
      ? years
          .split(",")
          .map((y) => parseInt(y.trim()))
          .filter((n) => !isNaN(n))
      : [2008];

    const targetParts: TargetPart[] = parts
      .filter((p) => p.name.trim() !== "")
      .map((p) => ({
        name: p.name.trim(),
        estValue: Number(p.estValue) || 100,
        toolsNeeded: p.toolsNeeded
          ? p.toolsNeeded.split(",").map((s) => s.trim()).filter(Boolean)
          : ["10mm Socket"],
        failureMode: p.failureMode.trim() || "Common high-wear replacement demand.",
        interchangeability: "Direct platform match.",
        extractionGuide: "Disconnect connectors and remove mounting bolts.",
        difficulty: p.difficulty,
      }));

    if (targetParts.length === 0) {
      targetParts.push({
        name: "OEM Engine Control Module (ECU)",
        estValue: 180,
        toolsNeeded: ["10mm Socket", "Phillips Screwdriver"],
        failureMode: "Electrical circuit failure and solder trace wear.",
        interchangeability: "Direct matching series part number.",
        extractionGuide: "Remove kick panel or glovebox bracket bolts.",
        difficulty: "Easy",
      });
    }

    const newChassis: Chassis = {
      id: `custom-${Date.now()}`,
      make: make.trim(),
      model: model.trim(),
      chassisCode: chassisCode.trim() || "OEM",
      years: yearsArr.length > 0 ? yearsArr : [2008],
      origin: origin as any,
      difficultyRating: 2,
      notes: notes.trim() || "Custom target vehicle added by user.",
      targetParts,
    };

    onAddVehicle(newChassis);
    onClose();

    // Reset form
    setMake("");
    setModel("");
    setChassisCode("");
    setYears("");
    setNotes("");
    setParts([
      {
        name: "",
        estValue: 150,
        toolsNeeded: "10mm Socket, Phillips Screwdriver",
        failureMode: "",
        difficulty: "Easy",
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Add Custom Target Vehicle</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Vehicle Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase text-zinc-400 font-bold">Vehicle Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Make (e.g. Nissan, Honda) *</label>
                <input
                  type="text"
                  required
                  placeholder="Make"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Model & Trim (e.g. Maxima SE) *</label>
                <input
                  type="text"
                  required
                  placeholder="Model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Chassis / Engine Code</label>
                <input
                  type="text"
                  placeholder="e.g. A34 / VQ35DE"
                  value={chassisCode}
                  onChange={(e) => setChassisCode(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Model Years (CSV)</label>
                <input
                  type="text"
                  placeholder="e.g. 2004, 2005, 2006"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Platform Origin</label>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Japanese">🇯🇵 Japanese JDM</option>
                  <option value="German">🇩🇪 German Euro</option>
                  <option value="American">🇺🇸 American Domestic</option>
                  <option value="Swedish">🇸🇪 Swedish Nordic</option>
                </select>
              </div>
            </div>
          </div>

          {/* Target Parts */}
          <div className="space-y-3 pt-3 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase text-zinc-400 font-bold">
                High-Value Target Parts
              </h4>
              <button
                type="button"
                onClick={handleAddPartRow}
                className="text-xs text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Part</span>
              </button>
            </div>

            <div className="space-y-3">
              {parts.map((p, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3 relative"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                    <span>Part #{idx + 1}</span>
                    {parts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePartRow(idx)}
                        className="text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] text-zinc-400 block mb-1">Part Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Mass Air Flow Sensor"
                        value={p.name}
                        onChange={(e) => handlePartChange(idx, "name", e.target.value)}
                        className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">Est. Resale ($)</label>
                      <input
                        type="number"
                        placeholder="150"
                        value={p.estValue}
                        onChange={(e) => handlePartChange(idx, "estValue", e.target.value)}
                        className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-emerald-400 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">
                        Tools Needed (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="10mm Socket, Phillips"
                        value={p.toolsNeeded}
                        onChange={(e) => handlePartChange(idx, "toolsNeeded", e.target.value)}
                        className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">
                        Why it Sells (Failure Reason)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Electronic heating element burns out"
                        value={p.failureMode}
                        onChange={(e) => handlePartChange(idx, "failureMode", e.target.value)}
                        className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-mono font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl font-mono transition-all shadow-md"
            >
              Save Vehicle to Catalog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
