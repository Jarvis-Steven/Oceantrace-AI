import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { checkHealth, getEvidence } from "../lib/api";
import { Droplets, Target, Fuel, Map, FileText, Ship, TrendingUp, AlertTriangle } from "lucide-react";

function MetricCard({ title, value, change, subtitle, icon: IconComponent }) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-md p-5 flex flex-col justify-between hover:border-[var(--border-subtle)] transition-colors shadow-sm relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-medium">{title}</span>
        <div className="h-8 w-8 rounded border border-[var(--border-color)] bg-[var(--bg-card-elevated)] flex items-center justify-center text-[var(--text-primary)]">
          <IconComponent className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] font-mono tracking-tight">{value}</div>
        <div className="flex items-center gap-2 mt-2 text-xs font-mono">
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> {change}
          </span>
          <span className="text-[var(--text-secondary)]">• {subtitle}</span>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const context = useOutletContext() || {};
  const isSimulated = context.isSimulated ?? true;
  const [evidenceData, setEvidenceData] = useState(null);
  const [loadingEvidence, setLoadingEvidence] = useState(true);

  useEffect(() => {
    checkHealth().catch(() => {});
    setLoadingEvidence(true);
    getEvidence(isSimulated)
      .then((res) => {
        setEvidenceData(res);
        setLoadingEvidence(false);
      })
      .catch(() => setLoadingEvidence(false));
  }, [isSimulated]);

  const spill = evidenceData?.spill;
  const topCandidate = evidenceData?.attribution?.top_candidate;
  const candidates = evidenceData?.attribution?.candidate_vessels || [];
  const topFiveCandidates = candidates.slice(0, 5);

  return (
    <div className="h-full w-full overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-[var(--bg-main)] text-[var(--text-primary)] font-sans">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono text-xs text-[var(--text-secondary)] font-semibold tracking-wider uppercase">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            MARITIME INCIDENT COMMAND CENTER
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
            SAR Discharge Attribution Summary
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono mt-1">
            Arabian Sea Sector &bull; Active Pipeline (Sentinel-1 SAR + AIS Stream) &bull; Verified Incident Telemetry
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/map"
            className="px-4 py-2.5 rounded bg-[var(--bg-card)] hover:bg-[var(--bg-card-elevated)] text-[var(--text-primary)] border border-[var(--border-color)] text-xs font-mono font-bold transition-colors flex items-center gap-2"
          >
            <Map className="w-4 h-4" /> INVESTIGATION MAP &rarr;
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <MetricCard
          title="Detected SAR Anomalies"
          value="1,248"
          change="+12.4%"
          subtitle="Past 30 Days"
          icon={Droplets}
        />
        <MetricCard
          title="Attributed Sources"
          value="842"
          change="+8.7%"
          subtitle="67.5% Attribution Rate"
          icon={Target}
        />
        <MetricCard
          title="Estimated Oil Volume"
          value="24.37M bbl"
          change="+15.3%"
          subtitle="Cumulative Volume"
          icon={Fuel}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-md p-6 flex flex-col justify-between space-y-6 shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <h2 className="text-sm font-bold text-[var(--text-primary)] font-mono tracking-wider uppercase">
                  ACTIVE SAR DISCHARGE ANOMALY
                </h2>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-[var(--bg-card-elevated)] text-rose-600 dark:text-rose-400 border border-[var(--border-color)] font-bold">
                {spill?.confidence || 84.5}% CONFIDENCE
              </span>
            </div>

            {loadingEvidence ? (
              <div className="py-10 text-center font-mono text-xs text-[var(--text-secondary)]">
                Loading Sentinel-1 SAR anomaly metrics...
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4 font-mono">
                  <div className="bg-[var(--bg-card-elevated)] p-4 rounded border border-[var(--border-color)]">
                    <span className="text-[11px] text-[var(--text-secondary)] uppercase font-medium">Estimated Area</span>
                    <p className="text-xl font-bold text-[var(--text-primary)] mt-1">{spill?.estimated_area_km2 || 46.0} km²</p>
                  </div>
                  <div className="bg-[var(--bg-card-elevated)] p-4 rounded border border-[var(--border-color)]">
                    <span className="text-[11px] text-[var(--text-secondary)] uppercase font-medium">Local Darkness</span>
                    <p className="text-xl font-bold text-[var(--text-primary)] mt-1">{spill?.mean_local_darkness_db || 7.4} dB</p>
                  </div>
                  <div className="bg-[var(--bg-card-elevated)] p-4 rounded border border-[var(--border-color)] col-span-2">
                    <span className="text-[11px] text-[var(--text-secondary)] uppercase font-medium">Slick Centroid Coordinates</span>
                    <p className="text-sm font-bold text-[var(--text-primary)] mt-1 font-mono">
                      {spill?.spill_center?.lat || 9.5}°N, {spill?.spill_center?.lon || 70.0}°E &bull; Arabian Sea Corridor
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between font-mono text-xs text-[var(--text-secondary)]">
            <span>Sensor: Sentinel-1 IW VV</span>
            <Link to="/map" className="text-[var(--text-primary)] hover:underline font-semibold flex items-center gap-1">
              View Trajectory &rarr;
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-md p-6 flex flex-col justify-between space-y-6 shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-5">
              <span className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider">
                PRIME ATTRIBUTED CANDIDATE
              </span>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-[var(--bg-card-elevated)] text-[var(--text-primary)] border border-[var(--border-color)] font-bold">
                RANK #1 CANDIDATE
              </span>
            </div>

            {loadingEvidence ? (
              <div className="py-10 text-center font-mono text-xs text-[var(--text-secondary)]">
                Fusing candidate attribution scores...
              </div>
            ) : topCandidate ? (
              <div className="space-y-4 font-mono">
                <div className="flex items-center justify-between bg-[var(--bg-card-elevated)] p-4 rounded border border-[var(--border-color)]">
                  <div>
                    <h3 className="text-xl font-extrabold text-[var(--text-primary)]">{topCandidate.shipName}</h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      MMSI: {topCandidate.mmsi} &bull; Flag: {topCandidate.flag} &bull; {topCandidate.vesselType}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[var(--text-secondary)] uppercase font-medium">ATTRIBUTION SCORE</span>
                    <p className="text-3xl font-extrabold text-[var(--text-primary)] mt-0.5">{topCandidate.attribution_score}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="bg-[var(--bg-card-elevated)] p-3 rounded border border-[var(--border-color)]">
                    <span className="text-[10px] text-[var(--text-secondary)] uppercase">Corridor Match</span>
                    <p className="text-sm font-bold text-[var(--text-primary)] mt-1">{topCandidate.score_breakdown?.drift_corridor}%</p>
                  </div>
                  <div className="bg-[var(--bg-card-elevated)] p-3 rounded border border-[var(--border-color)]">
                    <span className="text-[10px] text-[var(--text-secondary)] uppercase">Spatial Proximity</span>
                    <p className="text-sm font-bold text-[var(--text-primary)] mt-1">{topCandidate.score_breakdown?.spatial}%</p>
                  </div>
                  <div className="bg-[var(--bg-card-elevated)] p-3 rounded border border-[var(--border-color)]">
                    <span className="text-[10px] text-[var(--text-secondary)] uppercase">Speed Anomaly</span>
                    <p className="text-sm font-bold text-[var(--text-primary)] mt-1">{topCandidate.score_breakdown?.behaviour}%</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between font-mono text-xs text-[var(--text-secondary)]">
            <span>Decision Support Dossier</span>
            <Link to="/evidence" className="text-[var(--text-primary)] hover:underline font-semibold flex items-center gap-1">
              <FileText className="w-4 h-4" /> Open Full Dossier &rarr;
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-md p-6 space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center gap-2.5 font-mono">
            <Ship className="w-5 h-5 text-[var(--text-primary)]" />
            <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
              CANDIDATE VESSELS ({topFiveCandidates.length} EVALUATED)
            </h2>
          </div>
          <Link to="/map" className="text-xs font-mono text-[var(--text-primary)] hover:underline font-semibold">
            View All Vessels on Map &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto rounded border border-[var(--border-color)]">
          <table className="w-full text-xs text-left font-mono">
            <thead className="bg-[var(--bg-card-elevated)] text-[var(--text-secondary)] uppercase border-b border-[var(--border-color)]">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Vessel Name</th>
                <th className="p-3">MMSI</th>
                <th className="p-3">Vessel Type</th>
                <th className="p-3">Flag</th>
                <th className="p-3">Distance to Slick</th>
                <th className="p-3 text-right">Attribution Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-primary)]">
              {topFiveCandidates.map((cand) => (
                <tr key={cand.mmsi} className="hover:bg-[var(--bg-card-elevated)] transition-colors">
                  <td className="p-3 font-bold">
                    {cand.rank === 1 ? (
                      <span className="text-[var(--text-primary)] bg-[var(--bg-card-elevated)] px-2 py-0.5 rounded border border-[var(--border-color)] font-bold">
                        #1 RANK
                      </span>
                    ) : (
                      `#${cand.rank}`
                    )}
                  </td>
                  <td className="p-3 font-bold">{cand.shipName}</td>
                  <td className="p-3 text-[var(--text-secondary)]">{cand.mmsi}</td>
                  <td className="p-3 text-[var(--text-primary)]">{cand.vesselType}</td>
                  <td className="p-3">{cand.flag}</td>
                  <td className="p-3">{cand.distance_km} km</td>
                  <td className="p-3 text-right font-extrabold text-[var(--text-primary)] text-sm">
                    {cand.attribution_score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;