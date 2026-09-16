import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  MapPin,
  BarChart3,
  TrendingUp,
  Calendar,
  Building2,
  FileSpreadsheet,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { WARDHA_STATIONS } from "@/data/wardhaData";
import { z } from "zod";

const stationsSearchSchema = z.object({
  station: z.string().optional(),
});

export const Route = createFileRoute("/stations")({
  validateSearch: stationsSearchSchema,
  component: StationsPage,
});

function StationsPage() {
  const search = Route.useSearch();
  const [selectedStationId, setSelectedStationId] = useState<string>(
    search.station || "arvi"
  );

  useEffect(() => {
    if (search.station && WARDHA_STATIONS.some((s) => s.id === search.station)) {
      setSelectedStationId(search.station);
    }
  }, [search.station]);

  const currentStation = useMemo(() => {
    return (
      WARDHA_STATIONS.find((s) => s.id === selectedStationId) ||
      WARDHA_STATIONS[0]
    );
  }, [selectedStationId]);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Station Selector & Meteorological Dossier Masthead */}
      <div className="bg-white border-2 border-[#002855] rounded-xl p-4.5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#002855] text-white flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                IMD NDCQ Telemetry Station Dossier
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <select
                  value={selectedStationId}
                  onChange={(e) => setSelectedStationId(e.target.value)}
                  className="bg-slate-50 border border-slate-400 text-sm font-bold text-[#002855] rounded px-3 py-1 focus:outline-none focus:border-blue-700 cursor-pointer"
                >
                  {WARDHA_STATIONS.map((stn) => (
                    <option key={stn.id} value={stn.id}>
                      {stn.name} (Taluka: {stn.taluka}) — Records: {stn.totalRecords}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="bg-slate-50 border border-slate-300 px-2.5 py-1 rounded">
              <span className="text-slate-500 text-[10px] block font-sans font-bold">LATITUDE &amp; LONGITUDE</span>
              <span className="text-[#002855] font-bold">{currentStation.lat}° N, {currentStation.lon}° E</span>
            </div>
            <div className="bg-slate-50 border border-slate-300 px-2.5 py-1 rounded">
              <span className="text-slate-500 text-[10px] block font-sans font-bold">ALTITUDE (MSL)</span>
              <span className="text-slate-900 font-bold">{currentStation.elevation}</span>
            </div>
            <div className="bg-slate-50 border border-slate-300 px-2.5 py-1 rounded">
              <span className="text-slate-500 text-[10px] block font-sans font-bold">NDCQ ARCHIVE FILE</span>
              <span className="text-blue-700 font-bold">{currentStation.file}</span>
            </div>
          </div>
        </div>

        {/* Climatological Overview Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-1 text-center font-mono">
          <div className="bg-slate-50 p-2 rounded border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold font-sans uppercase block">24h Precip</span>
            <span className="text-base font-black text-blue-900">{currentStation.current24h} mm</span>
          </div>
          <div className="bg-slate-50 p-2 rounded border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold font-sans uppercase block">Annual LPA Normal</span>
            <span className="text-base font-black text-slate-900">{currentStation.avgAnnual} mm</span>
          </div>
          <div className="bg-slate-50 p-2 rounded border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold font-sans uppercase block">Historical Peak Record</span>
            <span className="text-base font-black text-amber-800">{currentStation.maxRain} mm</span>
          </div>
          <div className="bg-slate-50 p-2 rounded border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold font-sans uppercase block">Peak Date Event</span>
            <span className="text-sm font-bold text-slate-700">{currentStation.maxDate}</span>
          </div>
        </div>
      </div>

      {/* Climatology & Anomaly Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Monthly Climatology Curve */}
        <div className="bg-white border border-slate-300 rounded-xl p-4.5 space-y-2 shadow-xs">
          <div>
            <h3 className="text-xs font-bold text-[#002855] uppercase flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-blue-700" />
              Monthly Climatological Mean Precipitation (mm)
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              30-Year Climatological Baseline Distribution (Spike in June–September SW Monsoon)
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={currentStation.monthlyNormals}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#475569" fontSize={11} fontStyle="bold" />
                <YAxis stroke="#475569" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#002855",
                    borderColor: "#001a38",
                    borderRadius: "4px",
                    fontSize: "12px",
                    color: "#ffffff",
                  }}
                  formatter={(val: any) => [`${val} mm`, "Monthly Mean"]}
                />
                <Bar dataKey="rainfall" fill="#003875" radius={[2, 2, 0, 0]}>
                  {currentStation.monthlyNormals.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        ["Jun", "Jul", "Aug", "Sep"].includes(entry.month)
                          ? "#004b99"
                          : "#002855"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Annual Cumulative Rainfall Trend */}
        <div className="bg-white border border-slate-300 rounded-xl p-4.5 space-y-2 shadow-xs">
          <div>
            <h3 className="text-xs font-bold text-[#002855] uppercase flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              Annual Precipitation Trend (2018–2024 vs Baseline)
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Total cumulative rain comparison against {currentStation.avgAnnual}mm normal baseline
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={currentStation.yearlyTrends}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#004b99" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#004b99" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#475569" fontSize={11} fontStyle="bold" />
                <YAxis stroke="#475569" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#002855",
                    borderColor: "#001a38",
                    borderRadius: "4px",
                    fontSize: "12px",
                    color: "#ffffff",
                  }}
                  formatter={(val: any) => [`${val} mm`, "Total Rainfall"]}
                />
                <Area
                  type="monotone"
                  dataKey="rainfall"
                  stroke="#002855"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#rainGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Daily Observations Table */}
      <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-200">
          <h3 className="text-xs font-bold text-[#002855] uppercase flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-700" />
            Recent Daily Meteorological Observations Log ({currentStation.taluka} Station)
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">
            Historical Max: <strong className="text-amber-800">{currentStation.maxRain} mm</strong> ({currentStation.maxDate})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border border-slate-200 font-mono">
            <thead className="bg-[#002855] text-white uppercase text-[10px] font-bold">
              <tr>
                <th className="py-2 px-3">Date (DD-MM-YYYY)</th>
                <th className="py-2 px-3 text-right">Precipitation (mm)</th>
                <th className="py-2 px-3">IMD Rainfall Intensity Category</th>
                <th className="py-2 px-3 text-center">Observation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentStation.recentObservations.map((obs, i) => (
                <tr key={i} className="hover:bg-slate-50 transition">
                  <td className="py-2 px-3 text-slate-800 font-bold">{obs.date}</td>
                  <td className="py-2 px-3 text-right font-black text-blue-900">
                    {obs.rainfall.toFixed(1)} mm
                  </td>
                  <td className="py-2 px-3 text-slate-700 font-sans font-medium">{obs.category}</td>
                  <td className="py-2 px-3 text-center">
                    {obs.rainfall >= 50 ? (
                      <span className="text-red-900 font-bold bg-red-100 px-2 py-0.5 rounded border border-red-300 text-[10px]">
                        ⚠️ HEAVY RUNOFF
                      </span>
                    ) : obs.rainfall > 0 ? (
                      <span className="text-blue-900 font-bold bg-blue-100 px-2 py-0.5 rounded border border-blue-300 text-[10px]">
                        💧 RAIN RECORDED
                      </span>
                    ) : (
                      <span className="text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                        ☀️ DRY SPELL
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
