import { createFileRoute } from "@tanstack/react-router";
import {
  BrainCircuit,
  RefreshCw,
  WifiOff,
  Wifi,
  ShieldAlert,
  MapPin,
  FileText,
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
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Model Status Banner */}
      {mlLoading ? (
        <div className="bg-white border-2 border-[#002855] rounded-xl p-6 flex items-center justify-center gap-3 shadow-xs">
          <RefreshCw className="w-5 h-5 text-blue-700 animate-spin" />
          <span className="text-slate-800 font-bold text-sm">
            Fetching latest spatial ML prediction bulletin from local NDC pipeline...
          </span>
        </div>
      ) : !modelReady ? (
        <div className="bg-white border-2 border-amber-400 rounded-xl p-6 space-y-4 shadow-xs">
          <div className="flex items-start gap-3">
            <WifiOff className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 uppercase font-mono">
                TELEMETRY FEED STANDBY
              </span>
              <h3 className="text-sm font-extrabold text-slate-900 mt-1">
                Jupyter Model Pipeline Pending — Run Notebook to Generate Live Forecasts
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                The PyTorch / XGBoost model pipeline in{" "}
                <code className="text-[#002855] bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold border border-slate-300">
                  ml/Rainfall_Model.ipynb
                </code>{" "}
                exports IDW downscaled forecasts to{" "}
                <code className="text-[#002855] bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold border border-slate-300">
                  public/ml_outputs/predictions.json
                </code>.
              </p>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-300 rounded-lg p-4 text-xs font-mono text-slate-800 space-y-1.5">
            <div className="text-slate-600 text-[10px] uppercase tracking-wider font-bold mb-1">
              Instructions to trigger live inference:
            </div>
            <div>
              <span className="text-[#002855] font-bold">1.</span> Open Jupyter notebook at{" "}
              <span className="text-blue-700 font-bold">ml/Rainfall_Model.ipynb</span>
            </div>
            <div>
              <span className="text-[#002855] font-bold">2.</span> Execute all cells (Kernel → Restart &amp; Run All)
            </div>
            <div>
              <span className="text-[#002855] font-bold">3.</span> Cell 13 will export{" "}
              <span className="text-blue-700 font-bold">predictions.json</span> directly into the web application.
            </div>
            <div>
              <span className="text-[#002855] font-bold">4.</span> Refresh this page to view live downscaled panchayat forecasts!
            </div>
          </div>
          {mlError && (
            <div className="text-xs text-red-800 bg-red-50 border border-red-300 rounded p-2 font-mono font-bold">
              Pipeline Status: {mlError}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Model Ready — Show all results */}
          {/* Metrics Header Strip */}
          <div className="bg-white border-2 border-emerald-600 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-emerald-700" />
              <div>
                <span className="text-xs font-extrabold text-emerald-950 uppercase tracking-wide block">
                  LIVE MODEL PIPELINE CONNECTED
                </span>
                <span className="text-[11px] text-slate-500 font-mono font-medium">
                  Generated at: {mlData.generated_at ? new Date(mlData.generated_at).toLocaleString() : "N/A"}
                </span>
              </div>
            </div>
            {mlData.model_version && (
              <span className="text-[11px] text-[#002855] font-mono font-bold bg-slate-100 px-3 py-1 rounded border border-slate-300">
                FRAMEWORK: {mlData.model_version}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[10px] uppercase text-slate-500 font-mono font-bold block">
                R² VARIANCE
              </span>
              <div className="text-2xl font-black text-emerald-800 mt-0.5 font-mono">
                {mlData.model_metrics.r2?.toFixed(4)}
              </div>
              <p className="text-[11px] text-slate-500">Test holdout R² score</p>
            </div>
            <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[10px] uppercase text-slate-500 font-mono font-bold block">
                ROOT MEAN SQ ERROR
              </span>
              <div className="text-2xl font-black text-blue-900 mt-0.5 font-mono">
                {mlData.model_metrics.rmse} mm
              </div>
              <p className="text-[11px] text-slate-500">RMSE deviation</p>
            </div>
            <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[10px] uppercase text-slate-500 font-mono font-bold block">
                MEAN ABS ERROR
              </span>
              <div className="text-2xl font-black text-[#002855] mt-0.5 font-mono">
                {mlData.model_metrics.mae} mm
              </div>
              <p className="text-[11px] text-slate-500">Mean absolute error</p>
            </div>
            <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[10px] uppercase text-slate-500 font-mono font-bold block">
                PANCHAYATS COVERED
              </span>
              <div className="text-2xl font-black text-purple-900 mt-0.5 font-mono">
                {new Set(nextDayForecasts.map((p) => p.id)).size}
              </div>
              <p className="text-[11px] text-slate-500">IDW downscaled grid points</p>
            </div>
          </div>

          {/* Risk Summary Badges */}
          {Object.keys(riskSummary).length > 0 && (
            <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-xs">
              <h3 className="text-xs font-bold text-[#002855] uppercase flex items-center gap-2 mb-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                Next 24h Panchayat Inundation Risk Breakdown ({forecastDates[0]})
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {Object.entries(riskSummary).map(([risk, count]) => {
                  const colorMap: Record<string, string> = {
                    "Critical Cloudburst": "text-red-950 border-red-400 bg-red-100",
                    "Heavy Rain Alert": "text-orange-950 border-orange-400 bg-orange-100",
                    "Moderate Rain Watch": "text-yellow-950 border-yellow-400 bg-yellow-100",
                    "Light Rain": "text-blue-950 border-blue-400 bg-blue-100",
                    "Dry / Trace": "text-emerald-950 border-emerald-400 bg-emerald-100",
                  };
                  return (
                    <div
                      key={risk}
                      className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 text-xs font-bold ${
                        colorMap[risk] || "text-slate-800 border-slate-300 bg-slate-50"
                      }`}
                    >
                      <span className="text-base font-black font-mono">{count}</span>
                      <span>{risk}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Panchayat Forecast Table */}
          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-xs">
            <h3 className="text-xs font-bold text-[#002855] uppercase flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-blue-700" />
              Panchayat-Level 24-Hour Precipitation Forecast Bulletin (IDW Spatial Downscaled)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-200 font-mono">
                <thead className="bg-[#002855] text-white uppercase text-[10px] font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Gram Panchayat</th>
                    <th className="py-2.5 px-3">Taluka</th>
                    <th className="py-2.5 px-3 text-right">Predicted Rain</th>
                    <th className="py-2.5 px-3">IMD Alert Classification</th>
                    <th className="py-2.5 px-3">Grid Coordinates</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {nextDayForecasts
                    .sort((a, b) => b.predicted_rain - a.predicted_rain)
                    .map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition">
                        <td className="py-2.5 px-3 font-bold text-slate-900 font-sans">{p.name}</td>
                        <td className="py-2.5 px-3 text-slate-600 font-sans font-medium">{p.taluka}</td>
                        <td
                          className="py-2.5 px-3 text-right font-black"
                          style={{ color: p.risk_color }}
                        >
                          {p.predicted_rain.toFixed(1)} mm
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-bold border uppercase"
                            style={{
                              color: p.risk_color,
                              borderColor: p.risk_color + "66",
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
