import { createFileRoute } from "@tanstack/react-router";
import {
  BrainCircuit,
  RefreshCw,
  WifiOff,
  Wifi,
  ShieldAlert,
  MapPin,
} from "lucide-react";
import { useMLPredictions } from "@/hooks/useMLPredictions";

export const Route = createFileRoute("/ml-results")({
  component: MLResultsPage,
});

function MLResultsPage() {
  const {
    data: mlData,
    loading: mlLoading,
    error: mlError,
    modelReady,
    nextDayForecasts,
    riskSummary,
    forecastDates,
  } = useMLPredictions();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Model Status Banner */}
      {mlLoading ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
          <span className="text-slate-300">Loading ML prediction results...</span>
        </div>
      ) : !modelReady ? (
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <WifiOff className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Notebook Not Run Yet — Model Output Pending
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                The Jupyter notebook hasn't exported predictions yet. Run all cells in{" "}
                <code className="text-cyan-400 bg-slate-950 px-1 py-0.5 rounded">
                  ml/Rainfall_Model.ipynb
                </code>{" "}
                to generate live panchayat-level forecasts.
              </p>
            </div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 space-y-1">
            <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-2">
              How to connect:
            </div>
            <div>
              <span className="text-emerald-400">1.</span> Open Jupyter: your notebook is at{" "}
              <span className="text-cyan-400">ml/Rainfall_Model.ipynb</span>
            </div>
            <div>
              <span className="text-emerald-400">2.</span> Run all cells (Kernel → Restart &amp;
              Run All)
            </div>
            <div>
              <span className="text-emerald-400">3.</span> Cell 13 auto-copies{" "}
              <span className="text-cyan-400">predictions.json</span> to{" "}
              <span className="text-cyan-400">public/ml_outputs/</span>
            </div>
            <div>
              <span className="text-emerald-400">4.</span> Refresh this tab — predictions
              appear here instantly!
            </div>
          </div>
          {mlError && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2 font-mono">
              Error: {mlError}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Model Ready — Show all results */}
          {/* Metrics Row */}
          <div className="flex items-center gap-2 mb-2">
            <Wifi className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-semibold">
              Live Model Connected — Generated:{" "}
              {mlData.generated_at ? new Date(mlData.generated_at).toLocaleString() : "N/A"}
            </span>
            {mlData.model_version && (
              <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded">
                {mlData.model_version}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <span className="text-[10px] uppercase text-slate-400 font-mono block">
                R² Score
              </span>
              <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">
                {mlData.model_metrics.r2?.toFixed(4)}
              </div>
              <p className="text-[11px] text-slate-500">Variance explained</p>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <span className="text-[10px] uppercase text-slate-400 font-mono block">
                RMSE
              </span>
              <div className="text-2xl font-bold text-blue-400 mt-1 font-mono">
                {mlData.model_metrics.rmse} mm
              </div>
              <p className="text-[11px] text-slate-500">Root mean squared error</p>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <span className="text-[10px] uppercase text-slate-400 font-mono block">
                MAE
              </span>
              <div className="text-2xl font-bold text-cyan-400 mt-1 font-mono">
                {mlData.model_metrics.mae} mm
              </div>
              <p className="text-[11px] text-slate-500">Mean absolute error</p>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <span className="text-[10px] uppercase text-slate-400 font-mono block">
                Panchayats Covered
              </span>
              <div className="text-2xl font-bold text-purple-400 mt-1 font-mono">
                {new Set(nextDayForecasts.map((p) => p.id)).size}
              </div>
              <p className="text-[11px] text-slate-500">Gram Panchayats forecasted</p>
            </div>
          </div>

          {/* Risk Summary */}
          {Object.keys(riskSummary).length > 0 && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Next 24h Panchayat Risk Distribution ({forecastDates[0]})
              </h3>
              <div className="flex flex-wrap gap-3">
                {Object.entries(riskSummary).map(([risk, count]) => {
                  const colorMap: Record<string, string> = {
                    "Critical Cloudburst": "text-red-400 border-red-500/30 bg-red-500/10",
                    "Heavy Rain Alert": "text-orange-400 border-orange-500/30 bg-orange-500/10",
                    "Moderate Rain Watch":
                      "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
                    "Light Rain": "text-blue-400 border-blue-500/30 bg-blue-500/10",
                    "Dry / Trace": "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
                  };
                  return (
                    <div
                      key={risk}
                      className={`flex items-center gap-2 border rounded-xl px-3 py-2 text-xs font-semibold ${
                        colorMap[risk] || "text-slate-400 border-slate-700"
                      }`}
                    >
                      <span className="text-lg font-bold">{count}</span>
                      <span>{risk}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Panchayat Forecast Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-cyan-400" />
              Panchayat-Level 24h Rainfall Forecasts (IDW Downscaled)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Panchayat</th>
                    <th className="py-2.5 px-3">Taluka</th>
                    <th className="py-2.5 px-3 text-right">Pred. Rainfall</th>
                    <th className="py-2.5 px-3">Risk Level</th>
                    <th className="py-2.5 px-3 font-mono">Lat, Lon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {nextDayForecasts
                    .sort((a, b) => b.predicted_rain - a.predicted_rain)
                    .map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-2.5 px-3 font-semibold text-white">{p.name}</td>
                        <td className="py-2.5 px-3 text-slate-400">{p.taluka}</td>
                        <td
                          className="py-2.5 px-3 text-right font-bold"
                          style={{ color: p.risk_color }}
                        >
                          {p.predicted_rain.toFixed(1)} mm
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className="px-2 py-0.5 rounded-md text-[10px] font-bold border"
                            style={{
                              color: p.risk_color,
                              borderColor: p.risk_color + "44",
                              backgroundColor: p.risk_color + "18",
                            }}
                          >
                            {p.risk_level}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 text-[10px]">
                          {p.lat}° N, {p.lon}° E
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
