import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Layers,
  Activity,
  GraduationCap,
  Play,
  BrainCircuit,
  Binary,
  GitBranch,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { ML_MODEL_METRICS, PROJECT_METADATA } from "@/data/wardhaData";

export const Route = createFileRoute("/architecture")({
  component: ArchitecturePage,
});

function ArchitecturePage() {
  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Architecture Specs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[10px] uppercase text-slate-500 font-mono font-bold block">
            MODEL ARCHITECTURE
          </span>
          <div className="text-sm font-black text-[#002855] mt-0.5 font-mono">
            Stacked Bi-LSTM + XGBoost
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Sequential temporal encoder + non-linear decision forest
          </p>
        </div>

        <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[10px] uppercase text-slate-500 font-mono font-bold block">
            ACCURACY (R² SCORE)
          </span>
          <div className="text-2xl font-black text-emerald-800 mt-0.5 font-mono">0.894 (89.4%)</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Evaluated on 2022–2024 test holdout partition
          </p>
        </div>

        <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[10px] uppercase text-slate-500 font-mono font-bold block">
            DELUGE F1-SCORE
          </span>
          <div className="text-2xl font-black text-[#002855] mt-0.5 font-mono">93.8%</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Extreme rainfall category classification score
          </p>
        </div>

        <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[10px] uppercase text-slate-500 font-mono font-bold block">
            DISASTER LEAD WINDOW
          </span>
          <div className="text-2xl font-black text-purple-900 mt-0.5 font-mono">24 to 48 Hours</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Early warning window for disaster management
          </p>
        </div>
      </div>

      {/* Neural Network Pipeline Schematic & Loss Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Architecture Pipeline Explanation */}
        <div className="bg-white border border-slate-300 rounded-xl p-4.5 space-y-3 shadow-xs">
          <div className="pb-2 border-b border-slate-200">
            <h3 className="text-xs font-bold text-[#002855] uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-700" />
              Hydro-Meteorological Deep Learning Pipeline Schematic
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              4-Stage Sequential Dataflow: Data standardized via NDCQ archives &amp; INSAT-3DR TIR-1
            </p>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-0.5">
              <div className="flex items-center justify-between text-blue-900 font-bold">
                <span>1. Temporal Sequence Input Layer</span>
                <span className="font-mono text-[10px] text-slate-500">
                  (T=7 days, N=10 features)
                </span>
              </div>
              <p className="text-slate-700">
                Standardized sequence of antecedent rainfall, relative humidity, pressure differentials, and soil saturation index.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-0.5">
              <div className="flex items-center justify-between text-cyan-900 font-bold">
                <span>2. Bi-Directional LSTM Layer (128 units)</span>
                <span className="font-mono text-[10px] text-slate-500">Dropout: 0.25</span>
              </div>
              <p className="text-slate-700">
                Captures forward and backward monsoon pressure cycle dependencies across consecutive meteorological observation windows.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-0.5">
              <div className="flex items-center justify-between text-indigo-950 font-bold">
                <span>3. Dense Fusion &amp; XGBoost Residual Regressor</span>
                <span className="font-mono text-[10px] text-slate-500">
                  Trees: 350, LR: 0.05
                </span>
              </div>
              <p className="text-slate-700">
                Fuses temporal embeddings with geospatial station coordinates (Lat, Lon, Elevation) to predict localized precipitation volume.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-0.5">
              <div className="flex items-center justify-between text-emerald-950 font-bold">
                <span>4. Flood Risk Threshold Classifier</span>
                <span className="font-mono text-[10px] text-slate-500">Softmax 4-Class</span>
              </div>
              <p className="text-slate-700">
                Classifies risk into Safe (&lt;25mm), Watch (25-64mm), Alert (65-115mm), and Critical Deluge (&gt;115mm).
              </p>
            </div>
          </div>
        </div>

        {/* Training Loss Curve (Epochs 5 to 40) */}
        <div className="bg-white border border-slate-300 rounded-xl p-4.5 space-y-2 shadow-xs">
          <div>
            <h3 className="text-xs font-bold text-[#002855] uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-700" />
              Model Training vs Validation Loss Convergence Curve
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Mean Squared Error (MSE) convergence over 40 training epochs on PyTorch backend
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={ML_MODEL_METRICS.trainingEpochs}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="epoch"
                  stroke="#475569"
                  fontSize={11}
                  label={{
                    value: "Epochs",
                    position: "insideBottom",
                    offset: -5,
                    fill: "#475569",
                    fontSize: 10,
                  }}
                />
                <YAxis stroke="#475569" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#002855",
                    borderColor: "#001a38",
                    borderRadius: "4px",
                    fontSize: "12px",
                    color: "#ffffff",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Line
                  type="monotone"
                  dataKey="trainLoss"
                  name="Training Loss (MSE)"
                  stroke="#004b99"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="valLoss"
                  name="Validation Loss (MSE)"
                  stroke="#b91c1c"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Student Project Academic & Hackathon Capstone Dossier */}
      <div className="bg-white border-2 border-[#002855] rounded-xl p-4.5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2.5 border-b border-slate-200">
          <div className="flex items-center gap-2 text-[#002855] font-black text-xs uppercase tracking-wide">
            <GraduationCap className="w-4 h-4 text-blue-700" />
            Academic &amp; Hackathon Capstone Documentation
          </div>
          <span className="text-[10px] font-mono font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-300">
            SIH 2026 GRAND FINALE PROTOTYPE
          </span>
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-mono font-bold">
              Problem Statement
            </span>
            <span className="text-slate-900 font-bold">
              {PROJECT_METADATA.problemStatement}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-mono font-bold">
              Student Team
            </span>
            <span className="text-slate-900 font-bold">{PROJECT_METADATA.teamName}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-mono font-bold">
              Target Geographical Region
            </span>
            <span className="text-slate-900 font-bold">
              {PROJECT_METADATA.district}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-mono font-bold">
              Technical Stack
            </span>
            <span className="text-slate-900 font-bold">
              Python, PyTorch, React, Vite, TanStack Router
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <a
          href="https://github.com/prathameshkale29/Smart-India-Hackathon-2026"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs bg-white hover:bg-slate-100 text-slate-800 px-4 py-2 rounded-lg border border-slate-300 font-bold shadow-2xs transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          View Source Repository
        </a>
        <Link
          to="/prediction"
          className="inline-flex items-center gap-1.5 text-xs bg-[#002855] hover:bg-[#003875] text-white px-4 py-2 rounded-lg font-bold shadow-xs transition"
        >
          <Play className="w-3.5 h-3.5 fill-white" /> Try QPF Simulation Console
        </Link>
        <Link
          to="/ml-results"
          className="inline-flex items-center gap-1.5 text-xs bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2 rounded-lg font-bold shadow-xs transition"
        >
          <BrainCircuit className="w-3.5 h-3.5" /> View Live ML Bulletin
        </Link>
      </div>
    </div>
  );
}
