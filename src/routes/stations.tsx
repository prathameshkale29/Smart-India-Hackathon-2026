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
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <label className="text-xs text-slate-500 block font-semibold uppercase tracking-wider">
              Select Station / Taluka:
            </label>
            <select
              value={selectedStationId}
              onChange={(e) => setSelectedStationId(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-sm font-bold text-slate-900 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs mt-0.5"
            >
              {WARDHA_STATIONS.map((stn) => (
                <option key={stn.id} value={stn.id}>
                  {stn.name} — {stn.taluka} Taluka ({stn.totalRecords} records)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-5 text-xs font-mono">
          <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-sans font-semibold">COORDINATES</span>
            <span className="text-slate-800 font-bold">
              {currentStation.lat}, {currentStation.lon}
            </span>
          </div>
          <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-sans font-semibold">ELEVATION</span>
            <span className="text-slate-800 font-bold">{currentStation.elevation}</span>
          </div>
          <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-sans font-semibold">NDCQ CSV FILE</span>
            <span className="text-blue-700 font-bold">{currentStation.file}</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Climatology Curve */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                Mean Monthly Rainfall Distribution (mm)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
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
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} fontStyle="bold" />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#cbd5e1",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#0f172a",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(val: any) => [`${val} mm`, "Monthly Mean"]}
                />
                <Bar dataKey="rainfall" fill="#2563eb" radius={[4, 4, 0, 0]}>
                  {currentStation.monthlyNormals.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        ["Jun", "Jul", "Aug", "Sep"].includes(entry.month)
                          ? "#0284c7"
                          : "#2563eb"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Annual Monsoon Totals & Anomaly */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Annual Rainfall Totals (2018–2024)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
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
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
                <XAxis dataKey="year" stroke="#64748b" fontSize={11} fontStyle="bold" />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#cbd5e1",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#0f172a",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(val: any) => [`${val} mm`, "Total Rainfall"]}
                />
                <Area
                  type="monotone"
                  dataKey="rainfall"
                  stroke="#059669"
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
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            Recent Daily Precipitation Sequence ({currentStation.taluka})
          </h3>
          <span className="text-xs text-slate-600 font-medium">
            Historical Record Peak:{" "}
            <strong className="text-amber-700 font-bold">{currentStation.maxRain} mm</strong> (
            {currentStation.maxDate})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-bold">Date</th>
                <th className="py-2.5 px-3 font-bold">Precipitation (mm)</th>
                <th className="py-2.5 px-3 font-bold">Classification</th>
                <th className="py-2.5 px-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {currentStation.recentObservations.map((obs, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition">
                  <td className="py-2.5 px-3 text-slate-700 font-semibold">{obs.date}</td>
                  <td className="py-2.5 px-3 font-extrabold text-blue-700">
                    {obs.rainfall.toFixed(1)} mm
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{obs.category}</td>
                  <td className="py-2.5 px-3">
                    {obs.rainfall >= 50 ? (
                      <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        ⚠️ Heavy Runoff
                      </span>
                    ) : obs.rainfall > 0 ? (
                      <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        💧 Rain Recorded
                      </span>
                    ) : (
                      <span className="text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                        ☀️ Dry Day
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
