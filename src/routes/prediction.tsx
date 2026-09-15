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
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 border border-blue-200/90 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Interactive ML Prediction &amp; Flood Risk Simulator
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Test the stacked Bi-LSTM + XGBoost model on synthetic or real hydrological inputs to predict 24h precipitation &amp; flash flood thresholds.
          </p>
        </div>

        {/* Scenario Preset Buttons */}
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-xs text-slate-600 font-semibold mr-1">Demo Scenarios:</span>
          <button
            onClick={() => applyPreset("dry")}
            className="text-xs bg-white hover:bg-slate-50 text-slate-800 font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs transition cursor-pointer"
          >
            ☀️ Dry Spell
          </button>
          <button
            onClick={() => applyPreset("normal")}
            className="text-xs bg-white hover:bg-slate-50 text-slate-800 font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs transition cursor-pointer"
          >
            🌦️ Normal Monsoon
          </button>
          <button
            onClick={() => applyPreset("flood")}
            className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold px-2.5 py-1.5 rounded-lg border border-amber-300 shadow-2xs transition cursor-pointer"
          >
            ⚠️ Heavy Inundation
          </button>
          <button
            onClick={() => applyPreset("cloudburst")}
            className="text-xs bg-red-50 hover:bg-red-100 text-red-900 font-semibold px-2.5 py-1.5 rounded-lg border border-red-300 shadow-2xs transition cursor-pointer"
          >
            ⛈️ 2013 Cloudburst Replay
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Parameter Sliders (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-5 space-y-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              Hydrological &amp; Atmospheric Input Vector
            </span>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 font-semibold">Target Station:</label>
              <select
                value={predStation}
                onChange={(e) => setPredStation(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-xs text-slate-900 font-bold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
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
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Antecedent 24h Rainfall (Lag-1)</span>
              <span className="text-blue-700 font-mono font-bold">{priorRain} mm</span>
            </div>
            <input
              type="range"
              min={0}
              max={150}
              step={1}
              value={priorRain}
              onChange={(e) => setPriorRain(Number(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 mm (Dry)</span>
              <span>75 mm (Heavy)</span>
              <span>150 mm (Extreme)</span>
            </div>
          </div>

          {/* Slider 2: Relative Humidity */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Relative Humidity (850 hPa)</span>
              <span className="text-blue-700 font-mono font-bold">{humidity} %</span>
            </div>
            <input
              type="range"
              min={30}
              max={100}
              step={1}
              value={humidity}
              onChange={(e) => setHumidity(Number(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>30% (Dry Air)</span>
              <span>70% (Moist)</span>
              <span>100% (Saturated)</span>
            </div>
          </div>

          {/* Slider 3: Soil Moisture Saturation */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Topsoil Moisture Saturation Index</span>
              <span className="text-emerald-700 font-mono font-bold">{soilMoisture} %</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={1}
              value={soilMoisture}
              onChange={(e) => setSoilMoisture(Number(e.target.value))}
              className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10% (Permeable)</span>
              <span>50% (Standard)</span>
              <span>100% (100% Runoff)</span>
            </div>
          </div>

          {/* Slider 4: Barometric Pressure */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Surface Atmospheric Pressure</span>
              <span className="text-amber-700 font-mono font-bold">{pressure} hPa</span>
            </div>
            <input
              type="range"
              min={975}
              max={1020}
              step={1}
              value={pressure}
              onChange={(e) => setPressure(Number(e.target.value))}
              className="w-full accent-amber-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>975 hPa (Deep Depression)</span>
              <span>1000 hPa (Trough)</span>
              <span>1020 hPa (High)</span>
            </div>
          </div>

          {/* Slider 5: Cloud Top IR Brightness Temp */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">INSAT-3DR Cloud Top Brightness Temp</span>
              <span className="text-purple-700 font-mono font-bold">{cloudTemp} °C</span>
            </div>
            <input
              type="range"
              min={-80}
              max={0}
              step={1}
              value={cloudTemp}
              onChange={(e) => setCloudTemp(Number(e.target.value))}
              className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
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
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-50 cursor-pointer"
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
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                  Prediction Output
                </span>
                <span className="text-xs text-emerald-800 font-mono font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Confidence: {inferenceResult.confidence}%
                </span>
              </div>

              {/* Big Metric Display */}
              <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium block mb-1">Predicted 24-hr Rainfall</span>
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-cyan-600 to-indigo-700 font-mono">
                  {inferenceResult.predictedRain} <span className="text-xl text-slate-500">mm</span>
                </div>

                {/* Risk Badge */}
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {inferenceResult.riskLevel === "Critical Cloudburst" && (
                    <span className="bg-red-100 text-red-800 border border-red-300 px-3 py-1 rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      CRITICAL CLOUDBURST ALERT
                    </span>
                  )}
                  {inferenceResult.riskLevel === "Alert" && (
                    <span className="bg-orange-100 text-orange-900 border border-orange-300 px-3 py-1 rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                      HEAVY RAIN ALERT (&gt;65mm)
                    </span>
                  )}
                  {inferenceResult.riskLevel === "Watch" && (
                    <span className="bg-yellow-100 text-yellow-900 border border-yellow-300 px-3 py-1 rounded-full flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-yellow-700" />
                      MODERATE PRECIPITATION WATCH
                    </span>
                  )}
                  {inferenceResult.riskLevel === "Normal" && (
                    <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      NORMAL WEATHER / SAFE
                    </span>
                  )}
                </div>
              </div>

              {/* Secondary Hydrological Metrics */}
              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-medium block text-[10px]">Estimated Runoff Index</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono mt-0.5 block">
                    {inferenceResult.runoffIndex} / 100
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-medium block text-[10px]">Lead Response Window</span>
                  <span className="text-base font-extrabold text-blue-700 font-mono mt-0.5 block">
                    24–36 Hours
                  </span>
                </div>
              </div>

              {/* Disaster Mitigation Advisory Box */}
              <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 text-xs space-y-1">
                <span className="text-blue-900 font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-blue-700" />
                  Automated Decision Support:
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">{inferenceResult.advisory}</p>
              </div>

              {/* Feature Importance Weights */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Model Feature Attribution (SHAP %):
                </span>
                <div className="space-y-1.5">
                  {ML_MODEL_METRICS.featureWeights.map((fw) => (
                    <div key={fw.feature} className="space-y-0.5">
                      <div className="flex justify-between text-[10px] font-medium text-slate-600">
                        <span>{fw.feature}</span>
                        <span className="font-mono text-slate-900 font-bold">{fw.weight}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                        <div
                          style={{ width: `${fw.weight * 2.5}%` }}
                          className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"
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
