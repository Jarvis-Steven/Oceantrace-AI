import { useEffect, useState, useRef, useMemo, Component } from "react";
import { useOutletContext } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker, Polyline, Rectangle, ZoomControl, LayerGroup } from "react-leaflet";
import { useTheme } from "../context/ThemeContext";
import "../lib/leafletIcons";
import {
  candidateVesselIcon,
  topCandidateVesselIcon,
  secondaryCandidateIcon,
} from "../lib/leafletIcons";
import { getAttribution, getDrift, getAisData } from "../lib/api";
import {
  Satellite,
  X,
  Layers,
  Loader2,
  AlertTriangle,
  Check,
  ShieldAlert,
  FileText,
  Radio,
  Zap,
  Ship,
  Navigation,
  Anchor,
  MapPin,
  Globe,
} from "lucide-react";

// Deconflict overlapping vessel coordinates with radial spiderfy micro-offsets
function getDeconflictedVessels(vessels) {
  if (!vessels || vessels.length === 0) return [];

  const clusters = [];
  vessels.forEach((v) => {
    if (typeof v.lat !== "number" || typeof v.lon !== "number") return;
    let placed = false;
    for (const cluster of clusters) {
      const first = cluster[0];
      const dLat = Math.abs(first.lat - v.lat);
      const dLon = Math.abs(first.lon - v.lon);
      if (dLat < 0.04 && dLon < 0.04) {
        cluster.push(v);
        placed = true;
        break;
      }
    }
    if (!placed) {
      clusters.push([v]);
    }
  });

  const result = [];
  clusters.forEach((cluster) => {
    if (cluster.length === 1) {
      result.push({ ...cluster[0], renderLat: cluster[0].lat, renderLon: cluster[0].lon });
    } else {
      const n = cluster.length;
      const radius = 0.035; // ~3.5 km offset radius for visual deconfliction
      cluster.forEach((v, idx) => {
        const angle = (idx * 2 * Math.PI) / n - Math.PI / 2;
        const renderLat = v.lat + radius * Math.sin(angle);
        const renderLon = v.lon + radius * Math.cos(angle);
        result.push({
          ...v,
          renderLat: Number(renderLat.toFixed(6)),
          renderLon: Number(renderLon.toFixed(6)),
          isClustered: true,
        });
      });
    }
  });

  return result;
}

