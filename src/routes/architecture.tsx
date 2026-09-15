import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Layers,
  Activity,
  GraduationCap,
  Play,
  BrainCircuit,
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Specs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-sm">
          <span className="text-[10px] uppercase text-slate-500 font-mono font-bold block">
            Architecture
          </span>
          <div className="text-sm font-extrabold text-slate-900 mt-1">
            Stacked Bi-LSTM + XGBoost
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Sequential temporal encoder + non-linear decision forest
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-sm">
          <span className="text-[10px] uppercase text-slate-500 font-mono font-bold block">
            Accuracy (R² Score)
          </span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">0.894 (89.4%)</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Evaluated on 2022–2024 test holdout partition
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-sm">
          <span className="text-[10px] uppercase text-slate-500 font-mono font-bold block">
            Flash Flood F1-Score
          </span>
          <div className="text-2xl font-extrabold text-blue-700 mt-1">93.8%</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Extreme deluge category classification score
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-sm">
          <span className="text-[10px] uppercase text-slate-500 font-mono font-bold block">
            Lead Forecasting Time
          </span>
          <div className="text-2xl font-extrabold text-purple-700 mt-1">24 to 48 Hours</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Early warning window for disaster management
          </p>
        </div>
      </div>

      {/* Neural Network Pipeline Schematic & Loss Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Architecture Pipeline Explanation */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            Deep Learning Pipeline Schematic
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-blue-700 font-bold">
                <span>1. Temporal Sequence Input Layer</span>
                <span className="font-mono text-[10px] text-slate-500">
                  (T=7 days, N=10 features)
                </span>
              </div>
              <p className="text-slate-700 font-medium">
                Standardized sequence of antecedent rainfall, relative humidity, pressure
                differentials, and soil saturation index.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-cyan-800 font-bold">
                <span>2. Bi-Directional LSTM Layer (128 units)</span>
                <span className="font-mono text-[10px] text-slate-500">Dropout: 0.25</span>
              </div>
              <p className="text-slate-700 font-medium">
                Captures forward and backward monsoon pressure cycle dependencies across
                consecutive meteorological observation windows.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-indigo-700 font-bold">
                <span>3. Dense Fusion &amp; XGBoost Residual Regressor</span>
                <span className="font-mono text-[10px] text-slate-500">
                  Trees: 350, LR: 0.05
                </span>
              </div>
              <p className="text-slate-700 font-medium">
                Fuses temporal embeddings with geospatial station coordinates (Lat, Lon,
                Elevation) to predict localized precipitation volume.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-emerald-700 font-bold">
                <span>4. Flood Risk Threshold Classifier</span>
                <span className="font-mono text-[10px] text-slate-500">Softmax 4-Class</span>
              </div>
              <p className="text-slate-700 font-medium">
                Classifies risk into Safe (&lt;25mm), Watch (25-64mm), Alert (65-115mm),
                and Critical Deluge (&gt;115mm).
              </p>
            </div>
          </div>
        </div>

        {/* Training Loss Curve (Epochs 5 to 40) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              Model Training vs Validation Loss Curve
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Mean Squared Error (MSE) convergence over 40 training epochs
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={ML_MODEL_METRICS.trainingEpochs}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
                <XAxis
                  dataKey="epoch"
                  stroke="#64748b"
                  fontSize={11}
                  label={{
                    value: "Epochs",
                    position: "insideBottom",
                    offset: -5,
                    fill: "#64748b",
                    fontSize: 10,
                  }}
                />
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
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Line
                  type="monotone"
                  dataKey="trainLoss"
                  name="Training Loss"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="valLoss"
                  name="Validation Loss"
                  stroke="#e11d48"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Student Project Academic Credits & Capstone Info */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            Academic &amp; Hackathon Capstone Details
          </div>
          <span className="text-xs font-mono font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
            SIH 2026 Grand Finale Prototype
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-mono font-semibold">
              Problem Statement
            </span>
            <span className="text-slate-900 font-bold">
              {PROJECT_METADATA.problemStatement}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-mono font-semibold">
              Team
            </span>
            <span className="text-slate-900 font-bold">{PROJECT_METADATA.teamName}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-mono font-semibold">
              Target Region
            </span>
            <span className="text-slate-900 font-bold">
              {PROJECT_METADATA.district}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-mono font-semibold">
              Tech Stack
            </span>
            <span className="text-slate-900 font-bold">
              Python, PyTorch, React, Vite, Tailwind
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <a
          href="https://github.com/prathameshkale29/Smart-India-Hackathon-2026"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs bg-white hover:bg-slate-50 text-slate-800 px-4 py-2.5 rounded-xl border border-slate-300 shadow-2xs transition font-bold"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          View on GitHub
        </a>
        <Link
          to="/prediction"
          className="inline-flex items-center gap-2 text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl border border-blue-600 shadow-sm transition font-bold"
        >
          <Play className="w-3.5 h-3.5 fill-white" /> Try AI Prediction Sandbox
        </Link>
        <Link
          to="/ml-results"
          className="inline-flex items-center gap-2 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-4 py-2.5 rounded-xl border border-emerald-300 shadow-2xs transition font-bold"
        >
          <BrainCircuit className="w-3.5 h-3.5 text-emerald-600" /> View Live ML Results
        </Link>
      </div>
    </div>
  );
}
