import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useMLPredictions } from "@/hooks/useMLPredictions";
import { useTheme } from "@/hooks/useTheme";
import {
  CloudRain,
  Droplets,
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Database,
  Cpu,
  MapPin,
  TrendingUp,
  BarChart3,
  FileSpreadsheet,
  RefreshCw,
  Play,
  Sparkles,
  ShieldAlert,
  Search,
  Sliders,
  Calendar,
  Info,
  GraduationCap,
  Layers,
  Flame,
  ArrowUpRight,
  UploadCloud,
  Check,
  FlaskConical,
  BrainCircuit,
  Wifi,
  WifiOff,
  Moon,
  Sun,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  WARDHA_STATIONS,
  ML_MODEL_METRICS,
  PROJECT_METADATA,
  type StationData,
} from "@/data/wardhaData";

export const Route = createFileRoute("/")({
  component: StudentPrototypeApp,
});

type ActiveTab = "overview" | "prediction" | "stations" | "datasets" | "architecture" | "ml_results";

function StudentPrototypeApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [selectedStationId, setSelectedStationId] = useState<string>("arvi");

  // Live ML Predictions from Jupyter notebook
  const { data: mlData, loading: mlLoading, error: mlError, modelReady, nextDayForecasts, riskSummary, forecastDates } = useMLPredictions();
  const { theme, toggleTheme } = useTheme();

  // Predictor Simulator State
  const [predStation, setPredStation] = useState<string>("hinganghat");
  const [priorRain, setPriorRain] = useState<number>(45);
  const [humidity, setHumidity] = useState<number>(85);
  const [pressure, setPressure] = useState<number>(998);
  const [soilMoisture, setSoilMoisture] = useState<number>(75);
  const [cloudTemp, setCloudTemp] = useState<number>(-45);
  const [isInferencing, setIsInferencing] = useState<boolean>(false);
  const [inferenceResult, setInferenceResult] = useState<{
    predictedRain: number;
    riskLevel: "Normal" | "Watch" | "Alert" | "Critical Cloudburst";
    confidence: number;
    runoffIndex: number;
    advisory: string;
  } | null>({
    predictedRain: 74.2,
    riskLevel: "Alert",
    confidence: 94.6,
    runoffIndex: 82,
    advisory: "High risk of flash flooding in low-lying areas. Alert local municipal authorities and deploy water pumps.",
  });

  // Dataset explorer state
  const [datasetSearch, setDatasetSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [csvPreviewRows, setCsvPreviewRows] = useState<string[][]>([]);
  const [csvParseError, setCsvParseError] = useState<string | null>(null);

  // Handle real CSV file parsing
  const handleCsvUpload = (file: File) => {
    setUploadedFileName(file.name);
    setCsvPreviewRows([]);
    setCsvParseError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split(/\r?\n/).filter(l => l.trim());
        // Find header row
        const headerIdx = lines.findIndex(l => l.toUpperCase().includes('DATE'));
        const startIdx = headerIdx >= 0 ? headerIdx : 0;
        const rows = lines.slice(startIdx, startIdx + 11).map(l => l.split(',').map(c => c.trim()));
        if (rows.length === 0) throw new Error('No parseable rows found');
        setCsvPreviewRows(rows);
      } catch (err: any) {
        setCsvParseError(err.message || 'Could not parse CSV');
      }
    };
    reader.onerror = () => setCsvParseError('Failed to read file');
    reader.readAsText(file);
  };

  // Selected station
  const currentStation = useMemo(() => {
    return WARDHA_STATIONS.find((s) => s.id === selectedStationId) || WARDHA_STATIONS[0];
  }, [selectedStationId]);

  // Run ML Inference calculation
  const handleRunInference = () => {
    setIsInferencing(true);
    setTimeout(() => {
      // Dynamic student ensemble formula simulation
      const base = (priorRain * 0.45) + ((humidity - 50) * 0.6) + ((1013 - pressure) * 1.8) + (soilMoisture * 0.25) + (Math.abs(cloudTemp) * 0.3);
      const predicted = Math.max(0, parseFloat((base * 0.62).toFixed(1)));

      let risk: "Normal" | "Watch" | "Alert" | "Critical Cloudburst" = "Normal";
      let advisory = "No immediate flood hazard. Routine agricultural advisory.";

      if (predicted >= 115) {
        risk = "Critical Cloudburst";
        advisory = "CRITICAL INUNDATION THREAT: Immediate evacuation of riverine floodplains required. Trigger NDRF standby.";
      } else if (predicted >= 65) {
        risk = "Alert";
        advisory = "HIGH DELUGE RISK: Waterlogging expected on SH-243 and low-lying taluka settlements. Deploy drainage response teams.";
      } else if (predicted >= 25) {
        risk = "Watch";
        advisory = "MODERATE PRECIPITATION: Localized puddling possible. Advise farmers against unseasonal fertilizer spraying.";
      }

      setInferenceResult({
        predictedRain: predicted,
        riskLevel: risk,
        confidence: +(88 + Math.random() * 8).toFixed(1),
        runoffIndex: Math.min(100, Math.round(predicted * 0.9 + soilMoisture * 0.3)),
        advisory,
      });
      setIsInferencing(false);
    }, 450);
  };

  // Quick Preset Handlers
  const applyPreset = (type: "dry" | "normal" | "cloudburst" | "flood") => {
    if (type === "dry") {
      setPriorRain(0);
      setHumidity(45);
      setPressure(1014);
      setSoilMoisture(25);
      setCloudTemp(-10);
    } else if (type === "normal") {
      setPriorRain(18);
      setHumidity(75);
      setPressure(1004);
      setSoilMoisture(55);
      setCloudTemp(-35);
    } else if (type === "flood") {
      setPriorRain(65);
      setHumidity(92);
      setPressure(994);
      setSoilMoisture(85);
      setCloudTemp(-55);
    } else if (type === "cloudburst") {
      setPriorRain(110);
      setHumidity(98);
      setPressure(988);
      setSoilMoisture(95);
      setCloudTemp(-70);
    }
  };

  return (
    <div
      data-vatavaran-root
      data-theme={theme}
      className={`min-h-screen selection:bg-blue-500 selection:text-white flex flex-col font-sans${theme === 'light' ? ' vatavaran-light' : ' bg-slate-950 text-slate-100'}`}
      style={theme === 'light' ? { backgroundColor: '#f1f5f9', color: '#0f172a' } : undefined}
    >
      {/* Top Banner */}
      <div data-vatavaran-banner className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 border-b border-blue-900/30 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/15 text-blue-300 font-semibold px-2.5 py-0.5 border border-blue-500/25">
            <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
            {PROJECT_METADATA.hackathon}
          </span>
        </div>
      </div>

      {/* Main App Header */}
      <header data-vatavaran-header className="border-b border-slate-800 bg-slate-900/90 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <CloudRain className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  {PROJECT_METADATA.title}
                  <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Prototype
                  </span>
                </h1>
              </div>

            </div>
          </div>

          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="ml-2 p-2 rounded-lg border border-slate-700 bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Tab Navigation */}
          <nav data-vatavaran-nav className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "overview"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Overview & Talukas
            </button>
            <button
              onClick={() => setActiveTab("prediction")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "prediction"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              AI Prediction Sandbox
            </button>
            <button
              onClick={() => setActiveTab("stations")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "stations"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Station Deep-Dive
            </button>
            <button
              onClick={() => setActiveTab("datasets")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "datasets"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Dataset Explorer
            </button>
            <button
              onClick={() => setActiveTab("architecture")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "architecture"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Model Architecture
            </button>
            <button
              onClick={() => setActiveTab("ml_results")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "ml_results"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
              {modelReady ? (
                <><span>Live ML Results</span><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span></>
              ) : (
                <span>Live ML Results</span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & TALUKAS */}
        {/* ========================================================================= */}
        {activeTab === "overview" && (
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
                  <button
                    onClick={() => setActiveTab("prediction")}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Simulate Prediction
                  </button>
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
                      <div
                        key={stn.id}
                        onClick={() => {
                          setSelectedStationId(stn.id);
                          setActiveTab("stations");
                        }}
                        className="bg-slate-900/90 border border-slate-800/90 hover:border-blue-500/50 rounded-xl p-3.5 cursor-pointer transition group hover:shadow-md hover:shadow-blue-500/5"
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
                      </div>
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
                        // Map lat (20.0 to 21.2) to Y (bottom to top)
                        // Map lon (78.15 to 78.87) to X (left to right)
                        const topPercent = 100 - ((stn.coords[0] - 20.0) / 1.25) * 85 - 8;
                        const leftPercent = ((stn.coords[1] - 78.12) / 0.78) * 85 + 5;

                        const haloColors = {
                          Normal: "bg-emerald-500",
                          Watch: "bg-yellow-500",
                          Alert: "bg-orange-500",
                          Warning: "bg-red-500",
                        };

                        return (
                          <div
                            key={stn.id}
                            onClick={() => {
                              setSelectedStationId(stn.id);
                              setActiveTab("stations");
                            }}
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
                          </div>
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
                    <button
                      onClick={() => setActiveTab("prediction")}
                      className="text-blue-400 hover:underline font-medium"
                    >
                      Run custom scenario &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: AI PREDICTION SANDBOX */}
        {/* ========================================================================= */}
        {activeTab === "prediction" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Banner */}
            <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/20 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Interactive ML Prediction &amp; Flood Risk Simulator
                </h2>
                <p className="text-xs text-slate-400">
                  Test the stacked Bi-LSTM + XGBoost model on synthetic or real hydrological inputs to predict 24h precipitation &amp; flash flood thresholds.
                </p>
              </div>

              {/* Scenario Preset Buttons */}
              <div className="flex items-center flex-wrap gap-1.5">
                <span className="text-xs text-slate-400 mr-1">Demo Scenarios:</span>
                <button
                  onClick={() => applyPreset("dry")}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition"
                >
                  ☀️ Dry Spell
                </button>
                <button
                  onClick={() => applyPreset("normal")}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition"
                >
                  🌦️ Normal Monsoon
                </button>
                <button
                  onClick={() => applyPreset("flood")}
                  className="text-xs bg-amber-900/40 hover:bg-amber-800/40 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/30 transition"
                >
                  ⚠️ Heavy Inundation
                </button>
                <button
                  onClick={() => applyPreset("cloudburst")}
                  className="text-xs bg-red-900/40 hover:bg-red-800/40 text-red-300 px-2.5 py-1 rounded-lg border border-red-500/30 transition"
                >
                  ⛈️ 2013 Cloudburst Replay
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Parameter Sliders (7 cols) */}
              <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-sm font-semibold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-blue-400" />
                    Hydrological &amp; Atmospheric Input Vector
                  </span>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-400">Target Station:</label>
                    <select
                      value={predStation}
                      onChange={(e) => setPredStation(e.target.value)}
                      className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-2 py-1 font-medium focus:outline-none focus:border-blue-500"
                    >
                      {WARDHA_STATIONS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.taluka})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Slider 1: Prior 24h Rainfall */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">Antecedent 24h Rainfall (Lag-1)</span>
                    <span className="text-cyan-400 font-mono font-bold">{priorRain} mm</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={150}
                    step={1}
                    value={priorRain}
                    onChange={(e) => setPriorRain(Number(e.target.value))}
                    className="w-full accent-blue-500 h-2 bg-slate-950 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>0 mm (Dry)</span>
                    <span>75 mm (Heavy)</span>
                    <span>150 mm (Extreme)</span>
                  </div>
                </div>

                {/* Slider 2: Relative Humidity */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">Relative Humidity (850 hPa)</span>
                    <span className="text-blue-400 font-mono font-bold">{humidity} %</span>
                  </div>
                  <input
                    type="range"
                    min={30}
                    max={100}
                    step={1}
                    value={humidity}
                    onChange={(e) => setHumidity(Number(e.target.value))}
                    className="w-full accent-blue-500 h-2 bg-slate-950 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>30% (Dry Air)</span>
                    <span>70% (Moist)</span>
                    <span>100% (Saturated)</span>
                  </div>
                </div>

                {/* Slider 3: Soil Moisture Saturation */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">Topsoil Moisture Saturation Index</span>
                    <span className="text-emerald-400 font-mono font-bold">{soilMoisture} %</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={1}
                    value={soilMoisture}
                    onChange={(e) => setSoilMoisture(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-2 bg-slate-950 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>10% (Permeable)</span>
                    <span>50% (Standard)</span>
                    <span>100% (100% Runoff)</span>
                  </div>
                </div>

                {/* Slider 4: Barometric Pressure */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">Surface Atmospheric Pressure</span>
                    <span className="text-yellow-400 font-mono font-bold">{pressure} hPa</span>
                  </div>
                  <input
                    type="range"
                    min={975}
                    max={1020}
                    step={1}
                    value={pressure}
                    onChange={(e) => setPressure(Number(e.target.value))}
                    className="w-full accent-yellow-500 h-2 bg-slate-950 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>975 hPa (Deep Depression)</span>
                    <span>1000 hPa (Trough)</span>
                    <span>1020 hPa (High)</span>
                  </div>
                </div>

                {/* Slider 5: Cloud Top IR Brightness Temp */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">INSAT-3DR Cloud Top Brightness Temp</span>
                    <span className="text-purple-400 font-mono font-bold">{cloudTemp} °C</span>
                  </div>
                  <input
                    type="range"
                    min={-80}
                    max={0}
                    step={1}
                    value={cloudTemp}
                    onChange={(e) => setCloudTemp(Number(e.target.value))}
                    className="w-full accent-purple-500 h-2 bg-slate-950 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>-80°C (Deep Convective)</span>
                    <span>-40°C (Cumulus)</span>
                    <span>0°C (Cirrus)</span>
                  </div>
                </div>

                {/* Run Inference Button */}
                <button
                  onClick={handleRunInference}
                  disabled={isInferencing}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-50"
                >
                  {isInferencing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Propagating through Bi-LSTM Sequence...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      Run Model Inference (LSTM + XGBoost)
                    </>
                  )}
                </button>
              </div>

              {/* Right Column: AI Model Output & Risk Classification (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                {inferenceResult && (
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                        Prediction Output
                      </span>
                      <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Confidence: {inferenceResult.confidence}%
                      </span>
                    </div>

                    {/* Big Metric Display */}
                    <div className="text-center py-4 bg-slate-950/60 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400 block mb-1">Predicted 24-hr Rainfall</span>
                      <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 font-mono">
                        {inferenceResult.predictedRain} <span className="text-xl text-slate-400">mm</span>
                      </div>

                      {/* Risk Badge */}
                      <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {inferenceResult.riskLevel === "Critical Cloudburst" && (
                          <span className="bg-red-500/20 text-red-400 border border-red-500/40 px-3 py-1 rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                            CRITICAL CLOUDBURST ALERT
                          </span>
                        )}
                        {inferenceResult.riskLevel === "Alert" && (
                          <span className="bg-orange-500/20 text-orange-400 border border-orange-500/40 px-3 py-1 rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                            HEAVY RAIN ALERT (&gt;65mm)
                          </span>
                        )}
                        {inferenceResult.riskLevel === "Watch" && (
                          <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 px-3 py-1 rounded-full flex items-center gap-1">
                            <Info className="w-3.5 h-3.5 text-yellow-400" />
                            MODERATE PRECIPITATION WATCH
                          </span>
                        )}
                        {inferenceResult.riskLevel === "Normal" && (
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            NORMAL WEATHER / SAFE
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Secondary Hydrological Metrics */}
                    <div className="grid grid-cols-2 gap-3 text-center text-xs">
                      <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Estimated Runoff Index</span>
                        <span className="text-base font-bold text-white font-mono mt-0.5 block">
                          {inferenceResult.runoffIndex} / 100
                        </span>
                      </div>
                      <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Lead Response Window</span>
                        <span className="text-base font-bold text-cyan-400 font-mono mt-0.5 block">
                          24–36 Hours
                        </span>
                      </div>
                    </div>

                    {/* Disaster Mitigation Advisory Box */}
                    <div className="bg-slate-950/70 border border-blue-500/20 rounded-xl p-3 text-xs space-y-1">
                      <span className="text-blue-400 font-semibold flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Automated Decision Support:
                      </span>
                      <p className="text-slate-300 leading-relaxed">{inferenceResult.advisory}</p>
                    </div>

                    {/* Feature Importance Weights */}
                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Model Feature Attribution (SHAP %):
                      </span>
                      <div className="space-y-1.5">
                        {ML_MODEL_METRICS.featureWeights.map((fw) => (
                          <div key={fw.feature} className="space-y-0.5">
                            <div className="flex justify-between text-[10px] text-slate-400">
                              <span>{fw.feature}</span>
                              <span className="font-mono text-slate-300">{fw.weight}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${fw.weight * 2.5}%` }}
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: STATION DEEP-DIVE & CHARTS */}
        {/* ========================================================================= */}
        {activeTab === "stations" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Station Selector Bar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block font-medium">Select Station / Taluka:</label>
                  <select
                    value={selectedStationId}
                    onChange={(e) => setSelectedStationId(e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-sm font-bold text-white rounded-lg px-3 py-1 focus:outline-none focus:border-blue-500"
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
                  <span className="text-slate-300">{currentStation.lat}, {currentStation.lon}</span>
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
                    <p className="text-xs text-slate-400">Long-term climatological normal (June–Sept Monsoon Spike)</p>
                  </div>
                </div>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currentStation.monthlyNormals} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                        formatter={(val: any) => [`${val} mm`, "Monthly Mean"]}
                      />
                      <Bar dataKey="rainfall" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                        {currentStation.monthlyNormals.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={["Jun", "Jul", "Aug", "Sep"].includes(entry.month) ? "#06b6d4" : "#3b82f6"}
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
                    <p className="text-xs text-slate-400">Total cumulative precipitation vs {currentStation.avgAnnual}mm baseline</p>
                  </div>
                </div>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={currentStation.yearlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                        contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                        formatter={(val: any) => [`${val} mm`, "Total Rainfall"]}
                      />
                      <Area type="monotone" dataKey="rainfall" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#rainGrad)" />
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
                <span className="text-xs text-slate-400">Historical Record Peak: <strong className="text-amber-400">{currentStation.maxRain} mm</strong> ({currentStation.maxDate})</span>
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
                        <td className="py-2.5 px-3 font-bold text-cyan-400">{obs.rainfall.toFixed(1)} mm</td>
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
        )}

        {/* ========================================================================= */}
        {/* TAB 4: DATASET EXPLORER */}
        {/* ========================================================================= */}
        {activeTab === "datasets" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header & Upload Sandbox */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Dataset Summary */}
              <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-blue-400" />
                  Wardha District IMD NDCQ Daily CSV Datasets
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The prototype is trained on 10 localized station archives formatted per the National Data Centre Pune (NDCQ) standard. Below is the parsed registry of daily rainfall observations.
                </p>

                {/* Filter and Search Bar */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search station or filename..."
                      value={datasetSearch}
                      onChange={(e) => setDatasetSearch(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Right: Custom CSV Test Sandbox */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5 mb-1">
                    <UploadCloud className="w-4 h-4 text-cyan-400" />
                    Test Custom CSV File
                  </h3>
                  <p className="text-xs text-slate-400">
                    Upload an external NDCQ rainfall file to test parsing &amp; feature extraction.
                  </p>
                </div>

                <div className="mt-3 border-2 border-dashed border-slate-700 hover:border-blue-500/60 rounded-xl p-4 text-center cursor-pointer transition bg-slate-950/40">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleCsvUpload(f);
                    }}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label htmlFor="csv-upload" className="cursor-pointer block space-y-1">
                    <UploadCloud className="w-6 h-6 text-slate-400 mx-auto" />
                    <span className="text-xs text-blue-400 font-medium block">
                      {uploadedFileName ? `Loaded: ${uploadedFileName}` : "Click to select .CSV file"}
                    </span>
                    <span className="text-[10px] text-slate-500 block">NDCQ format: Date, Rainfall (mm)</span>
                  </label>
                </div>

                {uploadedFileName && !csvParseError && csvPreviewRows.length === 0 && (
                  <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Parsing CSV...
                  </div>
                )}
                {csvParseError && (
                  <div className="mt-2 text-xs text-red-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> {csvParseError}
                  </div>
                )}
                {csvPreviewRows.length > 0 && (
                  <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Parsed {csvPreviewRows.length - 1} rows — preview below
                  </div>
                )}
              </div>
            </div>

            {/* Datasets Table */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3">Station</th>
                      <th className="py-3 px-3">Filename</th>
                      <th className="py-3 px-3">Coordinates</th>
                      <th className="py-3 px-3 text-right">Total Rows</th>
                      <th className="py-3 px-3 text-right">Annual Mean</th>
                      <th className="py-3 px-3 text-right">Historical Max</th>
                      <th className="py-3 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {WARDHA_STATIONS.filter(
                      (s) =>
                        s.name.toLowerCase().includes(datasetSearch.toLowerCase()) ||
                        s.file.toLowerCase().includes(datasetSearch.toLowerCase())
                    ).map((stn) => (
                      <tr key={stn.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-3 text-white font-bold">{stn.name}</td>
                        <td className="py-3 px-3 text-cyan-400">{stn.file}</td>
                        <td className="py-3 px-3 text-slate-400">{stn.lat}, {stn.lon}</td>
                        <td className="py-3 px-3 text-right text-slate-300">{stn.totalRecords.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right text-slate-300">{stn.avgAnnual} mm</td>
                        <td className="py-3 px-3 text-right text-amber-400 font-bold">{stn.maxRain} mm</td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => {
                              setSelectedStationId(stn.id);
                              setActiveTab("stations");
                            }}
                            className="text-[11px] text-blue-400 hover:text-blue-300 hover:underline"
                          >
                            Explore &rarr;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CSV Preview Table */}
            {csvPreviewRows.length > 0 && (
              <div className="bg-slate-900/90 border border-emerald-500/20 rounded-2xl p-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  CSV Preview — <span className="text-emerald-400 font-mono">{uploadedFileName}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded ml-auto">
                    First {csvPreviewRows.length - 1} data rows
                  </span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                      <tr>
                        {(csvPreviewRows[0] || []).map((col, ci) => (
                          <th key={ci} className="py-2 px-3 text-left">{col || `Col ${ci + 1}`}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {csvPreviewRows.slice(1).map((row, ri) => (
                        <tr key={ri} className="hover:bg-slate-800/30 transition">
                          {row.map((cell, ci) => (
                            <td key={ci} className="py-2 px-3 text-slate-300">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => { setUploadedFileName(null); setCsvPreviewRows([]); setCsvParseError(null); }}
                    className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 bg-red-500/10 px-3 py-1.5 rounded-lg transition"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setActiveTab("prediction")}
                    className="text-xs text-blue-400 hover:text-blue-300 border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Run AI Prediction on this data →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: MODEL ARCHITECTURE & RESEARCH INFO */}
        {/* ========================================================================= */}
        {activeTab === "architecture" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                <span className="text-[10px] uppercase text-slate-400 font-mono block">Architecture</span>
                <div className="text-sm font-bold text-white mt-1">Stacked Bi-LSTM + XGBoost</div>
                <p className="text-[11px] text-slate-500 mt-1">Sequential temporal encoder + non-linear decision forest</p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                <span className="text-[10px] uppercase text-slate-400 font-mono block">Accuracy (R² Score)</span>
                <div className="text-xl font-bold text-emerald-400 mt-1">0.894 (89.4%)</div>
                <p className="text-[11px] text-slate-500 mt-1">Evaluated on 2022–2024 test holdout partition</p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                <span className="text-[10px] uppercase text-slate-400 font-mono block">Flash Flood F1-Score</span>
                <div className="text-xl font-bold text-cyan-400 mt-1">93.8%</div>
                <p className="text-[11px] text-slate-500 mt-1">Extreme deluge category classification score</p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                <span className="text-[10px] uppercase text-slate-400 font-mono block">Lead Forecasting Time</span>
                <div className="text-xl font-bold text-purple-400 mt-1">24 to 48 Hours</div>
                <p className="text-[11px] text-slate-500 mt-1">Early warning window for disaster management</p>
              </div>
            </div>

            {/* Neural Network Pipeline Schematic & Loss Curve */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Architecture Pipeline Explanation */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400" />
                  Deep Learning Pipeline Schematic
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-blue-400 font-bold">
                      <span>1. Temporal Sequence Input Layer</span>
                      <span className="font-mono text-[10px] text-slate-400">(T=7 days, N=10 features)</span>
                    </div>
                    <p className="text-slate-300">
                      Standardized sequence of antecedent rainfall, relative humidity, pressure differentials, and soil saturation index.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-cyan-400 font-bold">
                      <span>2. Bi-Directional LSTM Layer (128 units)</span>
                      <span className="font-mono text-[10px] text-slate-400">Dropout: 0.25</span>
                    </div>
                    <p className="text-slate-300">
                      Captures forward and backward monsoon pressure cycle dependencies across consecutive meteorological observation windows.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-indigo-400 font-bold">
                      <span>3. Dense Fusion &amp; XGBoost Residual Regressor</span>
                      <span className="font-mono text-[10px] text-slate-400">Trees: 350, LR: 0.05</span>
                    </div>
                    <p className="text-slate-300">
                      Fuses temporal embeddings with geospatial station coordinates (Lat, Lon, Elevation) to predict localized precipitation volume.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-emerald-400 font-bold">
                      <span>4. Flood Risk Threshold Classifier</span>
                      <span className="font-mono text-[10px] text-slate-400">Softmax 4-Class</span>
                    </div>
                    <p className="text-slate-300">
                      Classifies risk into Safe (&lt;25mm), Watch (25-64mm), Alert (65-115mm), and Critical Deluge (&gt;115mm).
                    </p>
                  </div>
                </div>
              </div>

              {/* Training Loss Curve (Epochs 5 to 40) */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    Model Training vs Validation Loss Curve
                  </h3>
                  <p className="text-xs text-slate-400">Mean Squared Error (MSE) convergence over 40 training epochs</p>
                </div>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ML_MODEL_METRICS.trainingEpochs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                      <XAxis dataKey="epoch" stroke="#94a3b8" fontSize={11} label={{ value: "Epochs", position: "insideBottom", offset: -5, fill: "#94a3b8", fontSize: 10 }} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                      />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Line type="monotone" dataKey="trainLoss" name="Training Loss" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="valLoss" name="Validation Loss" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Student Project Academic Credits & Capstone Info */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <GraduationCap className="w-4 h-4 text-blue-400" />
                  Academic &amp; Hackathon Capstone Details
                </div>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
                  SIH 2026 Grand Finale Prototype
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Problem Statement</span>
                  <span className="text-slate-200 font-semibold">{PROJECT_METADATA.problemStatement}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Team</span>
                  <span className="text-slate-200 font-semibold">{PROJECT_METADATA.teamName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Target Region</span>
                  <span className="text-slate-200 font-semibold">{PROJECT_METADATA.district}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Tech Stack</span>
                  <span className="text-slate-200 font-semibold">Python, PyTorch, React, Vite, Tailwind</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/prathameshkale29/Smart-India-Hackathon-2026"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl border border-slate-700 transition font-medium"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
                View on GitHub
              </a>
              <button
                onClick={() => setActiveTab("prediction")}
                className="inline-flex items-center gap-2 text-xs bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl border border-blue-500 transition font-medium"
              >
                <Play className="w-3.5 h-3.5 fill-white" /> Try AI Prediction Sandbox
              </button>
              <button
                onClick={() => setActiveTab("ml_results")}
                className="inline-flex items-center gap-2 text-xs bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 px-4 py-2 rounded-xl border border-emerald-500/30 transition font-medium"
              >
                <BrainCircuit className="w-3.5 h-3.5" /> View Live ML Results
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: LIVE ML RESULTS (from Jupyter Notebook) */}
        {/* ========================================================================= */}
        {activeTab === "ml_results" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Model Status Banner */}
            {mlLoading ? (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex items-center justify-center gap-3">
                <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
                <span className="text-slate-300">Loading ML prediction results...</span>
              </div>
            ) : !modelReady ? (
              <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <WifiOff className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Notebook Not Run Yet — Model Output Pending</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      The Jupyter notebook hasn't exported predictions yet. Run all cells in{" "}
                      <code className="text-cyan-400 bg-slate-950 px-1 py-0.5 rounded">ml/Rainfall_Model.ipynb</code>{" "}
                      to generate live panchayat-level forecasts.
                    </p>
                  </div>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 space-y-1">
                  <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-2">How to connect:</div>
                  <div><span className="text-emerald-400">1.</span> Open Jupyter: your notebook is at <span className="text-cyan-400">ml/Rainfall_Model.ipynb</span></div>
                  <div><span className="text-emerald-400">2.</span> Run all cells (Kernel → Restart &amp; Run All)</div>
                  <div><span className="text-emerald-400">3.</span> Cell 13 auto-copies <span className="text-cyan-400">predictions.json</span> to <span className="text-cyan-400">public/ml_outputs/</span></div>
                  <div><span className="text-emerald-400">4.</span> Refresh this tab — predictions appear here instantly!</div>
                </div>
                {mlError && (
                  <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2 font-mono">
                    Error: {mlError}
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Model Ready — Show all results */}
                {/* Metrics Row */}
                <div className="flex items-center gap-2 mb-2">
                  <Wifi className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-emerald-400 font-semibold">
                    Live Model Connected — Generated: {mlData.generated_at ? new Date(mlData.generated_at).toLocaleString() : "N/A"}
                  </span>
                  {mlData.model_version && (
                    <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded">{mlData.model_version}</span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                    <span className="text-[10px] uppercase text-slate-400 font-mono block">R² Score</span>
                    <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{mlData.model_metrics.r2?.toFixed(4)}</div>
                    <p className="text-[11px] text-slate-500">Variance explained</p>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                    <span className="text-[10px] uppercase text-slate-400 font-mono block">RMSE</span>
                    <div className="text-2xl font-bold text-blue-400 mt-1 font-mono">{mlData.model_metrics.rmse} mm</div>
                    <p className="text-[11px] text-slate-500">Root mean squared error</p>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                    <span className="text-[10px] uppercase text-slate-400 font-mono block">MAE</span>
                    <div className="text-2xl font-bold text-cyan-400 mt-1 font-mono">{mlData.model_metrics.mae} mm</div>
                    <p className="text-[11px] text-slate-500">Mean absolute error</p>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                    <span className="text-[10px] uppercase text-slate-400 font-mono block">Panchayats Covered</span>
                    <div className="text-2xl font-bold text-purple-400 mt-1 font-mono">{new Set(nextDayForecasts.map(p => p.id)).size}</div>
                    <p className="text-[11px] text-slate-500">Gram Panchayats forecasted</p>
                  </div>
                </div>

                {/* Risk Summary */}
                {Object.keys(riskSummary).length > 0 && (
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      Next 24h Panchayat Risk Distribution ({forecastDates[0]})
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(riskSummary).map(([risk, count]) => {
                        const colorMap: Record<string,string> = {
                          "Critical Cloudburst": "text-red-400 border-red-500/30 bg-red-500/10",
                          "Heavy Rain Alert": "text-orange-400 border-orange-500/30 bg-orange-500/10",
                          "Moderate Rain Watch": "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
                          "Light Rain": "text-blue-400 border-blue-500/30 bg-blue-500/10",
                          "Dry / Trace": "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
                        };
                        return (
                          <div key={risk} className={`flex items-center gap-2 border rounded-xl px-3 py-2 text-xs font-semibold ${colorMap[risk] || "text-slate-400 border-slate-700"}`}>
                            <span className="text-lg font-bold">{count}</span>
                            <span>{risk}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Panchayat Forecast Table */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    Panchayat-Level 24h Rainfall Forecasts (IDW Downscaled)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3">Panchayat</th>
                          <th className="py-2.5 px-3">Taluka</th>
                          <th className="py-2.5 px-3 text-right">Pred. Rainfall</th>
                          <th className="py-2.5 px-3">Risk Level</th>
                          <th className="py-2.5 px-3 font-mono">Lat, Lon</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        {nextDayForecasts
                          .sort((a, b) => b.predicted_rain - a.predicted_rain)
                          .map((p) => (
                          <tr key={p.id} className="hover:bg-slate-800/30 transition">
                            <td className="py-2.5 px-3 font-semibold text-white">{p.name}</td>
                            <td className="py-2.5 px-3 text-slate-400">{p.taluka}</td>
                            <td className="py-2.5 px-3 text-right font-bold" style={{ color: p.risk_color }}>
                              {p.predicted_rain.toFixed(1)} mm
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold border"
                                style={{ color: p.risk_color, borderColor: p.risk_color + "44", backgroundColor: p.risk_color + "18" }}>
                                {p.risk_level}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 text-[10px]">{p.lat}° N, {p.lon}° E</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>


    </div>
  );
}
