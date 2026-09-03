import L from "leaflet";

// Fix standard Leaflet default icon asset resolution in Vite
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Standard background vessel marker (cyan/blue)
export const normalVesselIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [22, 36],
  iconAnchor: [11, 36],
  popupAnchor: [1, -30],
  shadowSize: [36, 36],
});

// Primary candidate vessel marker (gold/amber)
export const candidateVesselIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [26, 42],
  iconAnchor: [13, 42],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Top-ranked candidate vessel marker (red warning)
export const topCandidateVesselIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [30, 48],
  iconAnchor: [15, 48],
  popupAnchor: [1, -38],
  shadowSize: [45, 45],
});

// Secondary candidate vessel marker (orange)
export const secondaryCandidateIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [24, 38],
  iconAnchor: [12, 38],
  popupAnchor: [1, -32],
  shadowSize: [38, 38],
});

export const warningIcon = topCandidateVesselIcon;