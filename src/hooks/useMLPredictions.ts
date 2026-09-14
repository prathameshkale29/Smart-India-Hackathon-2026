import { useState, useEffect } from "react";

export interface PanchayatForecast {
  id: string;
  name: string;
  taluka: string;
  lat: number;
  lon: number;
  date: string;
  predicted_rain: number;
  risk_level: "Critical Cloudburst" | "Heavy Rain Alert" | "Moderate Rain Watch" | "Light Rain" | "Dry / Trace";
  risk_color: string;
}

export interface StationForecast {
  lat: number;
  lon: number;
  elevation: number;
  predicted_24h_mm: number;
  risk_level: string;
  risk_color: string;
}

export interface MonthlyNormal {
  month: string;
  mean_rainfall: number;
  max_rainfall: number;
}

export interface YearlyTotal {
  year: number;
  total_rainfall: number;
}

export interface StationClimatology {
  total_records: number;
  max_rain: number;
  mean_annual: number;
  rain_days: number;
  monthly_normals: MonthlyNormal[];
  yearly_totals: YearlyTotal[];
}

export interface MLPredictions {
  generated_at: string | null;
  model_version?: string;
  data_coverage?: { from: string; to: string };
  model_metrics: {
    r2: number | null;
    rmse: number | null;
    mae: number | null;
    test_period?: string;
    train_samples?: number;
    test_samples?: number;
  };
  panchayat_forecasts: PanchayatForecast[];
  station_forecasts: Record<string, StationForecast>;
  station_climatology: Record<string, StationClimatology>;
}

const PENDING_STATE: MLPredictions = {
  generated_at: null,
  model_metrics: { r2: null, rmse: null, mae: null },
  panchayat_forecasts: [],
  station_forecasts: {},
  station_climatology: {},
};

export function useMLPredictions() {
  const [data, setData] = useState<MLPredictions>(PENDING_STATE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modelReady, setModelReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/ml_outputs/predictions.json", {
          cache: "no-store", // Always get the latest after notebook re-runs
        });
        if (!res.ok) throw new Error("predictions.json not found");
        const json: MLPredictions = await res.json();
        setData(json);
        setModelReady(
          json.generated_at !== "pending" &&
            json.generated_at !== null &&
            json.panchayat_forecasts.length > 0
        );
        setError(null);
      } catch (e: any) {
        setError(e.message);
        setModelReady(false);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Group panchayat forecasts by date
  const forecastsByDate = data.panchayat_forecasts.reduce(
    (acc, p) => {
      if (!acc[p.date]) acc[p.date] = [];
      acc[p.date].push(p);
      return acc;
    },
    {} as Record<string, PanchayatForecast[]>
  );

  const forecastDates = Object.keys(forecastsByDate).sort();
  const nextDayForecasts = forecastDates.length > 0 ? forecastsByDate[forecastDates[0]] : [];

  // Risk summary counts for next day
  const riskSummary = nextDayForecasts.reduce(
    (acc, p) => {
      acc[p.risk_level] = (acc[p.risk_level] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    data,
    loading,
    error,
    modelReady,
    forecastsByDate,
    forecastDates,
    nextDayForecasts,
    riskSummary,
  };
}
