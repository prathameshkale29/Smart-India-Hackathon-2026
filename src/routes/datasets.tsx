import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  FileSpreadsheet,
  Search,
  UploadCloud,
  RefreshCw,
  AlertTriangle,
  Check,
  Sparkles,
  Database,
  Building,
} from "lucide-react";
import { WARDHA_STATIONS } from "@/data/wardhaData";

export const Route = createFileRoute("/datasets")({
  component: DatasetsPage,
});

function DatasetsPage() {
  const [datasetSearch, setDatasetSearch] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [csvPreviewRows, setCsvPreviewRows] = useState<string[][]>([]);
  const [csvParseError, setCsvParseError] = useState<string | null>(null);

  const handleCsvUpload = (file: File) => {
    setUploadedFileName(file.name);
    setCsvPreviewRows([]);
    setCsvParseError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split(/\r?\n/).filter((l) => l.trim());
        const headerIdx = lines.findIndex((l) => l.toUpperCase().includes("DATE"));
        const startIdx = headerIdx >= 0 ? headerIdx : 0;
        const rows = lines
          .slice(startIdx, startIdx + 11)
          .map((l) => l.split(",").map((c) => c.trim()));
        if (rows.length === 0) throw new Error("No parseable rows found");
        setCsvPreviewRows(rows);
      } catch (err: any) {
        setCsvParseError(err.message || "Could not parse CSV");
      }
    };
    reader.onerror = () => setCsvParseError("Failed to read file");
    reader.readAsText(file);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Registry Masthead & CSV Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: NDC Pune Registry Dossier */}
        <div className="lg:col-span-2 bg-white border-2 border-[#002855] rounded-xl p-4.5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-[#002855]" />
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                IMD Meteorological Data Repository
              </span>
              <h2 className="text-base font-extrabold text-[#002855]">
                National Data Centre (NDC Pune) Daily NDCQ Meteorological Archives
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            This repository contains standardized daily rainfall telemetry records from 10 automatic stations in Wardha District (2010–2024), parsed in compliance with the IMD National Data Centre Pune NDCQ climatological standard.
          </p>

          {/* Search Filter */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Station Name, Taluka, or NDCQ File..."
                value={datasetSearch}
                onChange={(e) => setDatasetSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>
        </div>

        {/* Right: Custom NDCQ CSV Validation Sandbox */}
        <div className="bg-white border-2 border-[#002855] rounded-xl p-4.5 flex flex-col justify-between shadow-xs">
          <div>
            <h3 className="text-xs font-bold text-[#002855] uppercase flex items-center gap-1.5 mb-1">
              <UploadCloud className="w-4 h-4 text-blue-700" />
              External NDCQ CSV File Validation Sandbox
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Upload external daily rainfall CSV records to parse and extract antecedent moisture features.
            </p>
          </div>

          <div className="mt-2.5 border-2 border-dashed border-slate-300 hover:border-blue-700 rounded-lg p-3 text-center cursor-pointer transition bg-slate-50">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleCsvUpload(f);
              }}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer block space-y-1">
              <UploadCloud className="w-5 h-5 text-[#002855] mx-auto" />
              <span className="text-xs text-[#002855] font-bold block">
                {uploadedFileName ? `Loaded: ${uploadedFileName}` : "Click to select .CSV file"}
              </span>
              <span className="text-[10px] text-slate-500 block">
                Standard format: Date, Rainfall (mm)
              </span>
            </label>
          </div>

          {uploadedFileName && !csvParseError && csvPreviewRows.length === 0 && (
            <div className="mt-2 text-xs text-blue-800 font-bold flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin text-blue-700" /> Parsing NDCQ format...
            </div>
          )}
          {csvParseError && (
            <div className="mt-2 text-xs text-red-800 bg-red-50 p-2 rounded border border-red-200 flex items-center gap-1 font-bold">
              <AlertTriangle className="w-3 h-3 text-red-600" /> {csvParseError}
            </div>
          )}
          {csvPreviewRows.length > 0 && (
            <div className="mt-2 text-xs text-emerald-900 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded border border-emerald-300">
              <Check className="w-3.5 h-3.5 text-emerald-700" /> Successfully parsed {csvPreviewRows.length - 1} rows
            </div>
          )}
        </div>
      </div>

      {/* Official NDCQ Dataset Registry Table */}
      <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
          <span className="text-xs font-bold text-[#002855] uppercase">
            IMD Pune Quality-Controlled Daily Rainfall Archives (10 Stations)
          </span>
          <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            QC FLAG: LEVEL-1 AUDITED
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border border-slate-200 font-mono">
            <thead className="bg-[#002855] text-white uppercase text-[10px] font-bold">
              <tr>
                <th className="py-2.5 px-3">Station Name</th>
                <th className="py-2.5 px-3">NDCQ Archive Filename</th>
                <th className="py-2.5 px-3">Grid Coordinates</th>
                <th className="py-2.5 px-3 text-right">Observation Rows</th>
                <th className="py-2.5 px-3 text-right">Annual Mean</th>
                <th className="py-2.5 px-3 text-right">Record Deluge</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {WARDHA_STATIONS.filter(
                (s) =>
                  s.name.toLowerCase().includes(datasetSearch.toLowerCase()) ||
                  s.file.toLowerCase().includes(datasetSearch.toLowerCase())
              ).map((stn) => (
                <tr key={stn.id} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 px-3 text-slate-900 font-bold font-sans">
                    {stn.name} <span className="text-[10px] text-slate-500 font-normal">({stn.taluka})</span>
                  </td>
                  <td className="py-2.5 px-3 text-blue-800 font-bold">{stn.file}</td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {stn.lat}° N, {stn.lon}° E
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-900 font-bold">
                    {stn.totalRecords.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-700">
                    {stn.avgAnnual} mm
                  </td>
                  <td className="py-2.5 px-3 text-right text-amber-800 font-black">
                    {stn.maxRain} mm
                  </td>
                  <td className="py-2.5 px-3 text-center font-sans">
                    <Link
                      to="/stations"
                      search={{ station: stn.id }}
                      className="text-[11px] font-bold text-blue-700 hover:text-blue-900 hover:underline"
                    >
                      Dossier &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Preview Table */}
      {csvPreviewRows.length > 0 && (
        <div className="bg-white border-2 border-emerald-600 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
            <h3 className="text-xs font-bold text-[#002855] uppercase flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              Parsed NDCQ Preview — <span className="text-emerald-800 font-mono">{uploadedFileName}</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-mono">
              Sample: First {csvPreviewRows.length - 1} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono border border-slate-200">
              <thead className="bg-[#002855] text-white border-b border-slate-300">
                <tr>
                  {(csvPreviewRows[0] || []).map((col, ci) => (
                    <th key={ci} className="py-2 px-3 text-left font-bold text-[10px]">
                      {col || `Col ${ci + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {csvPreviewRows.slice(1).map((row, ri) => (
                  <tr key={ri} className="hover:bg-slate-50 transition">
                    {row.map((cell, ci) => (
                      <td key={ci} className="py-2 px-3 text-slate-800 font-medium">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => {
                setUploadedFileName(null);
                setCsvPreviewRows([]);
                setCsvParseError(null);
              }}
              className="text-xs text-red-800 font-bold border border-red-300 bg-red-50 px-3 py-1.5 rounded transition cursor-pointer"
            >
              Clear Buffer
            </button>
            <Link
              to="/prediction"
              className="text-xs text-white font-bold bg-[#002855] hover:bg-[#003875] px-3.5 py-1.5 rounded transition flex items-center gap-1 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Run AI Prediction on this data →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
