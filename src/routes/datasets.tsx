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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Upload Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Dataset Summary */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            Wardha District IMD NDCQ Daily CSV Datasets
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            The prototype is trained on 10 localized station archives formatted per the
            National Data Centre Pune (NDCQ) standard. Below is the parsed registry of
            daily rainfall observations.
          </p>

          {/* Filter and Search Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search station or filename..."
                value={datasetSearch}
                onChange={(e) => setDatasetSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 font-medium shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Right: Custom CSV Test Sandbox */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <UploadCloud className="w-4 h-4 text-blue-600" />
              Test Custom CSV File
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Upload an external NDCQ rainfall file to test parsing &amp; feature extraction.
            </p>
          </div>

          <div className="mt-3 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 text-center cursor-pointer transition bg-slate-50/70">
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
              <UploadCloud className="w-6 h-6 text-slate-400 mx-auto" />
              <span className="text-xs text-blue-700 font-bold block">
                {uploadedFileName
                  ? `Loaded: ${uploadedFileName}`
                  : "Click to select .CSV file"}
              </span>
              <span className="text-[10px] text-slate-500 block">
                NDCQ format: Date, Rainfall (mm)
              </span>
            </label>
          </div>

          {uploadedFileName && !csvParseError && csvPreviewRows.length === 0 && (
            <div className="mt-2 text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" /> Parsing CSV...
            </div>
          )}
          {csvParseError && (
            <div className="mt-2 text-xs text-red-700 bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-red-600" /> {csvParseError}
            </div>
          )}
          {csvPreviewRows.length > 0 && (
            <div className="mt-2 text-xs text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Parsed {csvPreviewRows.length - 1} rows
              — preview below
            </div>
          )}
        </div>
      </div>

      {/* Datasets Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 font-bold">Station</th>
                <th className="py-3 px-3 font-bold">Filename</th>
                <th className="py-3 px-3 font-bold">Coordinates</th>
                <th className="py-3 px-3 text-right font-bold">Total Rows</th>
                <th className="py-3 px-3 text-right font-bold">Annual Mean</th>
                <th className="py-3 px-3 text-right font-bold">Historical Max</th>
                <th className="py-3 px-3 text-center font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {WARDHA_STATIONS.filter(
                (s) =>
                  s.name.toLowerCase().includes(datasetSearch.toLowerCase()) ||
                  s.file.toLowerCase().includes(datasetSearch.toLowerCase())
              ).map((stn) => (
                <tr key={stn.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-3 text-slate-900 font-bold">{stn.name}</td>
                  <td className="py-3 px-3 text-blue-700 font-semibold">{stn.file}</td>
                  <td className="py-3 px-3 text-slate-600 font-medium">
                    {stn.lat}, {stn.lon}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-800 font-medium">
                    {stn.totalRecords.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-800 font-medium">
                    {stn.avgAnnual} mm
                  </td>
                  <td className="py-3 px-3 text-right text-amber-700 font-extrabold">
                    {stn.maxRain} mm
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Link
                      to="/stations"
                      search={{ station: stn.id }}
                      className="text-[11px] text-blue-700 hover:text-blue-900 font-bold hover:underline"
                    >
                      Explore &rarr;
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
        <div className="bg-white border border-emerald-300 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            CSV Preview —{" "}
            <span className="text-emerald-700 font-mono font-bold">{uploadedFileName}</span>
            <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 ml-auto font-medium">
              First {csvPreviewRows.length - 1} data rows
            </span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  {(csvPreviewRows[0] || []).map((col, ci) => (
                    <th key={ci} className="py-2.5 px-3 text-left font-bold">
                      {col || `Col ${ci + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {csvPreviewRows.slice(1).map((row, ri) => (
                  <tr key={ri} className="hover:bg-slate-50/70 transition">
                    {row.map((cell, ci) => (
                      <td key={ci} className="py-2 px-3 text-slate-800">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3.5 flex items-center gap-2">
            <button
              onClick={() => {
                setUploadedFileName(null);
                setCsvPreviewRows([]);
                setCsvParseError(null);
              }}
              className="text-xs text-red-700 hover:text-red-800 font-semibold border border-red-200 bg-red-50 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              Clear
            </button>
            <Link
              to="/prediction"
              className="text-xs text-blue-700 hover:text-blue-800 font-bold border border-blue-200 bg-blue-50 px-3.5 py-1.5 rounded-lg transition flex items-center gap-1 hover:bg-blue-100 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Run AI Prediction on this data →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
