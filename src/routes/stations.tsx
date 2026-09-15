import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  MapPin,
  BarChart3,
  TrendingUp,
  Calendar,
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Station Selector Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <label className="text-xs text-slate-400 block font-medium">
              Select Station / Taluka:
            </label>
            <select
              value={selectedStationId}
              onChange={(e) => setSelectedStationId(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-sm font-bold text-white rounded-lg px-3 py-1 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {WARDHA_STATIONS.map((stn) => (
                <option key={stn.id} value={stn.id}>
                  {stn.name} — {stn.taluka} Taluka ({stn.totalRecords} records)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px]">COORDINATES</span>
            <span className="text-slate-300">
              {currentStation.lat}, {currentStation.lon}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">ELEVATION</span>
            <span className="text-slate-300">{currentStation.elevation}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">CSV FILE</span>
            <span className="text-cyan-400 font-semibold">{currentStation.file}</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Climatology Curve */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                Mean Monthly Rainfall Distribution (mm)
              </h3>
              <p className="text-xs text-slate-400">
                Long-term climatological normal (June–Sept Monsoon Spike)
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={currentStation.monthlyNormals}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(val: any) => [`${val} mm`, "Monthly Mean"]}
                />
                <Bar dataKey="rainfall" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {currentStation.monthlyNormals.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        ["Jun", "Jul", "Aug", "Sep"].includes(entry.month)
                          ? "#06b6d4"
                          : "#3b82f6"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Annual Monsoon Totals & Anomaly */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Annual Rainfall Totals (2018–2024)
              </h3>
              <p className="text-xs text-slate-400">
                Total cumulative precipitation vs {currentStation.avgAnnual}mm baseline
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={currentStation.yearlyTrends}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(val: any) => [`${val} mm`, "Total Rainfall"]}
                />
                <Area
                  type="monotone"
                  dataKey="rainfall"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#rainGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Daily Observations Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            Recent Daily Precipitation Sequence ({currentStation.taluka})
          </h3>
          <span className="text-xs text-slate-400">
            Historical Record Peak:{" "}
            <strong className="text-amber-400">{currentStation.maxRain} mm</strong> (
            {currentStation.maxDate})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Precipitation (mm)</th>
                <th className="py-2.5 px-3">Classification</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {currentStation.recentObservations.map((obs, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition">
                  <td className="py-2.5 px-3 text-slate-300 font-medium">{obs.date}</td>
                  <td className="py-2.5 px-3 font-bold text-cyan-400">
                    {obs.rainfall.toFixed(1)} mm
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{obs.category}</td>
                  <td className="py-2.5 px-3">
                    {obs.rainfall >= 50 ? (
                      <span className="text-red-400 font-semibold">⚠️ Heavy Runoff</span>
                    ) : obs.rainfall > 0 ? (
                      <span className="text-blue-400">💧 Rain Recorded</span>
                    ) : (
                      <span className="text-slate-500">☀️ Dry Day</span>
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
