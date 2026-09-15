import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Database,
  Droplets,
  Flame,
  Activity,
  MapPin,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import { WARDHA_STATIONS } from "@/data/wardhaData";

export const Route = createFileRoute("/")({
  component: OverviewPage,
});

function OverviewPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-sm hover:border-slate-300 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Total Observations
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">33,680</span>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              +10 Datasets
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-medium">Daily IMD Pune NDCQ Records (2010–2024)</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-sm hover:border-slate-300 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Wardha Avg Annual Rain
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center border border-cyan-100">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">1,128.4</span>
            <span className="text-xs text-slate-600 font-semibold">mm / yr</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-medium">Monsoon dominance: 88.5% (Jun–Sep)</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-sm hover:border-slate-300 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Highest Historical Deluge
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-700 tracking-tight">256.0 mm</span>
            <span className="text-xs text-slate-600 font-semibold">@ Selu</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-medium">Cloudburst event on 18-07-2013</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-sm hover:border-slate-300 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              AI Model Precision (R²)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-700 tracking-tight">0.894</span>
            <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              RMSE: 4.18mm
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-medium">Bi-LSTM + XGBoost Stacked Ensemble</p>
        </div>
      </div>

      {/* Wardha District Spatial Matrix & Taluka Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Taluka Grid (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Wardha District Taluka Sensor Network (10 Stations)
              </h2>
              <p className="text-xs text-slate-500 font-medium">Real-time parsed status from station records</p>
            </div>
            <Link
              to="/prediction"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 shadow-2xs transition hover:bg-blue-100"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Simulate Prediction
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {WARDHA_STATIONS.map((stn) => {
              const statusColors = {
                Normal: "bg-emerald-50 text-emerald-700 border-emerald-300",
                Watch: "bg-yellow-50 text-yellow-800 border-yellow-300",
                Alert: "bg-orange-50 text-orange-800 border-orange-300",
                Warning: "bg-red-50 text-red-800 border-red-300",
              };

              return (
                <Link
                  key={stn.id}
                  to="/stations"
                  search={{ station: stn.id }}
                  className="bg-white border border-slate-200/90 hover:border-blue-400 rounded-xl p-3.5 cursor-pointer transition group shadow-2xs hover:shadow-md block"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition flex items-center gap-1.5">
                        {stn.name}
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-blue-600" />
                      </div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">
                        {stn.lat} • {stn.lon}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                        statusColors[stn.status]
                      }`}
                    >
                      {stn.status}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                    <div className="bg-slate-50 rounded-lg p-1.5 border border-slate-100">
                      <span className="text-[10px] text-slate-500 font-medium block">24h Precip</span>
                      <span className="text-xs font-extrabold text-blue-700">{stn.current24h} mm</span>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-1.5 border border-slate-100">
                      <span className="text-[10px] text-slate-500 font-medium block">Annual Avg</span>
                      <span className="text-xs font-extrabold text-slate-700">{stn.avgAnnual} mm</span>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-1.5 border border-slate-100">
                      <span className="text-[10px] text-slate-500 font-medium block">Max Record</span>
                      <span className="text-xs font-extrabold text-amber-700">{stn.maxRain} mm</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: District Map Schematic & Live Alerts */}
        <div className="space-y-4">
          {/* District Schematic Visual Map */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                Spatial Distribution (Wardha)
              </h3>
              <span className="text-[10px] text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                GIS Coordinate Map
              </span>
            </div>

            {/* 2D Coordinate Grid Visualizer */}
            <div className="relative h-64 bg-slate-950 rounded-xl border border-slate-800 p-3 overflow-hidden flex flex-col justify-between shadow-inner">
              {/* Background grid lines */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>

              <div className="relative z-10 text-[10px] text-slate-400 flex justify-between font-mono font-medium">
                <span>21.2° N (North / Ashti)</span>
                <span>Wardha River Basin</span>
              </div>

              {/* Interactive Plot Nodes */}
              <div className="relative w-full h-44 z-10">
                {WARDHA_STATIONS.map((stn) => {
                  const topPercent = 100 - ((stn.coords[0] - 20.0) / 1.25) * 85 - 8;
                  const leftPercent = ((stn.coords[1] - 78.12) / 0.78) * 85 + 5;

                  const haloColors = {
                    Normal: "bg-emerald-400",
                    Watch: "bg-yellow-400",
                    Alert: "bg-orange-400",
                    Warning: "bg-red-400",
                  };

                  return (
                    <Link
                      key={stn.id}
                      to="/stations"
                      search={{ station: stn.id }}
                      style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                      title={`${stn.name} (${stn.taluka}) - Current 24h: ${stn.current24h}mm`}
                    >
                      <div className="relative flex items-center justify-center">
                        <span
                          className={`w-3.5 h-3.5 rounded-full ${haloColors[stn.status]} shadow-md group-hover:scale-125 transition`}
                        ></span>
                        <span
                          className={`absolute w-6 h-6 rounded-full ${haloColors[stn.status]} opacity-30 animate-ping`}
                        ></span>
                      </div>
                      <span className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded border border-slate-700 shadow pointer-events-none group-hover:scale-110 transition">
                        {stn.taluka}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="relative z-10 text-[10px] text-slate-400 flex justify-between font-mono font-medium">
                <span>20.0° N (South / Samudrapur)</span>
                <span>78.15° E &rarr; 78.87° E</span>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-100 font-medium">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Normal
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span> Watch
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Alert
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Warning
              </span>
            </div>
          </div>

          {/* AI Early Warning Advisory Box */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-4.5 shadow-sm">
            <div className="flex items-center gap-2 text-amber-900 text-xs font-extrabold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Automated Inundation Advisory
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Elevated soil moisture saturation in{" "}
              <strong className="text-slate-900 font-bold">Hinganghat (68.4mm)</strong> &amp;{" "}
              <strong className="text-slate-900 font-bold">Samudrapur (52.0mm)</strong> basins indicates 78% probability of
              lowland runoff spillover along Vena river tributory within the next 18 hours.
            </p>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600 border-t border-amber-200 pt-2 font-medium">
              <span>Generated by HydroEnsemble AI</span>
              <Link
                to="/prediction"
                className="text-blue-700 hover:text-blue-900 hover:underline font-bold flex items-center gap-1"
              >
                Run custom scenario &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
