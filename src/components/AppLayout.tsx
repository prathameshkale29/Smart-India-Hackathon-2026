import { type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  CloudRain,
  GraduationCap,
  Sun,
  Moon,
  BarChart3,
  Sparkles,
  TrendingUp,
  FileSpreadsheet,
  Cpu,
  BrainCircuit,
} from "lucide-react";
import { PROJECT_METADATA } from "@/data/wardhaData";
import { useTheme } from "@/hooks/useTheme";
import { useMLPredictions } from "@/hooks/useMLPredictions";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { theme, toggleTheme } = useTheme();
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
      iconClass: "text-amber-300",
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
      iconClass: "text-emerald-400",
      badge: modelReady,
    },
  ];

  return (
    <div
      data-vatavaran-root
      data-theme={theme}
      className={`min-h-screen selection:bg-blue-500 selection:text-white flex flex-col font-sans transition-colors duration-200 ${
        theme === "light"
          ? "vatavaran-light bg-slate-100 text-slate-900"
          : "bg-slate-950 text-slate-100"
      }`}
      style={
        theme === "light"
          ? { backgroundColor: "#f1f5f9", color: "#0f172a" }
          : undefined
      }
    >
      {/* Top Banner */}
      <div
        data-vatavaran-banner
        className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 border-b border-blue-900/30 px-4 py-1.5 text-xs transition-colors"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/15 text-blue-300 font-semibold px-2.5 py-0.5 border border-blue-500/25">
            <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
            {PROJECT_METADATA.hackathon}
          </span>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline-block">
            {PROJECT_METADATA.problemStatement} • {PROJECT_METADATA.teamName}
          </span>
        </div>
      </div>

      {/* Main App Header */}
      <header
        data-vatavaran-header
        className="border-b border-slate-800 bg-slate-900/90 sticky top-0 z-40 backdrop-blur-md transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
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
              <p className="text-[11px] text-slate-400 -mt-0.5">
                Wardha District High-Resolution Precipitation &amp; Inundation AI
              </p>
            </div>
          </Link>

          {/* Controls: Theme Toggle & Navigation */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Theme Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-2 rounded-lg border border-slate-700 bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Tab Navigation */}
            <nav
              data-vatavaran-nav
              className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto"
            >
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
                          ? "bg-emerald-600 text-white shadow"
                          : "bg-blue-600 text-white shadow"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
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
      <footer className="border-t border-slate-800/60 py-4 px-4 bg-slate-950/40 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            {PROJECT_METADATA.title} • {PROJECT_METADATA.hackathon}
          </span>
          <div className="flex items-center gap-4">
            <span className="font-mono">Wardha District IMD NDCQ Meteorological Data</span>
            <a
              href="https://github.com/prathameshkale29/Smart-India-Hackathon-2026"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
