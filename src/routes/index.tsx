import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import emblem from "@/assets/emblem.png";
import satellite from "@/assets/insat-ir.jpg";
import radar from "@/assets/radar.jpg";
import warningMap from "@/assets/warning-map.jpg";
import briefing from "@/assets/briefing.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NMD | National Meteorological Department — Weather Portal" },
      {
        name: "description",
        content:
          "Current warnings, nowcasts, satellite and radar imagery, station observations and daily weather bulletins issued by the National Meteorological Department.",
      },
      {
        property: "og:title",
        content: "National Meteorological Department — Weather Portal",
      },
      {
        property: "og:description",
        content:
          "Warnings, nowcasts, satellite and radar products, station observations and daily bulletins.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portal,
});

const NAV = [
  { label: "Home", caret: false },
  { label: "About Us", caret: true },
  { label: "Forecast", caret: true },
  { label: "Warnings", caret: true },
  { label: "Observations", caret: true },
  { label: "Satellite", caret: true },
  { label: "Radar", caret: false },
  { label: "Cyclone", caret: true },
  { label: "Monsoon", caret: true },
  { label: "Climate Data", caret: true },
  { label: "Aviation", caret: false },
  { label: "Agromet", caret: true },
  { label: "Publications", caret: true },
  { label: "Contact", caret: false },
];

const TICKER = [
  "10-09-2026 05:30 IST — Deep Depression over Westcentral Bay of Bengal, likely to intensify into a Cyclonic Storm during next 24 hrs.",
  "10-09-2026 04:15 IST — ORANGE warning issued for Konkan & Goa: isolated extremely heavy rainfall (>204.5 mm) on 11 & 12 Sept.",
  "09-09-2026 20:00 IST — Press Release No. 412/2026: Monsoon 2026 seasonal rainfall 104% of LPA up to 09 Sept.",
  "09-09-2026 17:45 IST — DWR Sriharikota returned to service after scheduled klystron replacement (downtime 06:00–17:30 IST).",
  "08-09-2026 11:00 IST — Tender NMD/PROC/2026-27/117 for supply of 60 AWS sensor packages — last date 26-09-2026.",
];

const CALLOUTS = [
  {
    title: "Warnings",
    color: "bg-signal-red",
    links: ["All India Colour-Coded Warning", "District-wise Warning (Day 1–5)"],
  },
  {
    title: "Nowcast",
    color: "bg-signal-amber",
    links: ["Nowcast for 1200 Stations (3 hrs)", "Thunderstorm & Lightning Alerts"],
  },
  {
    title: "Public Observation",
    color: "bg-signal-teal",
    links: ["Current Weather — 720 Stations", "Past 24 hr Rainfall Statement"],
  },
  {
    title: "Specialized Forecast",
    color: "bg-navy-light",
    links: ["Aviation (TAF / METAR)", "Agromet Advisory Bulletin"],
  },
];

const TABS = [
  {
    id: "satellite",
    label: "Satellite",
    img: satellite,
    caption:
      "INSAT-3DR IR1 (10.8 µm) — 10-09-2026 0600 UTC / 1130 IST — Sector: Asia, 4 km resolution",
  },
  {
    id: "radar",
    label: "Radar",
    img: radar,
    caption:
      "DWR Chennai (13.0827°N, 80.2707°E) MAX-Z — 10-09-2026 0600 UTC / 1130 IST — Range 250 km",
  },
  {
    id: "lightning",
    label: "Lightning",
    img: satellite,
    caption:
      "Lightning Detection Network composite — strokes 0300–0600 UTC 10-09-2026 — 34,812 CG strokes",
  },
];

const STATIONS = [
  ["Safdarjung, Delhi", "34.2", "26.1", "0.0", "SE 08"],
  ["Santacruz, Mumbai", "29.8", "25.4", "62.4", "W 22"],
  ["Alipore, Kolkata", "31.6", "26.9", "18.2", "S 14"],
  ["Nungambakkam, Chennai", "33.1", "27.0", "4.6", "E 11"],
  ["Bengaluru City", "27.4", "20.2", "9.8", "W 06"],
  ["Ahmedabad", "35.6", "26.8", "0.0", "SW 12"],
  ["Guwahati", "32.0", "26.4", "27.1", "SE 07"],
];

const NEWS = [
  {
    date: "09-09-2026",
    title: "Monsoon withdrawal from West Rajasthan likely around 17 September",
    img: satellite,
  },
  {
    date: "07-09-2026",
    title: "NMD commissions 12 new Automatic Weather Stations in Ladakh sector",
    img: warningMap,
  },
  {
    date: "04-09-2026",
    title: "Annual Climate Statement 2025 released; mean anomaly +0.65 °C",
    img: radar,
  },
];

