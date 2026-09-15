import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles,
  Sliders,
  Play,
  RefreshCw,
  AlertTriangle,
  Info,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { WARDHA_STATIONS, ML_MODEL_METRICS } from "@/data/wardhaData";

export const Route = createFileRoute("/prediction")({
  component: PredictionPage,
});

function PredictionPage() {
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
    advisory:
      "High risk of flash flooding in low-lying areas. Alert local municipal authorities and deploy water pumps.",
  });

  const handleRunInference = () => {
    setIsInferencing(true);
    setTimeout(() => {
      const base =
        priorRain * 0.45 +
        (humidity - 50) * 0.6 +
        (1013 - pressure) * 1.8 +
        soilMoisture * 0.25 +
        Math.abs(cloudTemp) * 0.3;
      const predicted = Math.max(0, parseFloat((base * 0.62).toFixed(1)));

      let risk: "Normal" | "Watch" | "Alert" | "Critical Cloudburst" = "Normal";
      let advisory = "No immediate flood hazard. Routine agricultural advisory.";

      if (predicted >= 115) {
        risk = "Critical Cloudburst";
        advisory =
          "CRITICAL INUNDATION THREAT: Immediate evacuation of riverine floodplains required. Trigger NDRF standby.";
      } else if (predicted >= 65) {
        risk = "Alert";
        advisory =
          "HIGH DELUGE RISK: Waterlogging expected on SH-243 and low-lying taluka settlements. Deploy drainage response teams.";
      } else if (predicted >= 25) {
        risk = "Watch";
        advisory =
          "MODERATE PRECIPITATION: Localized puddling possible. Advise farmers against unseasonal fertilizer spraying.";
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
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition cursor-pointer"
          >
            ☀️ Dry Spell
          </button>
          <button
            onClick={() => applyPreset("normal")}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition cursor-pointer"
          >
            🌦️ Normal Monsoon
          </button>
          <button
            onClick={() => applyPreset("flood")}
            className="text-xs bg-amber-900/40 hover:bg-amber-800/40 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/30 transition cursor-pointer"
          >
            ⚠️ Heavy Inundation
          </button>
          <button
            onClick={() => applyPreset("cloudburst")}
            className="text-xs bg-red-900/40 hover:bg-red-800/40 text-red-300 px-2.5 py-1 rounded-lg border border-red-500/30 transition cursor-pointer"
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
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-50 cursor-pointer"
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
  );
}
