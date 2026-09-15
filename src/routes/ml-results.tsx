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
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex items-center justify-center gap-3 shadow-sm">
          <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
          <span className="text-slate-700 font-semibold">Loading ML prediction results...</span>
        </div>
      ) : !modelReady ? (
        <div className="bg-white border border-amber-300 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-start gap-3">
            <WifiOff className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Notebook Not Run Yet — Model Output Pending
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                The Jupyter notebook hasn't exported predictions yet. Run all cells in{" "}
                <code className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-mono font-bold border border-blue-200">
                  ml/Rainfall_Model.ipynb
                </code>{" "}
                to generate live panchayat-level forecasts.
              </p>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-mono text-slate-700 space-y-1.5">
            <div className="text-slate-500 text-[10px] uppercase tracking-wider font-bold mb-2">
              How to connect:
            </div>
            <div>
              <span className="text-emerald-700 font-bold">1.</span> Open Jupyter: your notebook is at{" "}
              <span className="text-blue-700 font-bold">ml/Rainfall_Model.ipynb</span>
            </div>
            <div>
              <span className="text-emerald-700 font-bold">2.</span> Run all cells (Kernel → Restart &amp;
              Run All)
            </div>
            <div>
              <span className="text-emerald-700 font-bold">3.</span> Cell 13 auto-copies{" "}
              <span className="text-blue-700 font-bold">predictions.json</span> to{" "}
              <span className="text-blue-700 font-bold">public/ml_outputs/</span>
            </div>
            <div>
              <span className="text-emerald-700 font-bold">4.</span> Refresh this tab — predictions
              appear here instantly!
            </div>
          </div>
          {mlError && (
            <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-2 font-mono font-semibold">
              Error: {mlError}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Model Ready — Show all results */}
          {/* Metrics Row */}
          <div className="flex items-center gap-2 mb-2">
            <Wifi className="w-4 h-4 text-emerald-600" />
            <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Live Model Connected — Generated:{" "}
              {mlData.generated_at ? new Date(mlData.generated_at).toLocaleString() : "N/A"}
            </span>
            {mlData.model_version && (
              <span className="text-[10px] text-slate-700 font-mono font-semibold bg-slate-100 px-2 py-1 rounded border border-slate-200">
                {mlData.model_version}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-sm">
              <span className="text-[10px] uppercase text-slate-500 font-mono font-bold block">
                R² Score
              </span>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1 font-mono">
                {mlData.model_metrics.r2?.toFixed(4)}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Variance explained</p>
            </div>
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-sm">
              <span className="text-[10px] uppercase text-slate-500 font-mono font-bold block">
                RMSE
              </span>
              <div className="text-2xl font-extrabold text-blue-700 mt-1 font-mono">
                {mlData.model_metrics.rmse} mm
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Root mean squared error</p>
            </div>
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-sm">
              <span className="text-[10px] uppercase text-slate-500 font-mono font-bold block">
                MAE
              </span>
              <div className="text-2xl font-extrabold text-cyan-700 mt-1 font-mono">
                {mlData.model_metrics.mae} mm
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Mean absolute error</p>
            </div>
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-sm">
              <span className="text-[10px] uppercase text-slate-500 font-mono font-bold block">
                Panchayats Covered
              </span>
              <div className="text-2xl font-extrabold text-purple-700 mt-1 font-mono">
                {new Set(nextDayForecasts.map((p) => p.id)).size}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Gram Panchayats forecasted</p>
            </div>
          </div>

          {/* Risk Summary */}
          {Object.keys(riskSummary).length > 0 && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Next 24h Panchayat Risk Distribution ({forecastDates[0]})
              </h3>
              <div className="flex flex-wrap gap-3">
                {Object.entries(riskSummary).map(([risk, count]) => {
                  const colorMap: Record<string, string> = {
                    "Critical Cloudburst": "text-red-900 border-red-300 bg-red-50",
                    "Heavy Rain Alert": "text-orange-900 border-orange-300 bg-orange-50",
                    "Moderate Rain Watch":
                      "text-yellow-900 border-yellow-300 bg-yellow-50",
                    "Light Rain": "text-blue-900 border-blue-300 bg-blue-50",
                    "Dry / Trace": "text-emerald-900 border-emerald-300 bg-emerald-50",
                  };
                  return (
                    <div
                      key={risk}
                      className={`flex items-center gap-2 border rounded-xl px-3.5 py-2 text-xs font-bold ${
                        colorMap[risk] || "text-slate-700 border-slate-200 bg-slate-50"
                      }`}
                    >
                      <span className="text-lg font-extrabold">{count}</span>
                      <span>{risk}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Panchayat Forecast Table */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-blue-600" />
              Panchayat-Level 24h Rainfall Forecasts (IDW Downscaled)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 font-bold">Panchayat</th>
                    <th className="py-2.5 px-3 font-bold">Taluka</th>
                    <th className="py-2.5 px-3 text-right font-bold">Pred. Rainfall</th>
                    <th className="py-2.5 px-3 font-bold">Risk Level</th>
                    <th className="py-2.5 px-3 font-mono font-bold">Lat, Lon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {nextDayForecasts
                    .sort((a, b) => b.predicted_rain - a.predicted_rain)
                    .map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-2.5 px-3 font-bold text-slate-900">{p.name}</td>
                        <td className="py-2.5 px-3 text-slate-600 font-medium">{p.taluka}</td>
                        <td
                          className="py-2.5 px-3 text-right font-extrabold"
                          style={{ color: p.risk_color }}
                        >
                          {p.predicted_rain.toFixed(1)} mm
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className="px-2 py-0.5 rounded-md text-[10px] font-bold border"
                            style={{
                              color: p.risk_color,
                              borderColor: p.risk_color + "55",
                              backgroundColor: p.risk_color + "15",
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
