import { type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  CloudRain,
  GraduationCap,
  BarChart3,
  Sparkles,
  TrendingUp,
  FileSpreadsheet,
  Cpu,
  BrainCircuit,
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

  const navItems = [
    {
      to: "/",
      label: "Overview & Talukas",
      icon: BarChart3,
    },
    {
      to: "/prediction",
      label: "AI Prediction Sandbox",
      icon: Sparkles,
      iconClass: "text-amber-500",
    },
    {
      to: "/stations",
      label: "Station Deep-Dive",
      icon: TrendingUp,
    },
    {
      to: "/datasets",
      label: "Dataset Explorer",
      icon: FileSpreadsheet,
    },
    {
      to: "/architecture",
      label: "Model Architecture",
      icon: Cpu,
    },
    {
      to: "/ml-results",
      label: "Live ML Results",
      icon: BrainCircuit,
      iconClass: "text-emerald-600",
      badge: modelReady,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white flex flex-col font-sans">
      {/* Top Hackathon Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 border-b border-blue-200/70 px-4 py-1.5 text-xs text-blue-950">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/10 text-blue-700 font-semibold px-2.5 py-0.5 border border-blue-300">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            {PROJECT_METADATA.hackathon}
          </span>
          <span className="text-[11px] text-slate-600 font-mono hidden sm:inline-block">
            {PROJECT_METADATA.problemStatement} • {PROJECT_METADATA.teamName}
          </span>
        </div>
      </div>

      {/* Main App Header */}
      <header className="border-b border-slate-200 bg-white/95 sticky top-0 z-40 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <CloudRain className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  {PROJECT_METADATA.title}
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Prototype
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-500 -mt-0.5">
                Wardha District High-Resolution Precipitation &amp; Inundation AI
              </p>
            </div>
          </Link>

          {/* Navigation Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs overflow-x-auto">
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                      isActive
                        ? item.to === "/ml-results"
                          ? "bg-emerald-600 text-white shadow-sm font-semibold"
                          : "bg-blue-600 text-white shadow-sm font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${item.iconClass || ""}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        {children}
      </main>

      {/* App Footer */}
      <footer className="border-t border-slate-200 py-4 px-4 bg-white text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-medium text-slate-600">
            {PROJECT_METADATA.title} • {PROJECT_METADATA.hackathon}
          </span>
          <div className="flex items-center gap-4">
            <span className="font-mono text-slate-500">Wardha District IMD NDCQ Meteorological Data</span>
            <a
              href="https://github.com/prathameshkale29/Smart-India-Hackathon-2026"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
