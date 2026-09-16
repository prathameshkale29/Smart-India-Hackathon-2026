# VATAVARAN AI — Figma UI/UX Design System Specification (SIH 2026)

Official Design System and Wireframe Architecture inspired by the **India Meteorological Department (IMD)** & **Ministry of Earth Sciences (MoES)** government portal standards, crafted for **Team Vatavaran** for the Smart India Hackathon 2026 Grand Finale.

---

## 1. Canvas & Frame Configuration (Figma Desktop)

- **Frame Preset**: Desktop 1440 px (Width: 1440px, Height: Auto / 1024px min)
- **Grid System**: 12-Column Grid
  - Margin: `64px`
  - Gutter: `20px`
  - Column Width: `88px`
- **Base Spacing Unit**: `4px` / `8px` / `16px` / `24px` / `32px` / `48px`

---

## 2. Color Palette & Figma Color Styles

### Primary Government Palette
| Token Name | Hex Code | Usage |
|---|---|---|
| `Gov/Navy-Dark` | `#001A38` | Top masthead, footer base, contrast badges |
| `Gov/Navy-Primary` | `#002855` | Main navigation bar, table headers, primary buttons |
| `Gov/Navy-Hover` | `#003875` | Hover states, secondary action bars |
| `Gov/Blue-Accent` | `#004B99` | Data links, interactive tags |
| `Gov/Cyan-Live` | `#38BDF8` | Live pulse dots, GIS radar vectors |

### IMD 4-Stage Alert Color System
| Alert Level | Background | Border | Text | Meaning |
|---|---|---|---|---|
| **Green (No Warning)** | `#ECFDF5` | `#A7F3D0` | `#065F46` | No severe weather expected / Normal |
| **Yellow (Watch)** | `#FEFCE8` | `#FDE047` | `#854D0E` | Be updated on localized showers |
| **Orange (Alert)** | `#FFF7ED` | `#FDBA74` | `#9A3412` | Be prepared for heavy deluge & waterlogging |
| **Red (Warning)** | `#FEF2F2` | `#FCA5A5` | `#991B1B` | Take immediate action / Flash flood threat |

### Surface & Neutrals
| Token Name | Hex Code | Usage |
|---|---|---|
| `Surface/Canvas` | `#F4F6F9` | Application background |
| `Surface/Card` | `#FFFFFF` | Primary content panels and data dossiers |
| `Surface/Subtle` | `#F8FAFC` | Data table alternate rows, input backgrounds |
| `Border/Default` | `#CBD5E1` | Panel borders, table borders |
| `Text/Primary` | `#0F172A` | Primary typography |
| `Text/Secondary` | `#475569` | Meta descriptions and labels |
| `Text/Muted` | `#94A3B8` | Watermarks, coordinate captions |

---

## 3. Typography Hierarchy (Google Fonts: Inter + Roboto Mono)

- **National Masthead**: Inter Bold `11px` (Letter-spacing: `+0.05em`)
- **Portal Title**: Georgia / Inter Black `18px` (Uppercase)
- **Section Headers (H2)**: Inter ExtraBold `15px` (`#002855`)
- **Card Titles (H3)**: Inter Bold `13px` (`#0F172A`)
- **Body Regular**: Inter Medium `12px` (Line-height: `1.5`)
- **Data / Metrics Large**: Roboto Mono Black `24px` / `36px`
- **Station Coordinates / NDCQ Codes**: Roboto Mono Bold `11px`

---

## 4. Multi-Page Architecture (6 Dedicated Figma Pages)

### Page 1: Overview & Taluka Network (`/`)
- **Frame 1.1**: Masthead with National Tricolor Stripe & Live IST Clock.
- **Frame 1.2**: IMD 5-Day Sub-Divisional Warning Matrix (5 alert cards).
- **Frame 1.3**: 4 Primary Climatological Metrics (33,680 records, 1128.4mm LPA, 256mm Deluge, 0.894 R²).
- **Frame 1.4 (Left, 7-col)**: 10-Taluka Telemetry Station Registry Table with IMD status badges.
- **Frame 1.5 (Right, 5-col)**: 2D GIS Radar Visualizer & Severe Weather Inundation Advisory dossier.

### Page 2: QPF & Flood Simulation Console (`/prediction`)
- **Frame 2.1**: NMDSS Console Banner with 4 Synoptic Scenario Presets.
- **Frame 2.2 (Left, 7-col)**: 5 Meteorological Sliders ($API_7$, $RH\%$, $S_w$, $P_0$, $T_B$).
- **Frame 2.3 (Right, 5-col)**: Quantitative Precipitation Forecast (QPF) Display with IMD Category, Runoff Index, and SHAP Feature Attribution bars.

### Page 3: Station Climatology Dossier (`/stations`)
- **Frame 3.1**: Station Selection Bar with WMO Metadata, Coordinates, and NDCQ File.
- **Frame 3.2**: Monthly Climatological Normal spike bar chart (Recharts).
- **Frame 3.3**: 7-Year Annual Cumulative Rain Departure area chart.
- **Frame 3.4**: Recent Daily Meteorological Observation Registry Table.

### Page 4: NDC Pune Datasets Explorer (`/datasets`)
- **Frame 4.1**: NDC Pune Meteorological Registry Header with Search Filter.
- **Frame 4.2**: NDCQ External CSV File Validation & Parser Sandbox.
- **Frame 4.3**: 10 Station Archives Table with QC Level-1 Audited Flag.
- **Frame 4.4**: In-Browser CSV Data Preview Table.

### Page 5: Model Architecture & Specs (`/architecture`)
- **Frame 5.1**: Model Specs Grid (Bi-LSTM + XGBoost, R²: 0.894, F1: 93.8%, Lead: 24–48h).
- **Frame 5.2**: 4-Stage Deep Learning Pipeline Schematic Cards.
- **Frame 5.3**: 40-Epoch Training vs Validation Loss Curve (Line Chart).
- **Frame 5.4**: Academic & SIH 2026 Capstone Metadata Dossier.

### Page 6: Live Panchayat Forecast Bulletin (`/ml-results`)
- **Frame 6.1**: Live Model Pipeline Connected Banner (Jupyter `predictions.json` feed).
- **Frame 6.2**: Model Accuracy Metric Pills (R², RMSE, MAE, Panchayats).
- **Frame 6.3**: 24-Hour Panchayat Risk Distribution Summary Badges.
- **Frame 6.4**: IDW Downscaled Gram Panchayat Precipitation Forecast Table.

---

## 5. How to Import to Figma

1. **Option A (Figma Tokens Plugin)**: Open Figma → Install **Tokens Studio for Figma** → Import `figma/figma_tokens.json` to auto-generate all color, typography, and spacing styles.
2. **Option B (Vector SVG Wireframe)**: Open Figma → Drag and drop `figma/figma_wireframes.svg` into your canvas to get instantly editable vector frames for all 6 pages.
