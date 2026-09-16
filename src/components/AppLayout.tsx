import { useState, useEffect, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  CloudRain,
  GraduationCap,
  BarChart3,
  Sliders,
  TrendingUp,
  FileSpreadsheet,
  Cpu,
  BrainCircuit,
  Clock,
  Radio,
  AlertCircle,
  ExternalLink,
  Shield,
} from "lucide-react";
import { PROJECT_METADATA } from "@/data/wardhaData";
import { useMLPredictions } from "@/hooks/useMLPredictions";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { modelReady } = useMLPredictions();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // Live IST Clock
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setCurrentTime(now.toLocaleString("en-IN", options) + " IST");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    {
      to: "/",
      label: "Overview & Taluka Network",
      code: "REGISTRY",
      icon: BarChart3,
    },
    {
      to: "/prediction",
      label: "QPF & Flood Simulation",
      code: "NMDSS-AI",
      icon: Sliders,
      badgeColor: "bg-amber-400 text-slate-950",
    },
    {
      to: "/stations",
      label: "Station Climatology Dossier",
      code: "TELEMETRY",
      icon: TrendingUp,
    },
    {
      to: "/datasets",
      label: "NDC Pune Datasets",
      code: "NDCQ-ARCHIVE",
      icon: FileSpreadsheet,
    },
    {
      to: "/architecture",
      label: "Model Architecture & Specs",
      code: "BI-LSTM/XGB",
      icon: Cpu,
    },
    {
      to: "/ml-results",
      label: "Live Panchayat Forecasts",
      code: "QPF-BULLETIN",
      icon: BrainCircuit,
      badge: modelReady,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-slate-900 flex flex-col font-sans">
      {/* Top National Tricolor Stripe */}
      <div className="tricolor-stripe" />

      {/* Top Official Government Masthead Bar */}
      <div className="bg-[#001a38] text-slate-200 px-4 py-1.5 text-[11px] border-b border-[#003366]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              भारत सरकार | Government of India
            </span>
            <span className="text-slate-400 hidden md:inline">|</span>
            <span className="text-slate-300 hidden md:inline">
              पृथ्वी विज्ञान मंत्रालय | Ministry of Earth Sciences (MoES)
            </span>
            <span className="text-slate-400 hidden lg:inline">|</span>
            <span className="text-cyan-300 font-medium hidden lg:inline">
              भारत मौसम विज्ञान विभाग | India Meteorological Department
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-300">
            <span className="flex items-center gap-1 text-slate-300 bg-[#002855] px-2 py-0.5 rounded border border-[#004080]">
              <Clock className="w-3 h-3 text-cyan-400" />
              {currentTime || "Loading IST..."}
            </span>
            <span className="bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-400/40 text-[10px]">
              SIH 2026 CAPSTONE
            </span>
          </div>
        </div>
      </div>

      {/* Main Official Header */}
      <header className="bg-white border-b-2 border-[#002855] shadow-xs sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Department Branding */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#002855] to-[#004b99] flex items-center justify-center shadow-md shadow-blue-900/20 text-white group-hover:scale-105 transition-transform border border-[#003875]">
              <CloudRain className="w-7 h-7 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-[#002855] uppercase font-serif">
                  VATAVARAN
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#002855] text-white">
                  IMD-SIH PROTO
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  VIDARBHA BASIN
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600 tracking-tight">
                Wardha District High-Resolution Hydrometeorological Analytics &amp; Inundation AI Platform
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                Developed by Team Vatavaran • Smart India Hackathon (SIH 2026) Prototype
              </p>
            </div>
          </Link>

          {/* Quick Telemetry Indicators */}
          <div className="hidden lg:flex items-center gap-3 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-right">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Grid Division</span>
              <span className="font-bold text-[#002855]">Vidarbha / 10 Stations</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-right">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Data Normal Standard</span>
              <span className="font-bold text-slate-800 font-mono">IMD NDCQ 1991–2024</span>
            </div>
          </div>
        </div>

        {/* Live Weather Warning Bulletin Marquee Ticker */}
        <div className="bg-[#fff8e1] border-t border-b border-[#ffe082] px-4 py-1 text-xs text-slate-800 flex items-center overflow-hidden">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 bg-amber-400/40 px-2 py-0.5 rounded text-[10px] shrink-0 mr-3 border border-amber-400">
            <Radio className="w-3 h-3 text-red-600 animate-ping" />
            IMD WEATHER BULLETIN
          </div>
          <div className="overflow-hidden whitespace-nowrap w-full">
            <div className="animate-marquee font-medium text-[11px] text-slate-800 space-x-8">
              <span>
                🔴 <strong>DISTRICT WARNING:</strong> Isolated heavy deluge alert active for Hinganghat and Samudrapur basins along Vena tributary.
              </span>
              <span>
                🟡 <strong>MONSOON TELEMETRY:</strong> 24h seasonal cumulative precipitation departure at +14.2% over Wardha District long-period average (LPA).
              </span>
              <span>
                🟢 <strong>AI ENSEMBLE STATUS:</strong> Bi-LSTM + XGBoost inference active across 10 automatic rainfall stations with R²: 0.894 precision.
              </span>
            </div>
          </div>
        </div>

        {/* Government Style Navigation Bar */}
        <div className="bg-[#002855] text-white">
          <div className="max-w-7xl mx-auto px-2 flex items-center overflow-x-auto text-xs font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.to === "/"
                  ? currentPath === "/"
                  : currentPath.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-4 py-2.5 whitespace-nowrap transition-colors border-b-3 ${
                    isActive
                      ? "bg-[#001f42] text-white border-amber-400 font-bold shadow-inner"
                      : "text-slate-200 hover:text-white hover:bg-[#003875] border-transparent"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-cyan-300" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Application Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-5 space-y-5">
        {children}
      </main>

      {/* Official Government Footer */}
      <footer className="border-t-2 border-[#002855] bg-white text-xs text-slate-600 mt-8">
        <div className="bg-[#f8fafc] border-b border-slate-200 py-4 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-bold text-[#002855] uppercase text-[11px] mb-1">
                About VATAVARAN AI Platform
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                A high-resolution machine learning hydrometeorological prototype designed for Smart India Hackathon (SIH 2026), providing automated flash flood advisories and downscaled precipitation forecasting for Wardha District, Maharashtra.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-[#002855] uppercase text-[11px] mb-1">
                Data Sources &amp; Standards
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
                National Data Centre (NDC Pune) Daily NDCQ Meteorological Records • INSAT-3DR Geostationary Imager TIR-1 • Central Water Commission (CWC) River Gauge Baselines.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-[#002855] uppercase text-[11px] mb-1">
                Team &amp; Hackathon Credentials
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Team: <strong>{PROJECT_METADATA.teamName}</strong> • Problem: <strong>{PROJECT_METADATA.problemStatement}</strong> • Region: <strong>{PROJECT_METADATA.district}</strong>
              </p>
              <div className="mt-2 flex items-center gap-3">
                <a
                  href="https://github.com/prathameshkale29/Smart-India-Hackathon-2026"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline font-bold inline-flex items-center gap-1 text-[11px]"
                >
                  GitHub Repository <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#001a38] text-slate-400 py-3 px-4 text-[11px]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              © 2026 VATAVARAN AI • Smart India Hackathon (SIH 2026) Prototype • Inspired by IMD &amp; MoES Standards
            </span>
            <span className="text-slate-300 font-mono text-[10px]">
              Wardha District HydroMeteorological Framework v2.4 (Bi-LSTM + XGBoost)
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