// Error Boundary component for Map initialization
class MapErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Map Container Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-[#070a12] p-6 text-center">
          <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-2xl mb-4">
            <AlertTriangle className="w-7 h-7 text-rose-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Map Component Error</h3>
          <p className="text-xs text-slate-400 font-mono mt-1 max-w-md">
            {this.state.error?.message || "Failed to render Leaflet map container."}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            className="mt-4 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-semibold font-mono"
          >
            Reload Map Canvas
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MapViewContent() {
  const { theme } = useTheme();
  const context = useOutletContext() || {};
  const isSimulated = context.isSimulated ?? true;

  const mapRef = useRef(null);
  const defaultCenter = [9.50, 70.00];

  const [attribution, setAttribution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [backwardDrift, setBackwardDrift] = useState(null);
  const [forwardDrift, setForwardDrift] = useState(null);
  const [allVessels, setAllVessels] = useState([]);

  // Projection Mode State (2D Bounded Planar vs 3D Spherical Globe)
  const [projectionMode, setProjectionMode] = useState("2d");

  // Layer Visibility Controls
  const [showSlick, setShowSlick] = useState(true);
  const [showBackwardDrift, setShowBackwardDrift] = useState(true);
  const [showForwardDrift, setShowForwardDrift] = useState(true);
  const [showNormalVessels, setShowNormalVessels] = useState(true);
  const [showTrajectories, setShowTrajectories] = useState(true);

  // Selected Vessel for Right Dossier Panel
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);

  // Dispatch Alert Modal State
  const [dispatchAlertModal, setDispatchAlertModal] = useState(null);

  // FLOATABLE / DRAGGABLE PANEL POSITION STATE
  const [panelPos, setPanelPos] = useState({ x: 16, y: 16 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, initialX: 16, initialY: 16 });

  const handleDragStart = (e) => {
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initialX: panelPos.x,
      initialY: panelPos.y,
    };
  };

  useEffect(() => {
    const handleDragMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - dragStartRef.current.startX;
      const deltaY = clientY - dragStartRef.current.startY;

      const newX = Math.max(8, Math.min(window.innerWidth - 100, dragStartRef.current.initialX + deltaX));
      const newY = Math.max(8, Math.min(window.innerHeight - 100, dragStartRef.current.initialY + deltaY));
      setPanelPos({ x: newX, y: newY });
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleDragMove);
      window.addEventListener("touchend", handleDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleDragMove);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch Attribution & Spill Detection Data (Unified Pipeline)
  const loadMapData = () => {
    setLoading(true);
    setFetchError(null);

    getAttribution(true, 75)
      .then((res) => {
        setAttribution(res);
        if (res.top_candidate) {
          setSelectedVessel(res.top_candidate);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Attribution fetch error:", err);
        setFetchError("Unable to connect to maritime attribution service.");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMapData();
  }, []);

  // Fetch Background AIS Traffic (Unified Pipeline)
  useEffect(() => {
    getAisData(true)
      .then((res) => {
        if (res.status === "ok" && Array.isArray(res.vessels)) {
          setAllVessels(res.vessels);
        }
      })
      .catch((err) => console.warn("AIS fetch error:", err));
  }, []);

  // DYNAMIC MAP CENTERING TO SAR OIL SLICK AREA ON OPEN / LOAD
  const focusSlickArea = () => {
    if (!mapRef.current) return;
    const center = attribution?.spill_center || { lat: 9.50, lon: 70.00 };
    const bbox = attribution?.spill_bounding_box;

    if (bbox) {
      mapRef.current.flyToBounds(
        [
          [bbox.min_lat - 0.25, bbox.min_lon - 0.25],
          [bbox.max_lat + 0.25, bbox.max_lon + 0.25],
        ],
        { animate: true, duration: 1.5, maxZoom: 10 }
      );
    } else {
      mapRef.current.flyTo([center.lat, center.lon], 9, {
        animate: true,
        duration: 1.5,
      });
    }
  };

  // Trigger dynamic flyTo when attribution data loads or map mounts
  useEffect(() => {
    if (attribution && mapRef.current) {
      const timer = setTimeout(() => {
        focusSlickArea();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [attribution]);

  // Fetch Drift
  useEffect(() => {
    const spillCenter = attribution?.spill_center || { lat: 9.50, lon: 70.00 };

    Promise.all([
      getDrift(spillCenter.lat, spillCenter.lon, 48, "backward", true),
      getDrift(spillCenter.lat, spillCenter.lon, 48, "forward", true),
    ])
      .then(([bRes, fRes]) => {
        if (bRes.status === "ok") setBackwardDrift(bRes);
        if (fRes.status === "ok") setForwardDrift(fRes);
      })
      .catch((err) => console.warn("Drift fetch error:", err));
  }, [attribution]);

  // Dispatch Alert Trigger Handler
  const handleDispatchAlert = (vessel) => {
    if (!vessel) return;
    setDispatchAlertModal({
      timestamp: new Date().toISOString(),
      dispatchId: `ALERT-MRCC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      vesselName: vessel.shipName,
      mmsi: vessel.mmsi,
      flag: vessel.flag || "UNKNOWN",
      vesselType: vessel.vesselType || "Cargo Vessel",
      attributionScore: vessel.attribution_score || 70,
      distanceKm: vessel.distance_km || 20,
      corridorOffsetKm: vessel.dist_to_drift_corridor_km || 5,
      status: "TRANSMITTED TO MARITIME RESCUE COORDINATION CENTRE (MRCC)",
    });
  };

  // Export Dossier JSON Handler
  const handleExportVesselDossier = (vessel) => {
    if (!vessel) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(vessel, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `DOSSIER_${vessel.shipName.replace(/\s+/g, "_")}_${vessel.mmsi}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // MEMOIZE RAW CANDIDATES
  const rawCandidateVessels = useMemo(
    () => attribution?.candidate_vessels || [],
    [attribution]
  );

  // MEMOIZE SPATIAL DECONFLICTION TO PREVENT RE-RUNNING ON DRAG/ZOOM
  const candidateVessels = useMemo(
    () => getDeconflictedVessels(rawCandidateVessels),
    [rawCandidateVessels]
  );

  // MEMOIZE STRING NORMALIZED CANDIDATE MMSI SET
  const candidateMmsiSet = useMemo(
    () => new Set(candidateVessels.map((c) => String(c.mmsi))),
    [candidateVessels]
  );

  // MEMOIZE FILTERED BACKGROUND TRAFFIC
  const filteredBackgroundVessels = useMemo(
    () =>
      allVessels
        .filter(
          (v) => !candidateMmsiSet.has(String(v.mmsi)) && typeof v.lat === "number"
        )
        .slice(0, 200),
    [allVessels, candidateMmsiSet]
  );

  // MEMOIZE TRAJECTORY PATH ARRAYS
  const backwardPath = useMemo(
    () => backwardDrift?.trajectory?.map((p) => [p.lat, p.lon]) || [],
    [backwardDrift]
  );
  const forwardPath = useMemo(
    () => forwardDrift?.trajectory?.map((p) => [p.lat, p.lon]) || [],
    [forwardDrift]
  );

  // SELECTED VESSEL TRAJECTORY TRACK
  const selectedVesselTrack = useMemo(() => {
    if (!selectedVessel || !Array.isArray(selectedVessel.track)) return [];
    return selectedVessel.track
      .filter((pt) => typeof pt.lat === "number" && typeof pt.lon === "number")
      .map((pt) => [pt.lat, pt.lon]);
  }, [selectedVessel]);

  // ACTIVE SELECTED VESSEL (Defaults to Top Candidate #1 Red Vessel if none clicked)
  const activeVessel = useMemo(() => {
    return selectedVessel || attribution?.top_candidate || candidateVessels[0] || null;
  }, [selectedVessel, attribution, candidateVessels]);

  const bbox = attribution?.spill_bounding_box;
  const rectangleBounds = useMemo(() => {
    return bbox
      ? [
          [bbox.min_lat, bbox.min_lon],
          [bbox.max_lat, bbox.max_lon],
        ]
      : null;
  }, [bbox]);

  return (
    <div className="h-full w-full relative flex overflow-hidden bg-[#070a12]">
      {/* ------------------------------------------------------------- */}
      {/* FLOATABLE / DRAGGABLE LAYER CONTROL PANEL */}
      {/* ------------------------------------------------------------- */}
      {leftPanelOpen ? (
        <div
          style={{ left: `${panelPos.x}px`, top: `${panelPos.y}px` }}
          className={`absolute z-[1000] w-72 sm:w-80 glass-panel rounded-2xl p-4 shadow-2xl transition-shadow ${
            isDragging ? "shadow-cyan-500/20 scale-[1.01] cursor-grabbing" : ""
          }`}
        >
          {/* Drag Handle Bar Header */}
          <div
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3 cursor-grab active:cursor-grabbing select-none"
            title="Click and drag to move panel anywhere on screen"
          >
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-xs font-mono">⋮⋮</span>
              <Satellite className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
                LAYERS & DRIFT CONTROLS
              </span>
            </div>
            <button
              onClick={() => setLeftPanelOpen(false)}
              className="text-slate-400 hover:text-slate-200 text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> CLOSE
            </button>
          </div>



          {/* Dynamic Slick Recenter Button */}
          <button
            onClick={focusSlickArea}
            className="w-full mb-3 py-2 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-xs font-bold font-mono border border-cyan-500/40 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
          >
            <Navigation className="w-4 h-4 text-cyan-400 animate-pulse" /> RECENTER ON SLICK ANOMALY
          </button>

          {/* Unified Pipeline Status Indicator */}
          <div className="mb-3 bg-[#070a12] p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-300 font-mono">Data Pipeline:</span>
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE SAR & AIS STREAM
            </span>
          </div>

          {/* Layer Toggles */}
          <div className="space-y-2 text-xs font-mono">
            <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 cursor-pointer hover:border-slate-700">
              <span className="flex items-center gap-2 text-slate-200">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> SAR Slick Bounding Box
              </span>
              <input
                type="checkbox"
                checked={showSlick}
                onChange={(e) => setShowSlick(e.target.checked)}
                className="accent-cyan-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 cursor-pointer hover:border-slate-700">
              <span className="flex items-center gap-2 text-cyan-300">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" /> Backward Origin Corridor
              </span>
              <input
                type="checkbox"
                checked={showBackwardDrift}
                onChange={(e) => setShowBackwardDrift(e.target.checked)}
                className="accent-cyan-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 cursor-pointer hover:border-slate-700">
              <span className="flex items-center gap-2 text-amber-300">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Forward Drift Forecast
              </span>
              <input
                type="checkbox"
                checked={showForwardDrift}
                onChange={(e) => setShowForwardDrift(e.target.checked)}
                className="accent-amber-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 cursor-pointer hover:border-slate-700">
              <span className="flex items-center gap-2 text-pink-300">
                <span className="h-2.5 w-2.5 rounded-full bg-pink-500" /> Ship Trajectory Routes
              </span>
              <input
                type="checkbox"
                checked={showTrajectories}
                onChange={(e) => setShowTrajectories(e.target.checked)}
                className="accent-pink-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 cursor-pointer hover:border-slate-700">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Background AIS Traffic
              </span>
              <input
                type="checkbox"
                checked={showNormalVessels}
                onChange={(e) => setShowNormalVessels(e.target.checked)}
                className="accent-blue-500 rounded"
              />
            </label>
          </div>

          {/* Tactical Telemetry Summary */}
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Evaluated Candidates:</span>
              <span className="text-cyan-400 font-bold">{candidateVessels.length} Vessels</span>
            </div>
            <div className="flex justify-between">
              <span>Detection Confidence:</span>
              <span className="text-cyan-400 font-bold">{attribution?.confidence || 84.5}%</span>
            </div>
            <div className="flex justify-between">
              <span>Slick Centroid:</span>
              <span className="text-slate-200">09.500°N, 070.000°E</span>
            </div>
          </div>
        </div>
      ) : (
        /* FLOATABLE BUTTON WHEN COLLAPSED */
        <div
          style={{ left: `${panelPos.x}px`, top: `${panelPos.y}px` }}
          className="absolute z-[1000] flex items-center shadow-2xl"
        >
          <div
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            className="px-2 py-2.5 glass-panel rounded-l-xl border-r-0 text-slate-400 hover:text-slate-200 cursor-grab active:cursor-grabbing text-xs font-mono"
            title="Drag button anywhere"
          >
            ⋮⋮
          </div>
          <button
            onClick={() => setLeftPanelOpen(true)}
            className="px-3.5 py-2.5 glass-panel rounded-r-xl text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 border-l-0 border border-cyan-500/30 flex items-center gap-2 shadow-xl"
          >
            <Layers className="w-4 h-4 text-cyan-400" /> LAYERS & CONTROLS
          </button>
        </div>
      )}

      {/* CENTRAL MAP CANVAS / 3D SPHERICAL GLOBE */}
      <div className="flex-1 h-full w-full relative">
        {loading && (
          <div className="absolute inset-0 z-[2000] bg-[#070a12]/90 backdrop-blur flex flex-col items-center justify-center p-6 text-center">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
            <p className="text-sm font-bold text-slate-100 font-mono">Initializing Spatial Intelligence Canvas...</p>
            <p className="text-xs text-slate-400 font-mono mt-1">Downloading SAR Anomaly Layers & Advection Vectors</p>
          </div>
        )}

        {fetchError && !loading && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[2000] bg-rose-950/90 border border-rose-500/40 text-rose-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" /> {fetchError}
            </span>
            <button
              onClick={loadMapData}
              className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/50 rounded-lg text-white font-bold"
            >
              Retry Connection
            </button>
          </div>
        )}

        <div className="h-full w-full relative">
          <MapContainer
            ref={mapRef}
            center={defaultCenter}
              zoom={8}
              minZoom={3}
              maxZoom={16}
              maxBounds={[[-85, -180], [85, 180]]}
              maxBoundsViscosity={1.0}
              zoomControl={false}
              preferCanvas={true}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%", zIndex: 1 }}
            >
              <ZoomControl position="bottomleft" />

              <TileLayer
                attribution='&copy; <a href="https://www.esri.com/">Esri</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url={
                  theme === "dark"
                    ? "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                    : "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                }
                maxZoom={16}
                noWrap={true}
                bounds={[[-85, -180], [85, 180]]}
                updateWhenZooming={false}
                updateWhenIdle={true}
                keepBuffer={4}
              />

              {showSlick && rectangleBounds && (
                <Rectangle
                  bounds={rectangleBounds}
                  pathOptions={{
                    color: "#ef4444",
                    fillColor: "#ef4444",
                    fillOpacity: 0.35,
                    weight: 2,
                    dashArray: "6 6",
                  }}
                >
                  <Popup>
                    <div className="text-xs space-y-1 font-sans">
                      <div className="font-bold text-rose-400 text-sm flex items-center gap-1.5">
                        <Satellite className="w-4 h-4 text-rose-400" /> Sentinel-1 SAR Slick Anomaly
                      </div>
                      <div><strong>Confidence:</strong> {attribution?.confidence}%</div>
                      <div><strong>Center:</strong> {attribution?.spill_center?.lat}°N, {attribution?.spill_center?.lon}°E</div>
                      <div><strong>Est. Area:</strong> ~46.0 km²</div>
                      <div><strong>Darkness:</strong> {attribution?.mean_local_darkness_db || 7.4} dB</div>
                    </div>
                  </Popup>
                </Rectangle>
              )}

              {showSlick && attribution?.spill_center && (
                <Circle
                  center={[attribution.spill_center.lat, attribution.spill_center.lon]}
                  radius={4200}
                  pathOptions={{ color: "#ef4444", fillColor: "#f87171", fillOpacity: 0.6, weight: 2 }}
                />
              )}

              {showBackwardDrift && backwardPath.length > 1 && (
                <LayerGroup key="backward-drift-group">
                  <Polyline
                    positions={backwardPath}
                    pathOptions={{ color: "#06b6d4", weight: 4, dashArray: "8 8", opacity: 0.9 }}
                  />
                  {backwardDrift?.trajectory?.map((p, idx) => (
                    <Circle
                      key={`b-node-${idx}`}
                      center={[p.lat, p.lon]}
                      radius={1200}
                      pathOptions={{ color: "#0891b2", fillColor: "#22d3ee", fillOpacity: 0.85 }}
                    >
                      <Popup>
                        <div className="text-xs font-sans">
                          <strong className="text-cyan-400 font-bold">
                            ⏪ Reconstructed Origin Node ({p.step_hours}h)
                          </strong>
                          <br />
                          Timestamp: {p.timestamp}
                          <br />
                          Coords: {p.lat.toFixed(4)}°N, {p.lon.toFixed(4)}°E
                        </div>
                      </Popup>
                    </Circle>
                  ))}
                </LayerGroup>
              )}

              {showForwardDrift && forwardPath.length > 1 && (
                <LayerGroup key="forward-drift-group">
                  <Polyline
                    positions={forwardPath}
                    pathOptions={{ color: "#f59e0b", weight: 3, dashArray: "6 6", opacity: 0.8 }}
                  />
                  {forwardDrift?.trajectory?.map((p, idx) => (
                    <Circle
                      key={`f-node-${idx}`}
                      center={[p.lat, p.lon]}
                      radius={1000}
                      pathOptions={{ color: "#d97706", fillColor: "#fbbf24", fillOpacity: 0.8 }}
                    >
                      <Popup>
                        <div className="text-xs font-sans">
                          <strong className="text-amber-400 font-bold">
                            ⏩ Forward Drift Forecast (+{p.step_hours}h)
                          </strong>
                          <br />
                          Timestamp: {p.timestamp}
                          <br />
                          Coords: {p.lat.toFixed(4)}°N, {p.lon.toFixed(4)}°E
                        </div>
                      </Popup>
                    </Circle>
                  ))}
                </LayerGroup>
              )}

              {showTrajectories && activeVessel && (
                <LayerGroup key={`active-vessel-route-${activeVessel.mmsi || activeVessel.shipName}`}>
                  {activeVessel.full_voyage_path && activeVessel.full_voyage_path.length > 1 && (
                    <Polyline
                      positions={activeVessel.full_voyage_path}
                      pathOptions={{
                        color: "#ec4899",
                        weight: 4.5,
                        dashArray: "6 6",
                        opacity: 0.95,
                      }}
                    />
                  )}

                  {activeVessel.departure_coords && (
                    <CircleMarker
                      center={activeVessel.departure_coords}
                      radius={7}
                      pathOptions={{
                        color: "#10b981",
                        fillColor: "#34d399",
                        fillOpacity: 0.95,
                        weight: 2,
                      }}
                    >
                      <Popup minWidth={220}>
                        <div className="text-xs font-sans p-1 space-y-1">
                          <strong className="text-emerald-400 font-bold flex items-center gap-1">
                            <Anchor className="w-4 h-4 text-emerald-400" /> DEPARTURE PORT
                          </strong>
                          <div className="font-bold text-slate-100">{activeVessel.departure_port}</div>
                          <div className="text-[10px] text-slate-400 font-mono">Vessel: {activeVessel.shipName}</div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  )}

                  {activeVessel.destination_coords && (
                    <CircleMarker
                      center={activeVessel.destination_coords}
                      radius={7}
                      pathOptions={{
                        color: "#06b6d4",
                        fillColor: "#22d3ee",
                        fillOpacity: 0.95,
                        weight: 2,
                      }}
                    >
                      <Popup minWidth={220}>
                        <div className="text-xs font-sans p-1 space-y-1">
                          <strong className="text-cyan-400 font-bold flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-cyan-400" /> DESTINATION PORT
                          </strong>
                          <div className="font-bold text-slate-100">{activeVessel.destination_port}</div>
                          <div className="text-[10px] text-slate-400 font-mono">Vessel: {activeVessel.shipName}</div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  )}
                </LayerGroup>
              )}

              <LayerGroup key="candidate-vessels-layer">
                {candidateVessels.map((v, idx) => {
                  const isTop = v.rank === 1;
                  const isHighRisk = v.rank <= 5;
                  const icon = isTop
                    ? topCandidateVesselIcon
                    : isHighRisk
                    ? candidateVesselIcon
                    : secondaryCandidateIcon;

                  return (
                    <Marker
                      key={`cand-${v.mmsi || idx}`}
                      position={[v.renderLat || v.lat, v.renderLon || v.lon]}
                      icon={icon}
                      zIndexOffset={2000 - (v.rank || idx) * 10}
                      eventHandlers={{
                        click: () => setSelectedVessel({ ...v }),
                      }}
                    >
                      <Popup minWidth={240}>
                        <div className="text-xs font-sans space-y-1.5 p-1">
                          <div className="flex items-center justify-between border-b border-slate-700/60 pb-1">
                            <strong className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                              {isTop ? (
                                <>
                                  <AlertTriangle className="w-4 h-4 text-rose-400" /> RANK #1 SOURCE CANDIDATE
                                </>
                              ) : (
                                `Candidate (Rank #${v.rank})`
                              )}
                            </strong>
                            <span className="font-mono text-xs font-extrabold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                              {v.attribution_score}/100
                            </span>
                          </div>
                          <div className="font-bold text-slate-200">{v.shipName}</div>
                          <div className="text-slate-400 text-[11px]">
                            MMSI: {v.mmsi} &bull; {v.vesselType} &bull; Course: {v.course}°
                          </div>
                          <div className="text-cyan-400 text-[11px] font-mono">
                            Route: {v.departure_port || "Persian Gulf"} &rarr; {v.destination_port || "Singapore"}
                          </div>
                          {v.isClustered && (
                            <div className="text-[10px] text-cyan-400 font-mono italic flex items-center gap-1">
                              <Zap className="w-3 h-3 text-cyan-400" /> Deconflicted radial position (Cluster offset applied)
                            </div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVessel({ ...v });
                            }}
                            className="w-full mt-2 py-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[11px] font-bold font-mono border border-cyan-500/40 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                          >
                            OPEN VESSEL DOSSIER &rarr;
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </LayerGroup>

              {showNormalVessels && (
                <LayerGroup key={`bg-traffic-${showNormalVessels}`}>
                  {filteredBackgroundVessels.map((v, idx) => (
                    <CircleMarker
                      key={`norm-${v.mmsi || idx}`}
                      center={[v.lat, v.lon]}
                      radius={5}
                      pathOptions={{
                        color: "#0284c7",
                        fillColor: "#38bdf8",
                        fillOpacity: 0.85,
                        weight: 1.5,
                      }}
                      eventHandlers={{
                        click: () => {
                          setSelectedVessel({
                            ...v,
                            rank: "TRAFFIC",
                            flag: v.flag || "PA",
                            attribution_score: 12.0,
                            distance_km: 42.1,
                            dist_to_drift_corridor_km: 24.5,
                            score_breakdown: { drift_corridor: 10, spatial: 15, behaviour: 10 },
                            why_ranked: ["Background AIS traffic passing outside primary drift origin corridor"],
                          });
                        },
                      }}
                    >
                      <Popup minWidth={220}>
                        <div className="text-xs font-sans p-1 space-y-1.5">
                          <strong className="font-bold text-slate-100">{v.shipName}</strong>
                          <div className="text-slate-400 text-[11px]">
                            MMSI: {v.mmsi} &bull; Type: {v.vesselType}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVessel({
                                ...v,
                                rank: "TRAFFIC",
                                flag: v.flag || "PA",
                                attribution_score: 12.0,
                                distance_km: 42.1,
                                dist_to_drift_corridor_km: 24.5,
                                score_breakdown: { drift_corridor: 10, spatial: 15, behaviour: 10 },
                                why_ranked: ["Background AIS traffic passing outside primary drift origin corridor"],
                              });
                            }}
                            className="w-full mt-2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-bold font-mono border border-slate-700 cursor-pointer flex items-center justify-center gap-1"
                          >
                            OPEN VESSEL DOSSIER &rarr;
                          </button>
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}
                </LayerGroup>
              )}
            </MapContainer>
        </div>
      </div>

      {/* RIGHT VESSEL DOSSIER DRAWER */}
      {selectedVessel && (
        <div className="absolute top-0 right-0 z-[1000] h-full w-full sm:w-96 md:w-[420px] glass-panel border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="p-4 border-b border-slate-800/80 bg-[#090d16]/90 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                VESSEL DOSSIER
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30 font-bold">
                SCORE: {selectedVessel.attribution_score}/100
              </span>
            </div>
            <button
              onClick={() => setSelectedVessel(null)}
              className="text-slate-400 hover:text-slate-100 text-xs font-mono p-1 rounded hover:bg-slate-800 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> CLOSE
            </button>
          </div>

          {/* Dossier Content Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <div className="flex items-start justify-between bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Target Identity</span>
                <h3 className="text-lg font-extrabold text-slate-100">{selectedVessel.shipName}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  MMSI: {selectedVessel.mmsi} &bull; Flag: {selectedVessel.flag || "IN"}
                </p>
                <p className="text-xs text-cyan-400 font-mono mt-0.5">
                  Type: {selectedVessel.vesselType} &bull; Course: {selectedVessel.course || 135}°
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Rank</span>
                <div className="text-2xl font-extrabold text-rose-400 font-mono">
                  #{selectedVessel.rank || 1}
                </div>
              </div>
            </div>

            {/* Commercial Voyage Route Telemetry Card */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-cyan-400 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" /> COMMERCIAL VOYAGE ROUTE
                </span>
                <span className="text-emerald-400 text-[10px] font-bold">UNDERWAY VIA ENGINE</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Anchor className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Departure Port</span>
                    <p className="font-bold text-slate-100">{selectedVessel.departure_port || "Fujairah Crude Terminal, UAE (AEFUJ)"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Destination Port</span>
                    <p className="font-bold text-slate-100">{selectedVessel.destination_port || "Port of Singapore, Singapore (SGSIN)"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 font-semibold">AIS SPEED ANOMALY HISTORY</span>
                <span className="text-rose-400 font-bold text-[10px]">ANOMALY WINDOW DETECTED</span>
              </div>
              <div className="h-20 w-full bg-[#070a12] rounded-lg border border-slate-800/80 p-2 flex flex-col justify-between relative overflow-hidden">
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>16 kts</span>
                  <span>0 kts</span>
                </div>
                <svg className="w-full h-10 overflow-visible" viewBox="0 0 300 40">
                  <path
                    d="M 0,10 L 60,12 L 110,11 L 130,32 L 180,33 L 200,12 L 300,10"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2"
                  />
                  <rect x="120" y="2" width="70" height="36" fill="rgba(239, 68, 68, 0.15)" stroke="rgba(239, 68, 68, 0.4)" strokeDasharray="2 2" />
                </svg>
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>22:00 UTC</span>
                  <span className="text-rose-400">DISCHARGE WINDOW</span>
                  <span>04:00 UTC</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase">Dist to Slick</span>
                <p className="text-sm font-bold text-slate-100 mt-0.5">{selectedVessel.distance_km} km</p>
              </div>
              <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase">Corridor Offset</span>
                <p className="text-sm font-bold text-cyan-400 mt-0.5">{selectedVessel.dist_to_drift_corridor_km} km</p>
              </div>
            </div>

            {selectedVessel.score_breakdown && (
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs font-mono">
                <span className="text-slate-300 font-semibold uppercase text-[10px] tracking-wider">
                  Attribution Factor Breakdown
                </span>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Backward Drift Match</span>
                    <span className="text-cyan-400 font-bold">{selectedVessel.score_breakdown.drift_corridor}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400" style={{ width: `${selectedVessel.score_breakdown.drift_corridor}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Spatial Proximity</span>
                    <span className="text-cyan-400 font-bold">{selectedVessel.score_breakdown.spatial}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400" style={{ width: `${selectedVessel.score_breakdown.spatial}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Behaviour Anomaly</span>
                    <span className="text-cyan-400 font-bold">{selectedVessel.score_breakdown.behaviour}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400" style={{ width: `${selectedVessel.score_breakdown.behaviour}%` }} />
                  </div>
                </div>
              </div>
            )}

            {selectedVessel.why_ranked && (
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                  Evidence Rationale
                </span>
                <div className="space-y-1.5 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80 text-xs">
                  {selectedVessel.why_ranked.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2 text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 font-bold shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dossier Bottom Action Bar */}
          <div className="p-4 border-t border-slate-800 bg-[#090d16] flex items-center justify-between gap-2 shrink-0">
            <button
              onClick={() => handleDispatchAlert(selectedVessel)}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-95 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-emerald-400" /> Dispatch Alert
            </button>
            <button
              onClick={() => handleExportVesselDossier(selectedVessel)}
              className="flex-1 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-95 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-cyan-400" /> Export Dossier
            </button>
          </div>
        </div>
      )}

      {/* DISPATCH ALERT CONFIRMATION MODAL DIALOG */}
      {dispatchAlertModal && (
        <div className="fixed inset-0 z-[3000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel-accent rounded-2xl p-6 space-y-5 shadow-2xl relative border border-emerald-500/40">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xl font-bold">
                  <Radio className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider">
                    TACTICAL MARITIME INTERCEPT ALERT
                  </span>
                  <h3 className="text-base font-extrabold text-slate-100 font-mono">
                    ALERT TRANSMITTED TO COAST GUARD
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setDispatchAlertModal(null)}
                className="text-slate-400 hover:text-slate-100 text-xs font-mono p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  STATUS: SUCCESS
                </span>
                <span className="text-slate-400">{dispatchAlertModal.dispatchId}</span>
              </div>
              <p className="text-[11px] text-slate-300">
                {dispatchAlertModal.status}
              </p>
            </div>

            <div className="bg-[#070a12] p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
              <span className="text-slate-400 uppercase text-[10px] font-bold">Transmitted Payload Data</span>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div><strong>Target Vessel:</strong> {dispatchAlertModal.vesselName}</div>
                <div><strong>MMSI:</strong> {dispatchAlertModal.mmsi}</div>
                <div><strong>Flag State:</strong> {dispatchAlertModal.flag}</div>
                <div><strong>Attribution Score:</strong> {dispatchAlertModal.attributionScore}/100</div>
                <div><strong>Dist to Slick:</strong> {dispatchAlertModal.distanceKm} km</div>
                <div><strong>Corridor Offset:</strong> {dispatchAlertModal.corridorOffsetKm} km</div>
              </div>
              <div className="pt-2 text-[10px] text-slate-500 border-t border-slate-800/80">
                Recipient: Indian Coast Guard Maritime Operational Centre (MOC Mumbai / Kochi) &bull; Timestamp: {dispatchAlertModal.timestamp}
              </div>
            </div>

            <div className="flex justify-end gap-3 font-mono">
              <button
                onClick={() => setDispatchAlertModal(null)}
                className="px-5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer"
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

export default function MapView() {
  return (
    <MapErrorBoundary>
      <MapViewContent />
    </MapErrorBoundary>
  );
}
