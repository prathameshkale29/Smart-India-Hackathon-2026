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
  Radio,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";
import { WARDHA_STATIONS } from "@/data/wardhaData";

export const Route = createFileRoute("/")({
  component: OverviewPage,
});

function OverviewPage() {
  const warningMatrix = [
    { day: "Day 1 (Today)", date: "15-Sep", level: "Alert", color: "bg-orange-500 text-white", desc: "Heavy rain at isolated places (Hinganghat, Samudrapur)" },
    { day: "Day 2", date: "16-Sep", level: "Alert", color: "bg-orange-500 text-white", desc: "Moderate to heavy showers with localized waterlogging" },
    { day: "Day 3", date: "17-Sep", level: "Watch", color: "bg-yellow-400 text-slate-900", desc: "Scattered moderate rain across central talukas" },
    { day: "Day 4", date: "18-Sep", level: "No Warning", color: "bg-emerald-600 text-white", desc: "Light rain / generally cloudy sky" },
    { day: "Day 5", date: "19-Sep", level: "No Warning", color: "bg-emerald-600 text-white", desc: "Trace to light scattered precipitation" },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* IMD 5-Day District Warning Matrix Bar */}
      <div className="bg-white border-2 border-[#002855] rounded-xl p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></span>
            <h2 className="text-xs font-bold text-[#002855] uppercase tracking-wider">
              IMD 5-Day Sub-Divisional Hydrometeorological Warning Matrix — Wardha District (044)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500 font-semibold">
            Standard: IMD Met Centre Nagpur Bulletin Ref #44/2026
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 mt-3">
          {warningMatrix.map((item, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center">
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase mb-1">
                <span>{item.day}</span>
                <span className="font-mono">{item.date}</span>
              </div>
              <span className={`inline-block w-full py-1 text-xs font-bold rounded ${item.color} uppercase shadow-2xs`}>
                {item.level}
              </span>
              <p className="text-[10px] text-slate-600 mt-1.5 line-clamp-2 leading-tight font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Climatology & AI Telemetry Metric Dossier */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
              Total NDCQ Records
            </span>
            <div className="w-7 h-7 rounded bg-[#002855] text-white flex items-center justify-center">
              <Database className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#002855] font-mono">33,680</span>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
              10 STATIONS
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-medium">Daily NDCQ Records (2010–2024)</p>
        </div>

        <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
              District Normal Rain (LPA)
            </span>
            <div className="w-7 h-7 rounded bg-[#003875] text-white flex items-center justify-center">
              <Droplets className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">1,128.4</span>
            <span className="text-xs text-slate-600 font-semibold font-mono">mm / yr</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-medium">Monsoon Climatology (88.5% Jun–Sep)</p>
        </div>

        <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
              Historical Peak Deluge
            </span>
            <div className="w-7 h-7 rounded bg-amber-600 text-white flex items-center justify-center">
              <Flame className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-800 font-mono">256.0 mm</span>
            <span className="text-xs text-slate-600 font-semibold">@ Selu</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-medium">Extreme Cloudburst Event (18-07-2013)</p>
        </div>

        <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
              AI Ensemble Precision (R²)
            </span>
            <div className="w-7 h-7 rounded bg-emerald-700 text-white flex items-center justify-center">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-800 font-mono">0.894</span>
            <span className="text-[10px] text-emerald-900 font-bold bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
              RMSE: 4.18mm
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-medium">Bi-LSTM + XGBoost Stacked Model</p>
        </div>
      </div>

      {/* Wardha District Telemetry Matrix & GIS Basin Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Taluka Meteorological Stations Table (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-300 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
            <div>
              <h2 className="text-xs font-bold text-[#002855] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#002855]" />
                Wardha District Telemetry Station Network (10 Automatic Rainfall Stations)
              </h2>
              <p className="text-[11px] text-slate-500">Real-time parsed status from IMD NDCQ standard CSV records</p>
            </div>
            <Link
              to="/prediction"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-[#002855] hover:bg-[#003875] px-2.5 py-1.5 rounded transition shadow-2xs"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              Run AI Simulator
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200">
              <thead className="bg-[#002855] text-white uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2 px-2.5">Taluka / Station</th>
                  <th className="py-2 px-2 font-mono">Lat, Lon</th>
                  <th className="py-2 px-2 text-right">24h Rain</th>
                  <th className="py-2 px-2 text-right">Annual Mean</th>
                  <th className="py-2 px-2 text-center">IMD Status</th>
                  <th className="py-2 px-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {WARDHA_STATIONS.map((stn) => {
                  const statusBadges = {
                    Normal: "bg-emerald-100 text-emerald-900 border-emerald-300",
                    Watch: "bg-yellow-100 text-yellow-900 border-yellow-300",
                    Alert: "bg-orange-100 text-orange-900 border-orange-300",
                    Warning: "bg-red-100 text-red-900 border-red-300",
                  };

                  return (
                    <tr key={stn.id} className="hover:bg-slate-50 transition">
                      <td className="py-2 px-2.5 font-bold text-[#002855] font-sans">
                        {stn.name} <span className="text-[10px] text-slate-500 font-normal">({stn.taluka})</span>
                      </td>
                      <td className="py-2 px-2 text-slate-600 text-[10px]">
                        {stn.lat}° N, {stn.lon}° E
                      </td>
                      <td className="py-2 px-2 text-right font-bold text-blue-900">
                        {stn.current24h} mm
                      </td>
                      <td className="py-2 px-2 text-right text-slate-700">
                        {stn.avgAnnual} mm
                      </td>
                      <td className="py-2 px-2 text-center">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${statusBadges[stn.status]}`}>
                          {stn.status}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center">
                        <Link
                          to="/stations"
                          search={{ station: stn.id }}
                          className="text-[11px] font-bold text-blue-700 hover:text-blue-900 hover:underline"
                        >
                          Telemetry &rarr;
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: GIS Isohyetal Coordinate Visualizer & Advisory (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* GIS Coordinate Radar Map */}
          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-[#002855] uppercase flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                Wardha River Basin GIS Radar Grid
              </h3>
              <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Spatial Telemetry
              </span>
            </div>

            {/* 2D Coordinate Grid Visualizer */}
            <div className="relative h-60 bg-[#001a38] rounded-lg border-2 border-[#002855] p-3 overflow-hidden flex flex-col justify-between shadow-inner">
              {/* Background grid lines */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>

              <div className="relative z-10 text-[10px] text-cyan-300 flex justify-between font-mono font-bold">
                <span>21.2° N (North / Ashti)</span>
                <span className="text-slate-400">Wardha River Basin</span>
              </div>

              {/* Interactive Plot Nodes */}
              <div className="relative w-full h-40 z-10">
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
                      title={`${stn.name} (${stn.taluka}) - 24h: ${stn.current24h}mm`}
                    >
                      <div className="relative flex items-center justify-center">
                        <span
                          className={`w-3.5 h-3.5 rounded-full ${haloColors[stn.status]} shadow-md group-hover:scale-125 transition`}
                        ></span>
                        <span
                          className={`absolute w-6 h-6 rounded-full ${haloColors[stn.status]} opacity-30 animate-ping`}
                        ></span>
                      </div>
                      <span className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold bg-[#002855] text-white px-1.5 py-0.5 rounded border border-[#004080] shadow pointer-events-none group-hover:scale-110 transition">
                        {stn.taluka}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="relative z-10 text-[10px] text-cyan-300 flex justify-between font-mono font-bold">
                <span>20.0° N (South / Samudrapur)</span>
                <span>78.15° E &rarr; 78.87° E</span>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-600 pt-2 border-t border-slate-200 font-bold uppercase">
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

          {/* Official Inundation Advisory Box */}
          <div className="bg-gradient-to-br from-[#fff7ed] to-[#ffedd5] border-2 border-orange-400 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-1.5 text-orange-950 text-xs font-black uppercase tracking-wider mb-1.5">
              <ShieldAlert className="w-4 h-4 text-orange-600" />
              HYDROLOGICAL INUNDATION ADVISORY (VENA BASIN)
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              Elevated soil moisture saturation in{" "}
              <strong className="text-black font-bold">Hinganghat (68.4mm)</strong> &amp;{" "}
              <strong className="text-black font-bold">Samudrapur (52.0mm)</strong> indicates 78% probability of
              lowland runoff spillover along Vena river tributary within the next 18 hours.
            </p>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600 border-t border-orange-300 pt-2 font-semibold">
              <span>National Met Decision Framework</span>
              <Link
                to="/prediction"
                className="text-[#002855] hover:underline font-bold"
              >
                Run Custom Simulation &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