const LINK_COLS = [
  {
    head: "Products & Services",
    items: [
      "All India Weather Bulletin (0830 IST)",
      "District Rainfall Statement",
      "Reservoir Rainfall Monitoring",
      "Heat Wave / Cold Wave Statement",
      "Sea Area Bulletin (Fishermen)",
      "Tourism Weather Service",
      "Ozone & UV Index",
    ],
  },
  {
    head: "Data & Archives",
    items: [
      "Data Supply Portal (paid service)",
      "Climatological Normals 1991–2020",
      "Station-wise Daily Rainfall Archive",
      "Radiosonde / Pilot Balloon Data",
      "Cyclone eAtlas — Bay & Arabian Sea",
      "Historic Storm Track Database",
    ],
  },
  {
    head: "Departmental",
    items: [
      "Tenders & Procurement Notices",
      "Recruitment / Result Notices",
      "RTI Disclosures (Section 4(1)(b))",
      "Citizen's Charter",
      "Annual Report 2025-26 (PDF, 8.4 MB)",
      "Vigilance & Grievance Cell",
      "Officers' Directory",
    ],
  },
  {
    head: "Allied Organisations",
    items: [
      "National Centre for Medium Range Forecasting",
      "Institute of Tropical Meteorology",
      "National Disaster Management Authority",
      "Central Water Commission",
      "Space Research Organisation",
      "World Meteorological Organization",
    ],
  },
];

