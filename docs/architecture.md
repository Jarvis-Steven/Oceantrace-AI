# System Architecture — Oceantrace-AI

## Overview

Oceantrace-AI is built on a decoupled, service-oriented architecture:

```text
                       OCEANTRACE-AI FRONTEND
                   (React 19, Vite, Tailwind CSS 4, Leaflet)
                                    │
                                    ▼  REST API (JSON)
                       FASTAPI BACKEND ROUTER
                                    │
    ┌────────────────┬──────────────┼──────────────┬────────────────┐
    │                │              │              │                │
    ▼                ▼              ▼              ▼                ▼
Spill Detection   AIS Service  Drift Engine   Attribution   Evidence Service
 (Sentinel-1 VV)   (GFW Track)  (Open-Meteo)   (Fusion Engine) (Case Builder)
```

## Core Backend Services

1. **`spill_detection.py`**:
   - Downloads Sentinel-1 SAR VV backscatter via Sentinel Hub / Copernicus Data Space.
   - Calculates decibel backscatter ($dB = 10 \cdot \log_{10}(linear)$).
   - Computes local block background medians and local darkness ($darkness = background - backscatter$).
   - Connected-component analysis isolates candidate slick regions.
   - Calculates centroid, bounding box, area ($\text{km}^2$), and artifact plausibility.

2. **`ais.py`**:
   - Queries vessel activity within the canonical Arabian Sea bounding box `[68.5, 8.0, 71.5, 11.0]`.
   - Normalizes external data into internal vessel schema (`shipName`, `mmsi`, `vesselType`, `flag`, `lat`, `lon`, `speed`, `course`, `timestamp`).

3. **`drift.py`**:
   - Hydrodynamic advection engine combining ocean current velocity ($v_{current}$) and surface wind vector ($v_{wind}$).
   - Supports both forward forecast and **backward hindcasting** ($v = -1 \cdot (v_{current} + 3\% v_{wind})$).

4. **`attribution.py`**:
   - Multi-factor evidence fusion model combining spatial distance, temporal alignment, drift corridor offset, vessel heading, and behavioural anomalies.
   - Returns sorted candidate list with per-factor score breakdown and explainable rationale.

5. **`evidence.py`**:
   - Case consolidation service assembling the complete evidence report for presentation in the UI or export as JSON/PDF.
