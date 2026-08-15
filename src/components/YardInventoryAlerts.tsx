import React, { useState, useEffect } from "react";
import { YardPlanItem, YardInventoryAlert, Chassis, TargetPart } from "../types";
import { 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Check, 
  X, 
  Sparkles, 
  RefreshCw, 
  DollarSign, 
  ArrowUpRight, 
  Tag, 
  Volume2, 
  VolumeX,
  Radio,
  SlidersHorizontal,
  Layers
} from "lucide-react";

interface YardInventoryAlertsProps {
  planItems: YardPlanItem[];
  onUpdateItemValue?: (planItemId: string, newValue: number) => void;
  onCreateListing?: (item: YardPlanItem) => void;
}

export function YardInventoryAlerts({
  planItems,
  onUpdateItemValue,
  onCreateListing
}: YardInventoryAlertsProps) {
  const [alerts, setAlerts] = useState<YardInventoryAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [dismissedIds, setDismissedIds] = useState<Record<string, boolean>>({});
  const [updatedIds, setUpdatedIds] = useState<Record<string, boolean>>({});
  const [isExpanded, setIsExpanded] = useState(true);

  const checkMarketShifts = async (items: YardPlanItem[]) => {
    if (!items || items.length === 0) {
      setAlerts([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/gemini/inventory-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planItems: items })
      });

      const contentType = response.headers.get("content-type") || "";
      if (response.ok && contentType.includes("application/json")) {
        const json = await response.json();
        if (json.success && Array.isArray(json.alerts)) {
          setAlerts(json.alerts);
          setLastScanned(new Date().toISOString());

          // Play gentle chime if new surge alerts and audio enabled
          if (audioEnabled && json.alerts.length > 0) {
            try {
              const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
              gain.gain.setValueAtTime(0.05, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
              osc.start();
              osc.stop(ctx.currentTime + 0.35);
            } catch {
              // AudioContext not available in some sandbox modes
            }
          }
        }
      }
    } catch (err) {
      console.warn("Inventory alerts scan note:", err);
    } finally {
      setLoading(false);
    }
  };

  // Run on mount or when plan count changes
  useEffect(() => {
    if (planItems.length > 0) {
      checkMarketShifts(planItems);
    } else {
      setAlerts([]);
    }
  }, [planItems.length]);

  const activeAlerts = alerts.filter((a) => !dismissedIds[a.id]);

  if (planItems.length === 0) {
    return null;
  }

  const handleApplyNewValue = (alert: YardInventoryAlert) => {
    if (onUpdateItemValue) {
      onUpdateItemValue(alert.planItemId, alert.currentValue);
      setUpdatedIds((prev) => ({ ...prev, [alert.id]: true }));
    }
  };

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div id="yard-inventory-alerts-panel" className="bg-zinc-950/90 border border-amber-500/30 rounded-2xl p-4 shadow-xl space-y-4">
      {/* Alert Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <span className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 block">
              <Bell className="w-4 h-4" />
            </span>
            {activeAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
                Real-Time Yard Inventory Alert System
              </h4>
              <span className="px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold">
                {activeAlerts.length} Active {activeAlerts.length === 1 ? "Alert" : "Alerts"}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              Live market value shift tracker monitoring your {planItems.length} planned salvage pull items
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              audioEnabled
                ? "bg-zinc-800 border-zinc-700 text-zinc-300"
                : "bg-zinc-900 border-zinc-800 text-zinc-500"
            }`}
            title={audioEnabled ? "Alert Chimes Enabled" : "Alert Chimes Muted"}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => checkMarketShifts(planItems)}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 border border-zinc-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-amber-400" : ""}`} />
            <span>{loading ? "Scanning Values..." : "Scan Market Shifts"}</span>
          </button>
        </div>
      </div>

      {/* Alerts List */}
      {activeAlerts.length === 0 ? (
        <div className="p-4 text-center text-xs font-mono text-zinc-400 bg-zinc-900/50 rounded-xl border border-zinc-800/60 flex items-center justify-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>All {planItems.length} planned items are currently stable within ±10% normal market value ranges.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {activeAlerts.map((alert) => {
            const isSurge = alert.shiftDirection === "SURGE";
            const isUpdated = updatedIds[alert.id];
            const matchingPlanItem = planItems.find(
              (p) => p.id === alert.planItemId || p.part.name === alert.partName
            );

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isSurge
                    ? "bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900 border-emerald-500/40 shadow-lg shadow-emerald-500/5"
                    : "bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-900 border-red-500/40"
                }`}
              >
                {/* Alert Left Column */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 border ${
                        isSurge
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-red-500/20 text-red-300 border-red-500/40"
                      }`}
                    >
                      {isSurge ? (
                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-400" />
                      )}
                      <span>
                        PRICE {alert.shiftDirection}: +{alert.shiftPct}% ($
                        {alert.originalValue} → ${alert.currentValue})
                      </span>
                    </span>

                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[11px] font-mono">
                      {alert.vehicle}
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-white font-mono">
                    {alert.partName}
                  </h5>

                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    <strong className="text-amber-400 font-mono text-[11px]">Catalyst: </strong>
                    {alert.reason}
                  </p>

                  <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-2 pt-0.5">
                    <span className="text-zinc-500">Trigger: {alert.marketTrigger}</span>
                    <span>•</span>
                    <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>

                {/* Alert Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {onUpdateItemValue && (
                    <button
                      type="button"
                      onClick={() => handleApplyNewValue(alert)}
                      disabled={isUpdated}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors border ${
                        isUpdated
                          ? "bg-emerald-900/60 text-emerald-200 border-emerald-700/60 cursor-default"
                          : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40"
                      }`}
                    >
                      {isUpdated ? <Check className="w-3.5 h-3.5" /> : <DollarSign className="w-3.5 h-3.5" />}
                      <span>{isUpdated ? "Plan Value Updated" : `Set to $${alert.currentValue}`}</span>
                    </button>
                  )}

                  {onCreateListing && matchingPlanItem && (
                    <button
                      type="button"
                      onClick={() => onCreateListing(matchingPlanItem)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                      title="List this surged part immediately"
                    >
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      <span>List Now</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDismiss(alert.id)}
                    className="p-1.5 text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors"
                    title="Dismiss alert"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
