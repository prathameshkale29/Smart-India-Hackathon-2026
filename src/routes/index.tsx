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
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Observations</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">33,680</span>
            <span className="text-xs text-emerald-400 font-medium">+10 CSV Datasets</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Daily IMD Pune NDCQ Records (2010–2024)</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Wardha Avg Annual Rain</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">1,128.4</span>
            <span className="text-xs text-slate-400">mm / yr</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Monsoon dominance: 88.5% (Jun–Sep)</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Highest Historical Deluge</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400">256.0 mm</span>
            <span className="text-xs text-slate-400">@ Selu</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Cloudburst event on 18-07-2013</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">AI Model Precision (R²)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400">0.894</span>
            <span className="text-xs text-emerald-400/80">RMSE: 4.18mm</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Bi-LSTM + XGBoost Stacked Ensemble</p>
        </div>
      </div>

      {/* Wardha District Spatial Matrix & Taluka Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Taluka Grid (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                Wardha District Taluka Sensor Network (10 Stations)
              </h2>
              <p className="text-xs text-slate-400">Real-time parsed status from station records</p>
            </div>
            <Link
              to="/prediction"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 transition hover:scale-[1.02]"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              Simulate Prediction
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {WARDHA_STATIONS.map((stn) => {
              const statusColors = {
                Normal: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                Watch: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
                Alert: "bg-orange-500/10 text-orange-400 border-orange-500/30",
                Warning: "bg-red-500/10 text-red-400 border-red-500/30",
              };

              return (
                <Link
                  key={stn.id}
                  to="/stations"
                  search={{ station: stn.id }}
                  className="bg-slate-900/90 border border-slate-800/90 hover:border-blue-500/50 rounded-xl p-3.5 cursor-pointer transition group hover:shadow-md hover:shadow-blue-500/5 block"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-blue-400 transition flex items-center gap-1.5">
                        {stn.name}
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-blue-400" />
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        {stn.lat} • {stn.lon}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md border ${
                        statusColors[stn.status]
                      }`}
                    >
                      {stn.status}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
                    <div className="bg-slate-950/40 rounded-lg p-1.5">
                      <span className="text-[10px] text-slate-500 block">24h Precip</span>
                      <span className="text-xs font-bold text-cyan-400">{stn.current24h} mm</span>
                    </div>
                    <div className="bg-slate-950/40 rounded-lg p-1.5">
                      <span className="text-[10px] text-slate-500 block">Annual Avg</span>
                      <span className="text-xs font-bold text-slate-300">{stn.avgAnnual} mm</span>
                    </div>
                    <div className="bg-slate-950/40 rounded-lg p-1.5">
                      <span className="text-[10px] text-slate-500 block">Max Record</span>
                      <span className="text-xs font-bold text-amber-400">{stn.maxRain} mm</span>
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
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Spatial Distribution (Wardha)
              </h3>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                GIS Schematic
              </span>
            </div>

            {/* 2D Coordinate Grid Visualizer */}
            <div className="relative h-64 bg-slate-950/90 rounded-xl border border-slate-800 p-3 overflow-hidden flex flex-col justify-between">
              {/* Background grid lines */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>

              <div className="relative z-10 text-[10px] text-slate-500 flex justify-between font-mono">
                <span>21.2° N (North / Ashti)</span>
                <span>Wardha River Basin</span>
              </div>

              {/* Interactive Plot Nodes */}
              <div className="relative w-full h-44 z-10">
                {WARDHA_STATIONS.map((stn) => {
                  const topPercent = 100 - ((stn.coords[0] - 20.0) / 1.25) * 85 - 8;
                  const leftPercent = ((stn.coords[1] - 78.12) / 0.78) * 85 + 5;

                  const haloColors = {
                    Normal: "bg-emerald-500",
                    Watch: "bg-yellow-500",
                    Alert: "bg-orange-500",
                    Warning: "bg-red-500",
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
                          className={`w-3 h-3 rounded-full ${haloColors[stn.status]} opacity-80 group-hover:scale-125 transition`}
                        ></span>
                        <span
                          className={`absolute w-6 h-6 rounded-full ${haloColors[stn.status]} opacity-20 animate-ping`}
                        ></span>
                      </div>
                      <span className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold bg-slate-900/90 text-slate-200 px-1.5 py-0.5 rounded border border-slate-700 shadow pointer-events-none group-hover:scale-110 transition">
                        {stn.taluka}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="relative z-10 text-[10px] text-slate-500 flex justify-between font-mono">
                <span>20.0° N (South / Samudrapur)</span>
                <span>78.15° E &rarr; 78.87° E</span>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Normal
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-yellow-400"></span> Watch
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-400"></span> Alert
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400"></span> Warning
              </span>
            </div>
          </div>

          {/* AI Early Warning Advisory Box */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-4 shadow-lg shadow-amber-500/5">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-4 h-4" />
              Automated Inundation Advisory
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Elevated soil moisture saturation in{" "}
              <strong className="text-white">Hinganghat (68.4mm)</strong> &amp;{" "}
              <strong className="text-white">Samudrapur (52.0mm)</strong> basins indicates 78% probability of
              lowland runoff spillover along Vena river tributory within the next 18 hours.
            </p>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2">
              <span>Generated by HydroEnsemble AI</span>
              <Link
                to="/prediction"
                className="text-blue-400 hover:underline font-medium flex items-center gap-1"
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
