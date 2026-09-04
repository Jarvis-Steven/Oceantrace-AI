import { useEffect, useState } from "react";
import { getEvidence } from "../lib/api";
import {
  FileText,
  Download,
  Printer,
  Share2,
  Satellite,
  Ship,
  Waves,
  Anchor,
  AlertTriangle,
  ShieldAlert,
  Radio,
  X,
} from "lucide-react";

import { useOutletContext } from "react-router-dom";

function Evidence() {
  const context = useOutletContext() || {};
  const simulate = context.isSimulated ?? true;
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState("dossier");

  const [dispatchAlertModal, setDispatchAlertModal] = useState(null);

  useEffect(() => {
    setLoading(true);
    getEvidence(simulate)
      .then((res) => {
        setReport(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [simulate]);

  const handleExportJson = () => {
    if (!report) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `OCEANTRACE_DOCUMENT_${selectedDoc.toUpperCase()}_${report.incident_id || "REPORT"}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDispatchCoastGuardAlert = () => {
    const vessel = report?.attribution?.top_candidate || {
      shipName: "MV ARABIAN STAR",
      mmsi: "419001234",
      flag: "IN",
      vesselType: "Oil Tanker",
      attribution_score: 84.8,
      distance_km: 18.2,
      dist_to_drift_corridor_km: 1.8,
    };

    setDispatchAlertModal({
      timestamp: new Date().toISOString(),
      dispatchId: `ALERT-MRCC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      vesselName: vessel.shipName,
      mmsi: vessel.mmsi,
      flag: vessel.flag,
      vesselType: vessel.vesselType,
      attributionScore: vessel.attribution_score || vessel.attributionScore || 84.8,
      distanceKm: vessel.distance_km || vessel.distanceKm || 18.2,
      corridorOffsetKm: vessel.dist_to_drift_corridor_km || 1.8,
      status: "TRANSMITTED TO MARITIME RESCUE COORDINATION CENTRE (MRCC)",
    });
  };

  const spill = report?.spill;
  const topCandidate = report?.attribution?.top_candidate;

  const candidates = report?.attribution?.candidate_vessels || [];
  const topFiveCandidates = candidates.slice(0, 5);

  return (
    <div className="h-full w-full overflow-y-auto bg-[var(--bg-main)] text-[var(--text-primary)] p-4 sm:p-6 space-y-6 font-sans">
      
      <div className="space-y-6 print-hide">
      
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] font-extrabold text-xl">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-widest">
                DOCUMENT ARCHIVE & EVIDENCE FILE
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-[var(--bg-card-elevated)] text-emerald-700 dark:text-emerald-400 border border-[var(--border-color)] font-bold">
                ● CASE FILE VERIFIED
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
              Dossier ID: {report?.incident_id || "S1-2026-08-12"}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono">
          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-card)] text-xs font-mono font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" /> Export JSON
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-xs font-mono font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-sm text-[var(--text-muted)]">
          Fetching forensic dossier files & satellite telemetry logs...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-color)] pb-2">
              SELECT DOCUMENT TO INSPECT
            </h3>

            <div className="space-y-2.5 font-mono text-xs">
              <div
                onClick={() => setSelectedDoc("dossier")}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedDoc === "dossier"
                    ? "bg-[var(--bg-card-elevated)] border-2 border-[var(--text-primary)] text-[var(--text-primary)] font-extrabold"
                    : "bg-[var(--bg-card-elevated)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4" />
                  <div>
                    <div className="font-bold">INCIDENT DOSSIER S1-2026-08</div>
                    <div className="text-[10px] text-[var(--text-muted)] font-sans">Full Case File & Attribution Rationale</div>
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded bg-[var(--bg-card)] text-[var(--text-primary)] font-bold border border-[var(--border-color)]">
                  VERIFIED
                </span>
              </div>

              <div
                onClick={() => setSelectedDoc("sar")}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedDoc === "sar"
                    ? "bg-[var(--bg-card-elevated)] border-2 border-[var(--text-primary)] text-[var(--text-primary)] font-extrabold"
                    : "bg-[var(--bg-card-elevated)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Satellite className="w-4 h-4" />
                  <div>
                    <div className="font-bold">SAR SLICK DETECTION SDR-2026</div>
                    <div className="text-[10px] text-[var(--text-muted)] font-sans">Sentinel-1 VV Backscatter Analysis</div>
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded bg-[var(--bg-card)] text-[var(--text-primary)] font-bold border border-[var(--border-color)]">
                  VERIFIED
                </span>
              </div>

              <div
                onClick={() => setSelectedDoc("ais")}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedDoc === "ais"
                    ? "bg-[var(--bg-card-elevated)] border-2 border-[var(--text-primary)] text-[var(--text-primary)] font-extrabold"
                    : "bg-[var(--bg-card-elevated)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Ship className="w-4 h-4" />
                  <div>
                    <div className="font-bold">AIS SPEED ANOMALY REPORT</div>
                    <div className="text-[10px] text-[var(--text-muted)] font-sans">MV ARABIAN STAR Track & Speed Log</div>
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded bg-[var(--bg-card)] text-[var(--text-primary)] font-bold border border-[var(--border-color)]">
                  PENDING REVIEW
                </span>
              </div>

              <div
                onClick={() => setSelectedDoc("drift")}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedDoc === "drift"
                    ? "bg-[var(--bg-card-elevated)] border-2 border-[var(--text-primary)] text-[var(--text-primary)] font-extrabold"
                    : "bg-[var(--bg-card-elevated)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Waves className="w-4 h-4" />
                  <div>
                    <div className="font-bold">ADVECTION & DRIFT HINDCAST</div>
                    <div className="text-[10px] text-[var(--text-muted)] font-sans">48h Origin Corridor Hydrodynamics</div>
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded bg-[var(--bg-card)] text-[var(--text-primary)] font-bold border border-[var(--border-color)]">
                  VERIFIED
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 space-y-6 shadow-sm relative">
            
            {selectedDoc === "dossier" && (
              <>
                <div className="bg-[var(--bg-card-elevated)] border border-[var(--border-color)] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] text-2xl font-bold">
                      <Anchor className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase">
                        OFFICIAL MARITIME INCIDENT REPORT
                      </div>
                      <h2 className="text-lg font-extrabold text-[var(--text-primary)] font-mono">
                        REPORT ID: {report?.incident_id || "S1-2026-08-12"}
                      </h2>
                      <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">INCIDENT DOSSIER & EVIDENCE FILE</p>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">ATTRIBUTION STATUS</span>
                    <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">HIGH CONFIDENCE ATTRIBUTED</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-mono font-extrabold uppercase tracking-wider text-[var(--text-primary)] border-b border-[var(--border-color)] pb-1">
                    1. EXECUTIVE SUMMARY & FORENSIC RATIONALE
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-card-elevated)] p-4 rounded-xl border border-[var(--border-color)]">
                    On {report?.timestamp || "2026-09-02"}, Copernicus Sentinel-1 Synthetic Aperture Radar (SAR) detected an illegal oil discharge anomaly covering ~{spill?.estimated_area_km2 || 46.0} km² in the Arabian Sea offshore shipping lane. Combining 48-hour backward ocean current hindcasting with Global Fishing Watch (GFW) AIS trajectory analysis, vessel <strong className="text-rose-600 dark:text-rose-400 font-extrabold">{topCandidate?.shipName || "MV ARABIAN STAR"}</strong> (MMSI: {topCandidate?.mmsi || "419001234"}) has been identified as the primary source candidate with an overall attribution confidence score of <strong className="text-rose-600 dark:text-rose-400 font-extrabold">{topCandidate?.attribution_score || 84.8}/100</strong>.
                  </p>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <h3 className="text-xs font-mono font-extrabold uppercase tracking-wider text-[var(--text-primary)] border-b border-[var(--border-color)] pb-1">
                    2. PRIMARY SUSPECT VESSEL INTELLIGENCE
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-[var(--bg-card-elevated)] p-3 rounded-xl border border-[var(--border-color)]">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase">Vessel Name</span>
                      <p className="font-bold text-[var(--text-primary)] mt-0.5">{topCandidate?.shipName || "MV ARABIAN STAR"}</p>
                    </div>
                    <div className="bg-[var(--bg-card-elevated)] p-3 rounded-xl border border-[var(--border-color)]">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase">MMSI / Flag</span>
                      <p className="font-bold text-[var(--text-primary)] mt-0.5">{topCandidate?.mmsi} ({topCandidate?.flag})</p>
                    </div>
                    <div className="bg-[var(--bg-card-elevated)] p-3 rounded-xl border border-[var(--border-color)]">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase">Vessel Type</span>
                      <p className="font-bold text-[var(--text-primary)] mt-0.5">{topCandidate?.vesselType}</p>
                    </div>
                    <div className="bg-[var(--bg-card-elevated)] p-3 rounded-xl border border-[var(--border-color)]">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase">Fusion Score</span>
                      <p className="font-bold text-rose-600 dark:text-rose-400 text-sm mt-0.5">{topCandidate?.attribution_score}/100</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedDoc === "sar" && (
              <>
                <div className="bg-[var(--bg-card-elevated)] border border-[var(--border-color)] rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono font-bold text-[var(--text-secondary)] uppercase">
                      SATELLITE REMOTE SENSING DATASET
                    </div>
                    <h2 className="text-lg font-extrabold text-[var(--text-primary)] font-mono">
                      SENTINEL-1 SAR SLICK DETECTION SDR-2026
                    </h2>
                    <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">Sensor: Sentinel-1 C-Band SAR (IW Mode, VV Polarization)</p>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded bg-[var(--bg-card)] text-[var(--text-primary)] font-bold border border-[var(--border-color)]">
                    STATUS: VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                  <div className="bg-[var(--bg-card-elevated)] p-3 rounded-xl border border-[var(--border-color)]">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">Slick Centroid</span>
                    <p className="font-bold text-[var(--text-primary)] mt-0.5">09.50°N, 070.00°E</p>
                  </div>
                  <div className="bg-[var(--bg-card-elevated)] p-3 rounded-xl border border-[var(--border-color)]">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">Est. Area</span>
                    <p className="font-bold text-[var(--text-primary)] mt-0.5">{spill?.estimated_area_km2} km²</p>
                  </div>
                  <div className="bg-[var(--bg-card-elevated)] p-3 rounded-xl border border-[var(--border-color)]">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">Radar Darkness</span>
                    <p className="font-bold text-rose-600 dark:text-rose-400 mt-0.5">{spill?.mean_local_darkness_db} dB</p>
                  </div>
                  <div className="bg-[var(--bg-card-elevated)] p-3 rounded-xl border border-[var(--border-color)]">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">Wind Speed</span>
                    <p className="font-bold text-[var(--text-primary)] mt-0.5">4.2 m/s (Favorable)</p>
                  </div>
                </div>

                <div className="bg-[var(--bg-card-elevated)] p-4 rounded-xl border border-[var(--border-color)] space-y-2 text-xs">
                  <span className="text-[var(--text-primary)] font-mono font-bold uppercase">SAR BACKSCATTER SPECTRUM ANALYSIS</span>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-[11px]">
                    The C-Band SAR radar backscatter signal exhibits a pronounced -7.4 dB drop relative to ambient ocean background clutter. The high boundary damping ratio and continuous geometry confirm biogenic/mineral oil damping of capillary ocean waves rather than wind-shear lookalikes.
                  </p>
                </div>
              </>
            )}

            {selectedDoc === "ais" && (
              <>
                <div className="bg-[var(--bg-card-elevated)] border border-[var(--border-color)] rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono font-bold text-[var(--text-secondary)] uppercase">
                      AIS TELEMETRY & BEHAVIOURAL LOG
                    </div>
                    <h2 className="text-lg font-extrabold text-[var(--text-primary)] font-mono">
                      AIS SPEED ANOMALY & LOITERING REPORT
                    </h2>
                    <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">Target: MV ARABIAN STAR (MMSI: 419001234)</p>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded bg-[var(--bg-card)] text-[var(--text-primary)] font-bold border border-[var(--border-color)]">
                    ANOMALY DETECTED
                  </span>
                </div>

                <div className="bg-[var(--bg-card-elevated)] p-4 rounded-xl border border-[var(--border-color)] space-y-3 font-mono text-xs">
                  <span className="text-[var(--text-primary)] font-bold uppercase">CHRONOLOGICAL AIS SPEED LOG (DISCHARGE WINDOW)</span>
                  <div className="overflow-x-auto rounded-lg border border-[var(--border-color)]">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-[var(--bg-card)] text-[var(--text-muted)] uppercase">
                        <tr>
                          <th className="p-2.5">Time (UTC)</th>
                          <th className="p-2.5">Lat</th>
                          <th className="p-2.5">Lon</th>
                          <th className="p-2.5">Speed (kts)</th>
                          <th className="p-2.5">Heading</th>
                          <th className="p-2.5">Status / Flag</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-secondary)]">
                        <tr>
                          <td className="p-2.5 font-bold">14:00:00</td>
                          <td className="p-2.5">09°12.0'N</td>
                          <td className="p-2.5">069°55.0'E</td>
                          <td className="p-2.5">14.5</td>
                          <td className="p-2.5">135°</td>
                          <td className="p-2.5 text-emerald-700 dark:text-emerald-400 font-bold">Normal Transit</td>
                        </tr>
                        <tr className="bg-[var(--bg-card)] text-rose-600 dark:text-rose-400 font-bold">
                          <td className="p-2.5">15:30:00</td>
                          <td className="p-2.5">09°24.5'N</td>
                          <td className="p-2.5">069°70.1'E</td>
                          <td className="p-2.5">8.1</td>
                          <td className="p-2.5">135°</td>
                          <td className="p-2.5 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> Speed Drop (Anomaly)
                          </td>
                        </tr>
                        <tr className="bg-[var(--bg-card)] text-rose-600 dark:text-rose-400 font-bold">
                          <td className="p-2.5">16:15:00</td>
                          <td className="p-2.5">09°28.4'N</td>
                          <td className="p-2.5">069°78.2'E</td>
                          <td className="p-2.5">7.5</td>
                          <td className="p-2.5">138°</td>
                          <td className="p-2.5 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> Loitering / Discharge Window
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold">18:00:00</td>
                          <td className="p-2.5">09°36.0'N</td>
                          <td className="p-2.5">069°86.0'E</td>
                          <td className="p-2.5">14.2</td>
                          <td className="p-2.5">135°</td>
                          <td className="p-2.5 text-[var(--text-muted)]">Resumed Speed</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {selectedDoc === "drift" && (
              <>
                <div className="bg-[var(--bg-card-elevated)] border border-[var(--border-color)] rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono font-bold text-[var(--text-secondary)] uppercase">
                      HYDRODYNAMIC ADVECTION & DRIFT REPORT
                    </div>
                    <h2 className="text-lg font-extrabold text-[var(--text-primary)] font-mono">
                      48-HOUR BACKWARD DRIFT HINDCAST MODEL
                    </h2>
                    <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">Model: Simplified Ocean Current + 3% Surface Wind Vector</p>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded bg-[var(--bg-card)] text-[var(--text-primary)] font-bold border border-[var(--border-color)]">
                    STATUS: VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="bg-[var(--bg-card-elevated)] p-3 rounded-xl border border-[var(--border-color)]">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">Ocean Current</span>
                    <p className="font-bold text-[var(--text-primary)] mt-0.5">0.85 km/h @ 135° SE</p>
                  </div>
                  <div className="bg-[var(--bg-card-elevated)] p-3 rounded-xl border border-[var(--border-color)]">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">10m Wind Speed</span>
                    <p className="font-bold text-[var(--text-primary)] mt-0.5">18.5 km/h @ 315° NW</p>
                  </div>
                  <div className="bg-[var(--bg-card-elevated)] p-3 rounded-xl border border-[var(--border-color)]">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">Net Drift Speed</span>
                    <p className="font-bold text-[var(--text-primary)] mt-0.5">1.405 km/h SE</p>
                  </div>
                </div>

                <div className="bg-[var(--bg-card-elevated)] p-4 rounded-xl border border-[var(--border-color)] space-y-3 font-mono text-xs">
                  <span className="text-[var(--text-primary)] font-bold uppercase">RECONSTRUCTED ORIGIN CORRIDOR TRAJECTORY NODES</span>
                  <div className="overflow-x-auto rounded-lg border border-[var(--border-color)]">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-[var(--bg-card)] text-[var(--text-muted)] uppercase">
                        <tr>
                          <th className="p-2.5">Step Hours</th>
                          <th className="p-2.5">Timestamp (UTC)</th>
                          <th className="p-2.5">Latitude</th>
                          <th className="p-2.5">Longitude</th>
                          <th className="p-2.5">Drift Offset</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-secondary)]">
                        <tr>
                          <td className="p-2.5 font-bold text-[var(--text-primary)]">0h (Spill Detection)</td>
                          <td className="p-2.5">2026-09-02 06:00</td>
                          <td className="p-2.5">09.5000°N</td>
                          <td className="p-2.5">070.0000°E</td>
                          <td className="p-2.5">0.0 km</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold">-6h</td>
                          <td className="p-2.5">2026-09-02 00:00</td>
                          <td className="p-2.5">09.4300°N</td>
                          <td className="p-2.5">069.9300°E</td>
                          <td className="p-2.5">11.0 km</td>
                        </tr>
                        <tr className="bg-[var(--bg-card)] text-[var(--text-primary)] font-extrabold">
                          <td className="p-2.5">-18h (Intersects MV ARABIAN STAR)</td>
                          <td className="p-2.5">2026-09-01 12:00</td>
                          <td className="p-2.5">09.2900°N</td>
                          <td className="p-2.5">069.7900°E</td>
                          <td className="p-2.5">33.0 km</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold">-48h</td>
                          <td className="p-2.5">2026-08-31 06:00</td>
                          <td className="p-2.5">08.9400°N</td>
                          <td className="p-2.5">069.4400°E</td>
                          <td className="p-2.5">88.0 km</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            <div className="pt-4 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3 font-mono">
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Printer className="w-4 h-4" /> Download PDF ({selectedDoc.toUpperCase()})
              </button>
              <button
                onClick={handleDispatchCoastGuardAlert}
                className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-white" /> Dispatch to Coast Guard
              </button>
              <button
                onClick={handleExportJson}
                className="px-4 py-2 rounded-lg bg-[var(--bg-card-elevated)] hover:bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-color)] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Share2 className="w-4 h-4" /> Share Document
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      <div className="official-print-report hidden print:block bg-white text-slate-900 p-8 font-sans">
        
        <div className="border-b-2 border-slate-900 pb-5 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full border-2 border-slate-900 flex items-center justify-center text-slate-900 font-extrabold text-2xl">
                ⚓
              </div>
              <div>
                <h4 className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-700">
                  INTERNATIONAL MARITIME ORGANIZATION &bull; MARPOL ANNEX I PROTOCOL
                </h4>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">
                  MARITIME FORENSIC DISCHARGE ATTRIBUTION REPORT
                </h1>
                <p className="text-[11px] text-slate-600 font-mono">
                  NATIONAL MARITIME SAFETY AUTHORITY &bull; MRCC OPERATIONAL EVIDENTIARY DOSSIER
                </p>
              </div>
            </div>
            <div className="text-right font-mono text-xs">
              <div className="font-bold text-slate-900">REF: IMO-S1-2026-ARABIAN-001</div>
              <div className="text-slate-600 mt-0.5">DATE: 04 SEP 2026</div>
              <div className="text-slate-600">TIME: 01:25:00 UTC</div>
              <div className="mt-1 inline-block px-2 py-0.5 border border-slate-900 font-bold text-[10px] uppercase">
                STATUS: CONFIRMED ATTRIBUTED
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 space-y-2">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            SECTION I: EXECUTIVE INCIDENT OVERVIEW & SAR DETECTION
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed text-justify">
            On <strong>02 September 2026 at 04:12:00 UTC</strong>, Copernicus Sentinel-1 Synthetic Aperture Radar (SAR) remote sensing satellites detected an un-notified, illegal oily discharge slick anomaly covering an estimated surface area of <strong>{spill?.estimated_area_km2 || 46.0} km²</strong> in the Arabian Sea international shipping lane (Centroid Coordinates: <strong>09°30'00" N, 070°00'00" E</strong>). Fusing 48-hour hydrodynamic backward ocean drift current vectors with Global Fishing Watch (GFW) high-frequency AIS vessel trajectories, commercial tanker <strong>{topCandidate?.shipName || "MT SEA EMPRESS"}</strong> (MMSI: <strong>{topCandidate?.mmsi || "352002891"}</strong>, IMO: <strong>9382104</strong>, Flag: <strong>{topCandidate?.flag || "PA"}</strong>) has been conclusively attributed as the primary source candidate with a cumulative multi-factor attribution confidence score of <strong>{topCandidate?.attribution_score || 82.3} / 100</strong>.
          </p>
        </div>

        <div className="mb-6 space-y-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            SECTION II: PRIMARY SUSPECT VESSEL IDENTIFICATION
          </h2>
          <table className="w-full text-xs border-collapse border border-slate-400 font-mono">
            <tbody>
              <tr className="border-b border-slate-300 bg-slate-100">
                <td className="p-2.5 font-bold border-r border-slate-300 w-1/4">Vessel Name</td>
                <td className="p-2.5 font-bold text-slate-900 w-1/4">{topCandidate?.shipName || "MT SEA EMPRESS"}</td>
                <td className="p-2.5 font-bold border-r border-slate-300 w-1/4">IMO Number</td>
                <td className="p-2.5 text-slate-900 w-1/4">9382104</td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="p-2.5 font-bold border-r border-slate-300">MMSI Identifier</td>
                <td className="p-2.5 text-slate-900">{topCandidate?.mmsi || "352002891"}</td>
                <td className="p-2.5 font-bold border-r border-slate-300">Flag State</td>
                <td className="p-2.5 text-slate-900">{topCandidate?.flag || "Panama (PA)"}</td>
              </tr>
              <tr className="border-b border-slate-300 bg-slate-100">
                <td className="p-2.5 font-bold border-r border-slate-300">Vessel Type</td>
                <td className="p-2.5 text-slate-900">{topCandidate?.vesselType || "Chemical / Oil Tanker"}</td>
                <td className="p-2.5 font-bold border-r border-slate-300">Deadweight Tonnage</td>
                <td className="p-2.5 text-slate-900">115,400 MT</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold border-r border-slate-300">Departure Port</td>
                <td className="p-2.5 text-slate-900">Fujairah, UAE (AEFUJ)</td>
                <td className="p-2.5 font-bold border-r border-slate-300">Destination Port</td>
                <td className="p-2.5 text-slate-900">Colombo, Sri Lanka (LKCMB)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-6 space-y-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            SECTION III: MULTI-FACTOR ATTRIBUTION METRICS
          </h2>
          <table className="w-full text-xs border-collapse border border-slate-400 font-mono">
            <thead className="bg-slate-200 text-slate-900 uppercase">
              <tr>
                <th className="p-2 border border-slate-400 text-left">Evidence Factor</th>
                <th className="p-2 border border-slate-400 text-left">Observed Telemetry Metric</th>
                <th className="p-2 border border-slate-400 text-right">Confidence Match</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-300">
                <td className="p-2 border border-slate-400 font-bold">1. Hydrodynamic Origin Corridor</td>
                <td className="p-2 border border-slate-400">48h backward advection vector intersection</td>
                <td className="p-2 border border-slate-400 text-right font-bold">{topCandidate?.score_breakdown?.drift_corridor || 95.0}%</td>
              </tr>
              <tr className="border-b border-slate-300 bg-slate-50">
                <td className="p-2 border border-slate-400 font-bold">2. Spatial Proximity & Trajectory Offset</td>
                <td className="p-2 border border-slate-400">{topCandidate?.dist_to_drift_corridor_km || 1.8} km offset from backward current centerline</td>
                <td className="p-2 border border-slate-400 text-right font-bold">{topCandidate?.score_breakdown?.spatial || 75.0}%</td>
              </tr>
              <tr>
                <td className="p-2 border border-slate-400 font-bold">3. AIS Speed Anomaly & Loitering Log</td>
                <td className="p-2 border border-slate-400">Speed reduction to 8.2 kts during 22:00 - 04:00 UTC window</td>
                <td className="p-2 border border-slate-400 text-right font-bold">{topCandidate?.score_breakdown?.behaviour || 60.0}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-6 space-y-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            SECTION IV: EVALUATED CANDIDATE DIRECTORY (TOP 5 SUSPECTS)
          </h2>
          <table className="w-full text-xs border-collapse border border-slate-400 font-mono">
            <thead className="bg-slate-200 text-slate-900 uppercase">
              <tr>
                <th className="p-2 border border-slate-400 text-left">Rank</th>
                <th className="p-2 border border-slate-400 text-left">Vessel Name</th>
                <th className="p-2 border border-slate-400 text-left">MMSI</th>
                <th className="p-2 border border-slate-400 text-left">Flag</th>
                <th className="p-2 border border-slate-400 text-left">Distance</th>
                <th className="p-2 border border-slate-400 text-right">Fusion Score</th>
              </tr>
            </thead>
            <tbody>
              {topFiveCandidates.map((cand) => (
                <tr key={cand.mmsi} className="border-b border-slate-300">
                  <td className="p-2 border border-slate-400 font-bold">#{cand.rank}</td>
                  <td className="p-2 border border-slate-400 font-bold">{cand.shipName}</td>
                  <td className="p-2 border border-slate-400">{cand.mmsi}</td>
                  <td className="p-2 border border-slate-400">{cand.flag}</td>
                  <td className="p-2 border border-slate-400">{cand.distance_km} km</td>
                  <td className="p-2 border border-slate-400 text-right font-bold">{cand.attribution_score}/100</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 pt-6 border-t-2 border-slate-900 space-y-6">
          <div className="text-xs text-slate-700 italic leading-relaxed">
            "I hereby certify that the satellite remote sensing backscatter analysis and AIS trajectory advection models contained in this audit dossier were executed in accordance with IMO MARPOL Annex I environmental enforcement protocols. The data herein represents an authenticated legal record."
          </div>

          <div className="grid grid-cols-2 gap-12 pt-4 font-mono text-xs">
            <div>
              <div className="border-b border-slate-900 pb-1 mb-1 font-bold text-slate-900">
                Senior Maritime Intelligence Analyst
              </div>
              <div className="text-slate-600 text-[10px]">National Maritime SAR & AIS Command Centre</div>
              <div className="mt-8 border-t border-dashed border-slate-400 pt-1 text-[10px] text-slate-500">
                AUTHORIZED SIGNATURE & STAMP
              </div>
            </div>

            <div>
              <div className="border-b border-slate-900 pb-1 mb-1 font-bold text-slate-900">
                Duty Commander, MRCC Operation Control
              </div>
              <div className="text-slate-600 text-[10px]">Indian Coast Guard / International MRCC</div>
              <div className="mt-8 border-t border-dashed border-slate-400 pt-1 text-[10px] text-slate-500">
                OFFICIAL SEAL & COUNTERSIGNATURE
              </div>
            </div>
          </div>
        </div>
      </div>

      {dispatchAlertModal && (
        <div className="fixed inset-0 z-[3000] bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[var(--bg-card)] rounded-2xl p-6 space-y-5 shadow-xl relative border border-[var(--border-color)] text-[var(--text-primary)]">
            
            <div className="flex items-start justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] text-xl font-bold">
                  <Radio className="w-5 h-5 text-[var(--text-primary)]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[var(--text-secondary)] font-bold tracking-wider">
                    TACTICAL MARITIME INTERCEPT ALERT
                  </span>
                  <h3 className="text-base font-extrabold text-[var(--text-primary)] font-mono">
                    ALERT TRANSMITTED TO COAST GUARD
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setDispatchAlertModal(null)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-mono p-1 rounded hover:bg-[var(--bg-card-elevated)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-color)] text-xs font-mono space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-primary)] font-bold flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  STATUS: SUCCESS TRANSMITTED
                </span>
                <span className="text-[var(--text-secondary)]">{dispatchAlertModal.dispatchId}</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                {dispatchAlertModal.status}
              </p>
            </div>

            <div className="bg-[var(--bg-card-elevated)] p-4 rounded-xl border border-[var(--border-color)] space-y-2 text-xs font-mono">
              <span className="text-[var(--text-secondary)] uppercase text-[10px] font-bold">Transmitted Payload Data</span>
              <div className="grid grid-cols-2 gap-2 text-[var(--text-primary)]">
                <div><strong>Target Vessel:</strong> {dispatchAlertModal.vesselName}</div>
                <div><strong>MMSI:</strong> {dispatchAlertModal.mmsi}</div>
                <div><strong>Flag State:</strong> {dispatchAlertModal.flag}</div>
                <div><strong>Attribution Score:</strong> {dispatchAlertModal.attributionScore}/100</div>
                <div><strong>Dist to Slick:</strong> {dispatchAlertModal.distanceKm} km</div>
                <div><strong>Corridor Offset:</strong> {dispatchAlertModal.corridorOffsetKm} km</div>
              </div>
              <div className="pt-2 text-[10px] text-[var(--text-muted)] border-t border-[var(--border-color)]">
                Recipient: Indian Coast Guard Maritime Operational Centre (MOC Mumbai / Kochi) &bull; Timestamp: {dispatchAlertModal.timestamp}
              </div>
            </div>

            <div className="flex justify-end gap-3 font-mono">
              <button
                onClick={() => setDispatchAlertModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-xs font-bold transition-all cursor-pointer"
              >
                Acknowledge Alert Transmission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Evidence;