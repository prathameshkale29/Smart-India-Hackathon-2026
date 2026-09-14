# VATAVARAN (वातावरण) AI — Smart India Hackathon 2026

> **AI-Driven Wardha District Rainfall Analytics & Flood Early Warning System**
> Final Year B.Tech Engineering Capstone Prototype for Smart India Hackathon 2026 (Problem Statement ID: `SIH-2026-ENV-1042`).

---

## 🌧️ Overview

**VATAVARAN AI** is a micro-level localized precipitation forecasting and flash flood risk assessment prototype trained on **10 Taluka rainfall stations across Wardha District, Maharashtra** (33,680+ daily meteorological records from IMD Pune NDCQ, 2010–2024).

### Key Highlights
- **Stacked Bi-LSTM + XGBoost Ensemble**: Sequential temporal encoder fusing antecedent rainfall, relative humidity, atmospheric pressure, and soil moisture saturation index.
- **Micro-Level Wardha Taluka Coverage**: Arvi, Ashti, Deoli, Hinganghat, Kharangha, Samudrapur, Selu, Sindi, Wardha Central AWS, and Wardha Observatory.
- **Interactive ML Prediction Sandbox**: Real-time simulation of precipitation levels, inundation risk thresholds, and SHAP feature attributions.
- **Model Benchmark**: $R^2 = 0.894$, $\text{RMSE} = 4.18\text{ mm}$, Flash Flood $F_1 = 93.8\%$.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- npm, pnpm, or bun

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Production Build & Preview
```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack
- **Frontend & Routing**: React 19, TanStack Start, TanStack Router, TanStack Query
- **Styling**: Tailwind CSS v4, Lucide Icons, Radix UI
- **Data Visualizations**: Recharts (Temporal Climatology, Epoch Loss Curves, Area Trends)
- **Machine Learning**: Stacked Bi-Directional LSTM + Gradient Boosted Regressor
- **Datasets**: 10 IMD NDCQ Daily Rainfall CSV archives (Wardha District)