function Portal() {
  const [tab, setTab] = useState("satellite");
  const [mapTab, setMapTab] = useState("warnings");
  const active = TABS.find((t) => t.id === tab)!;

  return (
    <div className="min-h-screen bg-background">
      {/* Utility bar */}
      <div className="border-b border-border bg-navy-dark text-signal-foreground">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-end gap-3 px-2 py-1 text-[0.8rem]">
          <span className="mr-auto tech-label text-signal-foreground/70">
            Last site update: 10-09-2026 11:42 IST
          </span>
          <a href="#" className="text-signal-foreground hover:underline">
            Screen Reader
          </a>
          <span className="text-signal-foreground/40">|</span>
          <a href="#" className="text-signal-foreground hover:underline">
            A-
          </a>
          <a href="#" className="text-signal-foreground hover:underline">
            A
          </a>
          <a href="#" className="text-signal-foreground hover:underline">
            A+
          </a>
          <span className="text-signal-foreground/40">|</span>
          <a href="#" aria-label="Twitter" className="text-signal-foreground">
            [t]
          </a>
          <a href="#" aria-label="Facebook" className="text-signal-foreground">
            [f]
          </a>
          <a href="#" aria-label="YouTube" className="text-signal-foreground">
            [yt]
          </a>
          <span className="text-signal-foreground/40">|</span>
          <button
            type="button"
            className="border border-signal-foreground/50 px-2 py-[1px] text-[0.8rem] hover:bg-signal-foreground/10"
          >
            हिन्दी
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-4 px-2 py-2">
          <img
            src={emblem}
            alt="National Meteorological Department emblem"
            width={512}
            height={512}
            className="h-14 w-14 shrink-0"
          />
          <div className="min-w-[220px] leading-tight">
            <h1 className="text-[1.35rem] font-bold text-navy">
              National Meteorological Department
            </h1>
            <div className="text-[0.95rem] text-foreground">
              Ministry of Earth Sciences &nbsp;·&nbsp; Government Portal
            </div>
            <div className="tech-label">
              WMO Regional Specialised Meteorological Centre — Tropical Cyclones
            </div>
          </div>

          <form className="ml-auto flex items-center" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="q" className="sr-only">
              Search the portal
            </label>
            <input
              id="q"
              type="search"
              placeholder="Search bulletins, stations, circulars…"
              className="h-7 w-[230px] border border-input bg-background px-2 text-[0.85rem] outline-none focus:border-navy"
            />
            <button
              type="submit"
              className="h-7 border border-navy bg-navy px-3 text-[0.85rem] font-bold text-signal-foreground"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-1">
            {["RSMC", "WMO", "NDMA", "G20"].map((b) => (
              <span
                key={b}
                className="border border-border bg-muted px-2 py-[6px] text-[0.72rem] font-bold tracking-wide text-navy"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Primary nav */}
      <nav className="bg-navy text-signal-foreground">
        <ul className="mx-auto flex max-w-[1200px] flex-wrap px-1">
          {NAV.map((n) => (
            <li key={n.label}>
              <a
                href="#"
                className="block border-r border-signal-foreground/15 px-[9px] py-[6px] text-[0.85rem] font-bold text-signal-foreground hover:bg-navy-light hover:no-underline"
              >
                {n.label}
                {n.caret ? <span className="ml-1 text-[0.65rem]">▼</span> : null}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Ticker */}
      <div className="flex items-stretch border-b border-border bg-signal-red text-signal-foreground">
        <div className="shrink-0 border-r border-signal-foreground/30 bg-signal-red px-2 py-1 text-[0.8rem] font-bold uppercase">
          Latest ▸
        </div>
        <div className="overflow-hidden py-1">
          <div className="ticker-track">
            {[0, 1].map((dup) => (
              <span key={dup} className="flex">
                {TICKER.map((t) => (
                  <span key={t} className="px-6 text-[0.85rem]">
                    {t}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Callout strip */}
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 md:grid-cols-4">
        {CALLOUTS.map((c) => (
          <div
            key={c.title}
            className={`${c.color} border border-background/20 px-3 py-2 text-signal-foreground`}
          >
            <div className="mb-1 text-[0.95rem] font-bold uppercase tracking-wide">{c.title}</div>
            <ul>
              {c.links.map((l) => (
                <li key={l} className="leading-snug">
                  <a
                    href="#"
                    className="text-[0.83rem] text-signal-foreground underline-offset-2 hover:underline"
                  >
                    » {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Main dashboard */}
      <main className="mx-auto grid max-w-[1200px] gap-2 px-2 py-2 lg:grid-cols-[260px_minmax(0,1fr)_270px]">
        {/* Left column */}
        <div className="space-y-2">
          <section className="panel">
            <h2 className="panel-head">All India Warning Map</h2>
            <div className="flex border-b border-border bg-strip">
              {(
                [
                  ["warnings", "Day 1"],
                  ["day2", "Day 2"],
                  ["rain", "Rainfall"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMapTab(id)}
                  className={`border-r border-border px-2 py-1 text-[0.8rem] font-bold ${
                    mapTab === id ? "bg-navy text-signal-foreground" : "text-navy hover:bg-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <img
              src={warningMap}
              alt="Colour coded meteorological subdivision warning map of India"
              width={800}
              height={900}
              loading="lazy"
              className="w-full"
            />
            <div className="border-t border-border p-1 tech-label">
              Valid 10-09-2026 0830 IST – 11-09-2026 0830 IST
            </div>
            <ul className="border-t border-border p-2 text-[0.8rem]">
              {[
                ["bg-signal-red", "Red — Take action (4 subdivisions)"],
                ["bg-signal-amber", "Orange — Be prepared (7)"],
                ["bg-signal-green", "Green — No warning (19)"],
              ].map(([c, t]) => (
                <li key={t} className="flex items-center gap-2 py-[2px]">
                  <span className={`inline-block h-3 w-3 ${c}`} />
                  {t}
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <h2 className="panel-head">Key Values — 0830 IST</h2>
            <table className="w-full text-[0.8rem]">
              <tbody>
                {[
                  ["Highest max temp", "Barmer 41.2 °C"],
                  ["Lowest min temp", "Leh 4.6 °C"],
                  ["Highest rainfall (24h)", "Mahabaleshwar 218.6 mm"],
                  ["Cumulative rain (1 Jun)", "845.1 mm (104% LPA)"],
                  ["Active systems", "01 Deep Depression"],
                ].map(([k, v], i) => (
                  <tr key={k} className={i % 2 ? "bg-table-stripe" : ""}>
                    <th className="border-b border-border p-1 text-left font-normal text-muted-foreground">
                      {k}
                    </th>
                    <td className="border-b border-border p-1 text-right font-bold">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        {/* Centre column */}
        <div className="space-y-2">
          <section className="panel">
            <div className="flex items-end justify-between border-b border-border bg-strip">
              <div className="flex">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`border-r border-border px-3 py-[6px] text-[0.85rem] font-bold ${
                      tab === t.id ? "bg-navy text-signal-foreground" : "text-navy hover:bg-muted"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <span className="px-2 pb-1 tech-label">Auto-refresh 30 min</span>
            </div>
            <img
              src={active.img}
              alt={active.caption}
              width={1024}
              height={768}
              className="w-full border-b border-border"
            />
            <div className="flex flex-wrap items-center justify-between gap-2 p-1">
              <span className="tech-label">{active.caption}</span>
              <span className="text-[0.8rem]">
                <a href="#">Animation (last 12 frames)</a> · <a href="#">Full resolution</a>
              </span>
            </div>
          </section>

          <section className="panel">
            <h2 className="panel-head">Current Weather — Selected Stations</h2>
            <table className="w-full border-collapse text-[0.82rem]">
              <thead>
                <tr className="bg-strip text-left">
                  <th className="border border-border p-1">Station</th>
                  <th className="border border-border p-1">Max °C</th>
                  <th className="border border-border p-1">Min °C</th>
                  <th className="border border-border p-1">Rain 24h (mm)</th>
                  <th className="border border-border p-1">Wind (kt)</th>
                </tr>
              </thead>
              <tbody>
                {STATIONS.map((r, i) => (
                  <tr key={r[0]} className={i % 2 ? "bg-table-stripe" : ""}>
                    {r.map((c, j) => (
                      <td
                        key={j}
                        className={`border border-border p-1 ${
                          j === 0 ? "" : "text-right font-mono"
                        }`}
                      >
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-border p-1 tech-label">
              Observations recorded at 0830 IST (0300 UTC) 10-09-2026 ·{" "}
              <a href="#">All 720 stations</a>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-2">
          <section className="panel">
            <h2 className="panel-head">Weather Video Briefing</h2>
            <a href="#" className="block">
              <img
                src={briefing}
                alt="Duty forecaster delivering the daily national weather briefing"
                width={800}
                height={512}
                loading="lazy"
                className="w-full"
              />
            </a>
            <div className="p-1">
              <a href="#" className="text-[0.85rem] font-bold">
                National Weather Briefing — 10 September 2026 (1130 IST)
              </a>
              <div className="tech-label">Duration 08:42 · Hindi &amp; English</div>
            </div>
          </section>

          <section className="panel">
            <h2 className="panel-head">Press Releases</h2>
            <ul className="linklist p-1">
              {NEWS.map((n) => (
                <li key={n.title} className="flex gap-2">
                  <img
                    src={n.img}
                    alt=""
                    width={64}
                    height={48}
                    loading="lazy"
                    className="h-[42px] w-[58px] shrink-0 border border-border object-cover"
                  />
                  <span className="text-[0.82rem] leading-snug">
                    <span className="tech-label">{n.date}</span>
                    <br />
                    <a href="#">{n.title}</a>
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t border-border p-1 text-right text-[0.8rem]">
              <a href="#">All press releases »</a>
            </div>
          </section>

          <section className="panel">
            <h2 className="panel-head">Cyclone Watch</h2>
            <div className="p-2 text-[0.82rem] leading-snug">
              <strong>Deep Depression BOB 04</strong>
              <br />
              Position 0530 IST: 16.4°N / 86.9°E, about 310 km ESE of Visakhapatnam.
              <br />
              Max sustained wind: 55–65 kmph gusting 75 kmph.
              <br />
              Movement: NW at 14 kmph.
              <br />
              <a href="#">Bulletin No. 14 (PDF)</a> · <a href="#">Track map</a>
            </div>
          </section>
        </div>
      </main>

      {/* Important links */}
      <section className="mx-auto max-w-[1200px] border-t border-border px-2 py-3">
        <h2 className="mb-2 border-b-2 border-navy pb-1 text-[1.05rem] font-bold uppercase text-navy">
          Important Links
        </h2>
        <div className="grid gap-x-8 gap-y-3 md:grid-cols-4">
          {LINK_COLS.map((col) => (
            <div key={col.head}>
              <h3 className="mb-1 text-[0.9rem] font-bold">{col.head}</h3>
              <ul className="list-disc pl-4 text-[0.83rem] leading-[1.6]">
                {col.items.map((i) => (
                  <li key={i}>
                    <a href="#">{i}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border bg-navy-dark text-signal-foreground">
        <div className="mx-auto max-w-[1200px] px-2 py-3 text-[0.8rem] leading-relaxed">
          <p>
            Content owned and maintained by the National Meteorological Department, Mausam Bhavan,
            Lodi Road, New Delhi 110003. Telephone Control Room: 011-2461-1842 (24×7).
          </p>
          <p className="mt-1 text-signal-foreground/70">
            Site designed, developed and hosted by the NMD Information Systems &amp; Services
            Division · Best viewed at 1280×1024 · Page generated 10-09-2026 11:42:07 IST · Visitors:
            41,208,663
          </p>
          <p className="mt-1">
            <a href="#" className="text-signal-foreground underline">
              Terms of Use
            </a>{" "}
            ·{" "}
            <a href="#" className="text-signal-foreground underline">
              Privacy Policy
            </a>{" "}
            ·{" "}
            <a href="#" className="text-signal-foreground underline">
              Copyright Policy
            </a>{" "}
            ·{" "}
            <a href="#" className="text-signal-foreground underline">
              Web Information Manager
            </a>{" "}
            ·{" "}
            <a href="#" className="text-signal-foreground underline">
              Sitemap
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
