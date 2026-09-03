const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function get(path) {
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${errText || res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`API call failed for ${path}:`, error);
    throw error;
  }
}

export const checkHealth = () => get("/health");

export const getEvidence = (simulate = false) =>
  get(`/api/evidence${simulate ? "?simulate=true" : ""}`);

export const getSpillDetection = (simulate = false) =>
  get(`/api/spill-detection${simulate ? "?simulate=true" : ""}`);

export const getAttribution = (simulate = false, radiusKm = 75) =>
  get(`/api/attribution?radius_km=${radiusKm}${simulate ? "&simulate=true" : ""}`);

export const getDrift = (lat, lon, hours = 48, direction = "forward", simulate = false) => {
  let query = `/api/drift?hours=${hours}&direction=${direction}${simulate ? "&simulate=true" : ""}`;
  if (lat !== undefined && lon !== undefined && lat !== null && lon !== null) {
    query += `&lat=${lat}&lon=${lon}`;
  }
  return get(query);
};

export const getAisData = (simulate = false) =>
  get(`/api/ais${simulate ? "?simulate=true" : ""}`);
