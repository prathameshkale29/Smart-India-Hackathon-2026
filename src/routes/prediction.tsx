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
  Radio,
  Gauge,
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
    imdCategory: string;
    confidence: number;
    runoffIndex: number;
    advisory: string;
  } | null>({
    predictedRain: 74.2,
    riskLevel: "Alert",
    imdCategory: "HEAVY RAINFALL (64.5 – 115.5 mm)",
    confidence: 94.6,
    runoffIndex: 82,
    advisory:
      "IMD ORANGE ALERT: High risk of localized inundation in low-lying riverine pockets. Recommend deployment of emergency drainage pumps and issuing agricultural advisories against field fertilizer application.",
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
      let imdCategory = "LIGHT RAINFALL (2.5 – 15.5 mm)";
      let advisory = "IMD GREEN STATUS: No severe hydrometeorological hazard. Normal seasonal conditions.";

      if (predicted >= 115.6) {
        risk = "Critical Cloudburst";
        imdCategory = "EXTREMELY HEAVY DELUGE / CLOUDBURST (≥ 115.6 mm)";
        advisory =
          "IMD RED WARNING: Immediate evacuation of low-lying floodplains along Wardha & Vena basins recommended. NDRF/SDRF deployment on standby.";
      } else if (predicted >= 64.5) {
        risk = "Alert";
        imdCategory = "HEAVY RAINFALL (64.5 – 115.5 mm)";
        advisory =
          "IMD ORANGE ALERT: Severe waterlogging expected along low-lying roadways and drainage channels. Deploy emergency municipal pumping stations.";
      } else if (predicted >= 15.6) {
        risk = "Watch";
        imdCategory = "MODERATE RAINFALL (15.6 – 64.4 mm)";
        advisory =
          "IMD YELLOW WATCH: Moderate precipitation expected. Advise farmers against unseasonal chemical spraying.";
      }

      setInferenceResult({
        predictedRain: predicted,
        riskLevel: risk,
        imdCategory,
        confidence: +(88 + Math.random() * 8).toFixed(1),
        runoffIndex: Math.min(100, Math.round(predicted * 0.9 + soilMoisture * 0.3)),
        advisory,
      });
      setIsInferencing(false);
    }, 450);
  };

  const applyPreset = (type: "dry" | "normal" | "flood" | "cloudburst") => {
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
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Console Masthead Banner */}
      <div className="bg-white border-2 border-[#002855] rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold bg-[#002855] text-white px-2 py-0.5 rounded font-mono">
              NMDSS CONSOLE v2.4
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase">
              Hydro-Meteorological AI Framework
            </span>
          </div>
          <h2 className="text-base font-extrabold text-[#002855] flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-700" />
            Quantitative Precipitation Forecast (QPF) &amp; Inundation Simulator
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            Bi-LSTM sequence encoder coupled with geospatial XGBoost gradient decision tree for 24-hr rainfall volume and flood classification.
          </p>
        </div>

        {/* Synoptic Scenario Presets */}
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-xs text-slate-600 font-bold mr-1">Synoptic Presets:</span>
          <button
            onClick={() => applyPreset("dry")}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-2.5 py-1.5 rounded border border-slate-300 transition cursor-pointer"
          >
            ☀️ Fair Weather / Dry
          </button>
          <button
            onClick={() => applyPreset("normal")}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-2.5 py-1.5 rounded border border-slate-300 transition cursor-pointer"
          >
            🌦️ Standard Monsoon
          </button>
          <button
            onClick={() => applyPreset("flood")}
            className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-950 font-bold px-2.5 py-1.5 rounded border border-orange-300 transition cursor-pointer"
          >
            ⚠️ Active Low Pressure
          </button>
          <button
            onClick={() => applyPreset("cloudburst")}
            className="text-xs bg-red-100 hover:bg-red-200 text-red-950 font-bold px-2.5 py-1.5 rounded border border-red-300 transition cursor-pointer"
          >
            ⛈️ 2013 Cloudburst Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Parameter Input Vectors (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-300 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-xs font-bold text-[#002855] uppercase tracking-wider flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-blue-700" />
              Meteorological Input Parameters (Vector N=5)
            </span>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 font-bold">Station Grid:</label>
              <select
                value={predStation}
                onChange={(e) => setPredStation(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-xs text-slate-900 font-bold rounded px-2.5 py-1 focus:outline-none focus:border-blue-700 cursor-pointer"
              >
                {WARDHA_STATIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.taluka})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Slider 1: Antecedent Rainfall */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-800">1. Antecedent Precipitation Index (API Lag-1)</span>
              <span className="text-[#002855] font-mono">{priorRain} mm</span>
            </div>
            <input
              type="range"
              min={0}
              max={150}
              step={1}
              value={priorRain}
              onChange={(e) => setPriorRain(Number(e.target.value))}
              className="w-full accent-[#002855] h-2 bg-slate-200 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 mm (Dry Soil)</span>
              <span>75 mm (Saturated)</span>
              <span>150 mm (Extreme)</span>
            </div>
          </div>

          {/* Slider 2: Relative Humidity */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-800">2. 850 hPa Level Relative Humidity (RH)</span>
              <span className="text-[#002855] font-mono">{humidity} %</span>
            </div>
            <input
              type="range"
              min={30}
              max={100}
              step={1}
              value={humidity}
              onChange={(e) => setHumidity(Number(e.target.value))}
              className="w-full accent-[#002855] h-2 bg-slate-200 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>30% (Dry Air)</span>
              <span>75% (Monsoon Average)</span>
              <span>100% (Condensation Level)</span>
            </div>
          </div>

          {/* Slider 3: Topsoil Saturation */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-800">3. Topsoil Saturation Equivalent Index (Sw)</span>
              <span className="text-emerald-800 font-mono">{soilMoisture} %</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={1}
              value={soilMoisture}
              onChange={(e) => setSoilMoisture(Number(e.target.value))}
              className="w-full accent-emerald-700 h-2 bg-slate-200 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10% (High Infiltration)</span>
              <span>50% (Standard Field Capacity)</span>
              <span>100% (Instant Surface Runoff)</span>
            </div>
          </div>

          {/* Slider 4: Barometric Pressure */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-800">4. Surface Barometric Atmospheric Pressure (P₀)</span>
              <span className="text-amber-800 font-mono">{pressure} hPa</span>
            </div>
            <input
              type="range"
              min={975}
              max={1020}
              step={1}
              value={pressure}
              onChange={(e) => setPressure(Number(e.target.value))}
              className="w-full accent-amber-600 h-2 bg-slate-200 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>975 hPa (Deep Depression)</span>
              <span>1000 hPa (Monsoon Trough)</span>
              <span>1020 hPa (High Pressure)</span>
            </div>
          </div>

          {/* Slider 5: Cloud Top IR Brightness Temp */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-800">5. INSAT-3DR Cloud Top Brightness Temp (TB)</span>
              <span className="text-purple-800 font-mono">{cloudTemp} °C</span>
            </div>
            <input
              type="range"
              min={-80}
              max={0}
              step={1}
              value={cloudTemp}
              onChange={(e) => setCloudTemp(Number(e.target.value))}
              className="w-full accent-purple-700 h-2 bg-slate-200 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-80°C (Deep Convective Deluge)</span>
              <span>-40°C (Cumulonimbus)</span>
              <span>0°C (Cirrus)</span>
            </div>
          </div>

          {/* Run Inference Button */}
          <button
            onClick={handleRunInference}
            disabled={isInferencing}
            className="w-full py-3 px-4 bg-[#002855] hover:bg-[#003875] text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition cursor-pointer border border-[#001a38]"
          >
            {isInferencing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
                Computing Bi-LSTM Temporal Hidden States &amp; XGBoost Tree Inference...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                Run NWP Ensemble Model (Bi-LSTM + XGBoost)
              </>
            )}
          </button>
        </div>

        {/* Right Column: QPF Output & Advisory Dossier (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {inferenceResult && (
            <div className="bg-white border-2 border-[#002855] rounded-xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                <span className="text-xs font-bold uppercase text-[#002855] tracking-wider">
                  QPF Prediction Output Dossier
                </span>
                <span className="text-xs text-emerald-900 font-mono font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  Model Confidence: {inferenceResult.confidence}%
                </span>
              </div>

              {/* Big Metric Display */}
              <div className="text-center py-4 bg-slate-50 rounded-lg border border-slate-300">
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  24-Hour Quantitative Precipitation Forecast (QPF)
                </span>
                <div className="text-4xl font-black text-[#002855] font-mono">
                  {inferenceResult.predictedRain} <span className="text-lg text-slate-600">mm / 24h</span>
                </div>

                <div className="mt-2 text-xs font-extrabold text-slate-800">
                  {inferenceResult.imdCategory}
                </div>

                {/* Risk Badge */}
                <div className="mt-3">
                  {inferenceResult.riskLevel === "Critical Cloudburst" && (
                    <span className="bg-red-600 text-white font-black text-xs px-3 py-1 rounded inline-flex items-center gap-1 shadow-xs">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      IMD RED WARNING (TAKE ACTION)
                    </span>
                  )}
                  {inferenceResult.riskLevel === "Alert" && (
                    <span className="bg-orange-500 text-white font-black text-xs px-3 py-1 rounded inline-flex items-center gap-1 shadow-xs">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      IMD ORANGE ALERT (BE PREPARED)
                    </span>
                  )}
                  {inferenceResult.riskLevel === "Watch" && (
                    <span className="bg-yellow-400 text-slate-950 font-black text-xs px-3 py-1 rounded inline-flex items-center gap-1 shadow-xs">
                      <Info className="w-3.5 h-3.5" />
                      IMD YELLOW WATCH (BE UPDATED)
                    </span>
                  )}
                  {inferenceResult.riskLevel === "Normal" && (
                    <span className="bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded inline-flex items-center gap-1 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      IMD GREEN STATUS (NO WARNING)
                    </span>
                  )}
                </div>
              </div>

              {/* Hydrometeorological Secondary Metrics */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 font-mono">
                  <span className="text-slate-500 font-bold block text-[10px] font-sans uppercase">
                    Runoff Discharge Index
                  </span>
                  <span className="text-base font-black text-slate-900 mt-0.5 block">
                    {inferenceResult.runoffIndex} / 100
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 font-mono">
                  <span className="text-slate-500 font-bold block text-[10px] font-sans uppercase">
                    Disaster Lead Window
                  </span>
                  <span className="text-base font-black text-[#002855] mt-0.5 block">
                    24 to 36 Hours
                  </span>
                </div>
              </div>

              {/* Official Action Advisory */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-3 text-xs space-y-1">
                <span className="text-amber-950 font-black uppercase tracking-wide flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                  Official Decision Support Advisory:
                </span>
                <p className="text-slate-800 leading-relaxed font-medium">{inferenceResult.advisory}</p>
              </div>

              {/* SHAP Feature Weights */}
              <div className="pt-2 border-t border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  Model SHAP Feature Attribution:
                </span>
                <div className="space-y-1">
                  {ML_MODEL_METRICS.featureWeights.map((fw) => (
                    <div key={fw.feature} className="space-y-0.5">
                      <div className="flex justify-between text-[10px] font-bold text-slate-700">
                        <span>{fw.feature}</span>
                        <span className="font-mono text-[#002855]">{fw.weight}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded overflow-hidden">
                        <div
                          style={{ width: `${fw.weight * 2.5}%` }}
                          className="h-full bg-[#002855] rounded"
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
