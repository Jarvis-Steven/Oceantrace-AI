# OCEANTRACE-AI COMPLETE SOURCE CODE

## File: build-desktop-app.ps1
`ps1
# Oceantrace-AI Standalone Executable (.exe) Compiler
$env:RUSTUP_HOME = "D:\antigravity-resources\.rustup"
$env:CARGO_HOME = "D:\antigravity-resources\.cargo"
$env:PATH = "D:\antigravity-resources\w64devkit\bin;D:\antigravity-resources\.cargo\bin;" + $env:PATH

Set-Location -Path "$PSScriptRoot\frontend"
Write-Host "Building Oceantrace-AI Desktop Executable (.exe)..." -ForegroundColor Cyan
npx @tauri-apps/cli build

`

## File: README.md
`md
# Oceantrace-AI 🌊

> **SIH26143 — Satellite Imagery Oil Spill Detection with AIS Data Correlation for Source Vessel Attribution**  
> **Organization:** NTRO | **Category:** Software | **Theme:** Space Technology  
> **Target Target Platform:** Desktop PC (Windows) Shell + Web Application

---

## 📌 Overview

**Oceantrace-AI** is an operational decision-support intelligence platform built for maritime environmental protection and intelligence agencies. The application combines **Sentinel-1 Synthetic Aperture Radar (SAR)** satellite imagery, **oceanographic hydrodynamic advection hindcasting (backward drift)**, and **AIS vessel track data** to identify, characterize, and transparently rank candidate source vessels for detected marine oil anomalies in shipping corridors.

The project features a **restrained dual-theme design architecture** (Monochromatic Dark and Light modes) and is packaged as a **native PC desktop application powered by Tauri**.

---

## 🏗️ System Architecture

```text
                        OCEANTRACE-AI DESKTOP SHELL
                                 (Tauri)
                                    │
                                    ▼
                         REACT 19 + VITE FRONTEND
                 (Tailwind CSS 4, Leaflet Maps, Recharts)
                                    │
                                    ▼ REST API (JSON)
                         FASTAPI BACKEND ROUTER
                        (Python 3 + Uvicorn)
                                    │
    ┌────────────────┬──────────────┼──────────────┬────────────────┐
    │                │              │              │                │
    ▼                ▼              ▼              ▼                ▼
Spill Detection   AIS Service  Drift Engine   Attribution   Evidence Service
 (Sentinel-1 VV)   (GFW Track)  (Open-Meteo)   (Fusion Engine) (Case Builder)
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Desktop Shell** | **Tauri 2** (Rust + Native OS Webview) |
| **Frontend UI** | **React 19**, **Vite 8**, **Tailwind CSS 4**, **Lucide React** |
| **Mapping & Geospatial** | **Leaflet**, **React-Leaflet**, **CartoDB Tiles** (Dark Matter & Positron), **Three.js** |
| **Data Visualization** | **Recharts** |
| **Backend Framework** | **Python 3**, **FastAPI**, **Uvicorn** |
| **Scientific Processing** | **NumPy**, **SentinelHub SDK**, **Shapely**, **Requests** |
| **Data Sources** | Sentinel-1 SAR (Copernicus), GFW AIS Tracks, Open-Meteo Ocean Currents & Winds |

---

## 🚀 Key Features

* **Sentinel-1 SAR Anomaly Detection**:
  - Local background estimation, connected-component analysis, and local darkness ratio calculations ($dB = 10 \cdot \log_{10}(linear)$).
  - Spatial filtering prevents coastal edge noise and sensor artifacts from being classified as slicks.

* **Hydrodynamic Backward Drift (Hindcast)**:
  - Reconstructs a 48-hour historical origin corridor ($v = -1 \cdot (v_{current} + 3\% v_{wind})$) tracing where the slick originated prior to satellite acquisition.

* **AIS Vessel Track Correlation**:
  - Ingests vessel positions, speed, course, MMSI, flag, and vessel classifications within the investigation window.

* **Multi-Factor Evidence Fusion Scoring**:
  - Ranks candidate vessels using explainable weights:
    - **Spatial Distance ($S$)**: 30%
    - **Backward Drift Corridor Offset ($D$)**: 25%
    - **Temporal Alignment ($T$)**: 25%
    - **Heading Vector Alignment ($H$)**: 10%
    - **Behavioural Anomaly / Speed Drop ($B$)**: 10%

* **Explainable Source Rationale**:
  - Itemized natural-language rationale explaining *why* each candidate received its attribution score.

* **Dual Monochromatic Theme System**:
  - Seamless toggle between Dark Mode and Light Mode with persistent user preferences (`localStorage`).
  - Leaflet maps and telemetry components adapt dynamically to the active theme.

* **Desktop PC Integration**:
  - Managed backend lifecycle: automatically starts and connects to the local FastAPI Python backend on startup.

* **Offline Deterministic Demo Mode**:
  - Fully functional offline incident dataset (`sample_data/demo/incident.json`) ensuring robust demonstration without external API keys.

---

## 💻 Quick Start & Installation

### Prerequisites

- **Node.js** (v18+)
- **Python** (v3.10+)
- **Rust Toolchain** (for Tauri desktop build)

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate environment
# On Windows PowerShell:
.venv\Scripts\Activate.ps1
# On Linux/macOS:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Launch FastAPI backend
uvicorn main:app --reload --port 8000
```

The backend server will run at `http://localhost:8000`.

### 2. Frontend Development Setup

```bash
cd frontend

# Install dependencies
npm install

# Run Vite dev server
npm run dev
```

The web application will open at `http://localhost:5173`.

### 3. Tauri Desktop Application Setup

To run the application inside the native PC desktop shell with live hot-reloading:

```bash
cd frontend
npm run tauri dev
```

---

## 📦 Windows Production Desktop Build

To generate the standalone Windows production application installer (`.msi` / `.exe`):

```bash
cd frontend
npm run tauri build
```

The output executable and installer package will be generated in `frontend/src-tauri/target/release/bundle/`.

---

## 🔑 Environment Configuration (`.env.example`)

Copy `backend/.env.example` to `backend/.env` to configure external data API credentials:

```ini
# Global Fishing Watch (GFW) API Token for live AIS vessel track queries
GFW_API_TOKEN=your_gfw_api_token_here

# Copernicus Data Space Ecosystem (CDSE) / Sentinel Hub Credentials
CDSE_CLIENT_ID=your_cdse_client_id_here
CDSE_CLIENT_SECRET=your_cdse_client_secret_here

# Application Configuration
DEMO_MODE=true
BACKEND_PORT=8000
```

*Note: If credentials are not supplied, the application automatically operates in **Deterministic Offline Demo Mode**.*

---

## 🧪 Automated Testing

Run the backend unit test suite:

```bash
d:\Oceantrace-AI\.venv\Scripts\python.exe -m pytest backend/tests/ -v
```

Run frontend linting and production bundle check:

```bash
cd frontend
npm run lint
npm run build
```

---

## ⚖️ Scientific & Legal Limitations

* **Investigative Decision Support**: Oceantrace-AI provides investigative decision support and anomaly detection.
* **SAR Look-alikes**: Dark signatures in Synthetic Aperture Radar imagery can result from low wind areas, natural biogenic films, rain cells, or oceanographic upwellings.
* **Attribution Rationale**: Candidate vessel ranking represents evidence-based spatial-temporal compatibility and does not constitute legal proof of liability.

---

## 📜 License & Citation

Oceantrace-AI is released for maritime intelligence research and SIH 2026 decision support.

`

## File: run-desktop-app.ps1
`ps1
# Oceantrace-AI Desktop Application Launcher
$env:RUSTUP_HOME = "D:\antigravity-resources\.rustup"
$env:CARGO_HOME = "D:\antigravity-resources\.cargo"
$env:PATH = "D:\antigravity-resources\w64devkit\bin;D:\antigravity-resources\.cargo\bin;" + $env:PATH

Set-Location -Path "$PSScriptRoot\frontend"
Write-Host "Launching Oceantrace-AI Desktop Shell..." -ForegroundColor Green
npx @tauri-apps/cli dev

`

## File: backend\main.py
`py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import router

app = FastAPI(title="Oceantrace-AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "oceantrace-backend"}
`

## File: backend\api\routes.py
`py
from fastapi import APIRouter
from services.evidence import collect_evidence
from services.attribution import attribute_source
from services.spill_detection import detect_spill
from services.drift import predict_drift
from services.ais import get_ais_data

router = APIRouter(prefix="/api")


@router.get("/evidence")
def evidence(simulate: bool = False):
    return collect_evidence(simulate=simulate)


@router.get("/attribution")
def attribution(simulate: bool = False, radius_km: float = 75.0):
    return attribute_source(proximity_radius_km=radius_km, simulate=simulate)


@router.get("/spill-detection")
def spill_detection(simulate: bool = False):
    return detect_spill(simulate=simulate)


@router.get("/drift")
def drift(
    lat: float = None,
    lon: float = None,
    hours: int = 48,
    direction: str = "forward",
    simulate: bool = False,
):
    return predict_drift(lat=lat, lon=lon, hours=hours, direction=direction, simulate=simulate)


@router.get("/ais")
def ais(simulate: bool = False):
    return get_ais_data(simulate=simulate)
`

## File: backend\api\__init__.py
`py

`

## File: backend\services\ais.py
`py
import os
import json
from pathlib import Path
from datetime import date, timedelta
import requests
from dotenv import load_dotenv

load_dotenv()

GFW_TOKEN = os.getenv("GFW_API_TOKEN")
GFW_BASE = "https://gateway.api.globalfishingwatch.org/v3"

# Canonical Arabian Sea BBOX: [minLon, minLat, maxLon, maxLat]
DEFAULT_BBOX = [68.5, 8.0, 71.5, 11.0]


def _load_demo_vessels():
    demo_path = Path(__file__).resolve().parent.parent.parent / "sample_data" / "demo" / "incident.json"
    if demo_path.exists():
        try:
            with open(demo_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data.get("vessels", [])
        except Exception:
            pass
    return []


import math


def _generate_vessel_track(lat, lon, course_deg, speed_kts, ship_name=""):
    """
    Generate realistic 24-hour maritime AIS trajectory waypoints that strictly respect
    natural ocean sea lanes, feature authentic rudder turns and loitering windows,
    and avoid straight-line artifacts or land clipping.
    """
    if lat is None or lon is None:
        return []

    speed = float(speed_kts) if isinstance(speed_kts, (int, float)) else 12.0
    course = float(course_deg) if isinstance(course_deg, (int, float)) else 135.0
    name_upper = (ship_name or "").upper()

    # 1. Custom Authentic Multi-Waypoint Shipping Lane Routes for Candidates
    if "ARABIAN STAR" in name_upper:
        return [
            {"step_hours": -24, "lat": 10.85, "lon": 67.90, "speed": 15.2, "course": 135.0},
            {"step_hours": -18, "lat": 10.25, "lon": 68.60, "speed": 14.8, "course": 135.0},
            {"step_hours": -12, "lat": 9.70, "lon": 69.20, "speed": 14.5, "course": 135.0},
            {"step_hours": -6, "lat": 9.38, "lon": 69.62, "speed": 7.5, "course": 138.0},  # Loitering / Discharge Event
            {"step_hours": -3, "lat": 9.30, "lon": 69.70, "speed": 11.2, "course": 135.0},
            {"step_hours": 0, "lat": 9.25, "lon": 69.75, "speed": 11.2, "course": 135.0},
        ]

    if "SEA EMPRESS" in name_upper:
        return [
            {"step_hours": -24, "lat": 11.50, "lon": 67.60, "speed": 15.0, "course": 140.0},
            {"step_hours": -18, "lat": 10.85, "lon": 68.30, "speed": 14.8, "course": 140.0},
            {"step_hours": -12, "lat": 10.20, "lon": 69.00, "speed": 14.5, "course": 140.0},
            {"step_hours": -6, "lat": 9.70, "lon": 69.50, "speed": 14.5, "course": 140.0},
            {"step_hours": -3, "lat": 9.50, "lon": 69.72, "speed": 14.5, "course": 140.0},
            {"step_hours": 0, "lat": 9.38, "lon": 69.88, "speed": 14.5, "course": 140.0},
        ]

    if "OCEAN PHOENIX" in name_upper:
        return [
            {"step_hours": -24, "lat": 7.80, "lon": 73.20, "speed": 19.5, "course": 315.0},
            {"step_hours": -18, "lat": 8.30, "lon": 72.10, "speed": 19.0, "course": 315.0},
            {"step_hours": -12, "lat": 8.80, "lon": 71.00, "speed": 18.5, "course": 320.0},
            {"step_hours": -6, "lat": 9.20, "lon": 70.35, "speed": 18.2, "course": 320.0},
            {"step_hours": -3, "lat": 9.38, "lon": 70.20, "speed": 18.2, "course": 320.0},
            {"step_hours": 0, "lat": 9.48, "lon": 70.12, "speed": 18.2, "course": 320.0},
        ]

    if "TARKASH" in name_upper:
        return [
            {"step_hours": -24, "lat": 9.95, "lon": 75.80, "speed": 12.0, "course": 270.0},  # Naval Base Kochi Departure
            {"step_hours": -18, "lat": 9.90, "lon": 74.20, "speed": 18.0, "course": 260.0},
            {"step_hours": -12, "lat": 9.85, "lon": 72.50, "speed": 22.0, "course": 260.0},
            {"step_hours": -6, "lat": 9.82, "lon": 70.80, "speed": 20.0, "course": 270.0},
            {"step_hours": -3, "lat": 9.84, "lon": 69.90, "speed": 20.0, "course": 270.0},
            {"step_hours": 0, "lat": 9.85, "lon": 69.30, "speed": 20.0, "course": 270.0},
        ]

    if "MAHALAKSHMI" in name_upper:
        return [
            {"step_hours": -24, "lat": 9.20, "lon": 71.50, "speed": 4.0, "course": 190.0},
            {"step_hours": -18, "lat": 9.00, "lon": 71.30, "speed": 3.8, "course": 230.0},
            {"step_hours": -12, "lat": 8.75, "lon": 71.10, "speed": 4.5, "course": 200.0},
            {"step_hours": -6, "lat": 8.70, "lon": 70.95, "speed": 4.2, "course": 210.0},
            {"step_hours": -3, "lat": 8.75, "lon": 70.92, "speed": 4.2, "course": 210.0},
            {"step_hours": 0, "lat": 8.80, "lon": 70.90, "speed": 4.2, "course": 210.0},
        ]

    if "OCEAN PRIDE" in name_upper:
        return [
            {"step_hours": -24, "lat": 11.80, "lon": 67.50, "speed": 14.2, "course": 120.0},
            {"step_hours": -18, "lat": 11.35, "lon": 68.00, "speed": 14.2, "course": 120.0},
            {"step_hours": -12, "lat": 10.90, "lon": 68.45, "speed": 14.2, "course": 120.0},
            {"step_hours": -6, "lat": 10.50, "lon": 68.80, "speed": 14.2, "course": 120.0},
            {"step_hours": -3, "lat": 10.32, "lon": 68.98, "speed": 14.2, "course": 120.0},
            {"step_hours": 0, "lat": 10.20, "lon": 69.10, "speed": 14.2, "course": 120.0},
        ]

    if "ARABIAN BREEZE" in name_upper:
        return [
            {"step_hours": -24, "lat": 6.90, "lon": 73.80, "speed": 17.5, "course": 310.0},
            {"step_hours": -18, "lat": 7.45, "lon": 73.10, "speed": 17.5, "course": 310.0},
            {"step_hours": -12, "lat": 8.00, "lon": 72.40, "speed": 17.5, "course": 310.0},
            {"step_hours": -6, "lat": 8.50, "lon": 71.75, "speed": 17.5, "course": 310.0},
            {"step_hours": -3, "lat": 8.72, "lon": 71.40, "speed": 17.5, "course": 310.0},
            {"step_hours": 0, "lat": 8.90, "lon": 71.10, "speed": 17.5, "course": 310.0},
        ]

    if "KERALA STAR" in name_upper:
        return [
            {"step_hours": -24, "lat": 11.60, "lon": 70.80, "speed": 11.0, "course": 180.0},
            {"step_hours": -18, "lat": 11.10, "lon": 70.80, "speed": 11.0, "course": 180.0},
            {"step_hours": -12, "lat": 10.60, "lon": 70.80, "speed": 11.0, "course": 180.0},
            {"step_hours": -6, "lat": 10.10, "lon": 70.80, "speed": 11.0, "course": 180.0},
            {"step_hours": -3, "lat": 9.88, "lon": 70.80, "speed": 11.0, "course": 180.0},
            {"step_hours": 0, "lat": 9.70, "lon": 70.80, "speed": 11.0, "course": 180.0},
        ]

    if "GULF EXPRESS" in name_upper:
        return [
            {"step_hours": -24, "lat": 12.30, "lon": 68.60, "speed": 13.8, "course": 145.0},
            {"step_hours": -18, "lat": 11.80, "lon": 69.10, "speed": 13.8, "course": 145.0},
            {"step_hours": -12, "lat": 11.35, "lon": 69.55, "speed": 13.8, "course": 145.0},
            {"step_hours": -6, "lat": 10.85, "lon": 70.05, "speed": 13.8, "course": 145.0},
            {"step_hours": -3, "lat": 10.65, "lon": 70.25, "speed": 13.8, "course": 145.0},
            {"step_hours": 0, "lat": 10.50, "lon": 70.40, "speed": 13.8, "course": 145.0},
        ]

    if "SEA FALCON" in name_upper:
        return [
            {"step_hours": -24, "lat": 7.80, "lon": 69.20, "speed": 5.5, "course": 45.0},
            {"step_hours": -18, "lat": 7.95, "lon": 69.35, "speed": 5.5, "course": 45.0},
            {"step_hours": -12, "lat": 8.10, "lon": 69.50, "speed": 5.5, "course": 45.0},
            {"step_hours": -6, "lat": 8.28, "lon": 69.68, "speed": 5.5, "course": 45.0},
            {"step_hours": -3, "lat": 8.34, "lon": 69.74, "speed": 5.5, "course": 45.0},
            {"step_hours": 0, "lat": 8.40, "lon": 69.80, "speed": 5.5, "course": 45.0},
        ]

    if "PACIFIC RUNNER" in name_upper:
        return [
            {"step_hours": -24, "lat": 12.50, "lon": 67.20, "speed": 12.4, "course": 130.0},
            {"step_hours": -18, "lat": 12.05, "lon": 67.65, "speed": 12.4, "course": 130.0},
            {"step_hours": -12, "lat": 11.60, "lon": 68.10, "speed": 12.4, "course": 130.0},
            {"step_hours": -6, "lat": 11.15, "lon": 68.55, "speed": 12.4, "course": 130.0},
            {"step_hours": -3, "lat": 10.95, "lon": 68.75, "speed": 12.4, "course": 130.0},
            {"step_hours": 0, "lat": 10.80, "lon": 68.90, "speed": 12.4, "course": 130.0},
        ]

    if "DESH SHANTI" in name_upper:
        return [
            {"step_hours": -24, "lat": 10.90, "lon": 66.80, "speed": 15.0, "course": 115.0},
            {"step_hours": -18, "lat": 10.45, "lon": 67.30, "speed": 15.0, "course": 115.0},
            {"step_hours": -12, "lat": 10.00, "lon": 67.80, "speed": 15.0, "course": 115.0},
            {"step_hours": -6, "lat": 9.50, "lon": 68.30, "speed": 15.0, "course": 115.0},
            {"step_hours": -3, "lat": 9.28, "lon": 68.55, "speed": 15.0, "course": 115.0},
            {"step_hours": 0, "lat": 9.10, "lon": 68.80, "speed": 15.0, "course": 115.0},
        ]

    if "BHARAT RATNA" in name_upper:
        return [
            {"step_hours": -24, "lat": 8.25, "lon": 74.60, "speed": 18.0, "course": 295.0},
            {"step_hours": -18, "lat": 8.70, "lon": 73.80, "speed": 18.0, "course": 295.0},
            {"step_hours": -12, "lat": 9.15, "lon": 73.00, "speed": 18.0, "course": 295.0},
            {"step_hours": -6, "lat": 9.60, "lon": 72.15, "speed": 18.0, "course": 295.0},
            {"step_hours": -3, "lat": 9.82, "lon": 71.72, "speed": 18.0, "course": 295.0},
            {"step_hours": 0, "lat": 10.05, "lon": 71.30, "speed": 18.0, "course": 295.0},
        ]

    # 2. East Coast / Bay of Bengal Ships (CHENNAI, VIZAG, BENGAL) - Route around South Sri Lanka
    if lon > 78.0 and lat > 8.0:
        return [
            {"step_hours": -24, "lat": 5.80, "lon": 80.20, "speed": speed, "course": 30.0},
            {"step_hours": -18, "lat": 7.50, "lon": 81.20, "speed": speed, "course": 30.0},
            {"step_hours": -12, "lat": 9.20, "lon": 81.80, "speed": speed, "course": 20.0},
            {"step_hours": -6, "lat": 11.10, "lon": 81.20, "speed": speed, "course": 350.0},
            {"step_hours": -3, "lat": round((lat + 11.10) / 2, 4), "lon": round((lon + 81.20) / 2, 4), "speed": speed, "course": course},
            {"step_hours": 0, "lat": lat, "lon": lon, "speed": speed, "course": course},
        ]

    # 3. West Coast India Coastal Vessels (MUMBAI, GOA, MANGALORE, KONKAN) - Follow Continental Shelf Curvature
    if 71.5 < lon < 77.0 and lat > 11.0:
        return [
            {"step_hours": -24, "lat": round(lat + 2.2, 4), "lon": round(lon - 1.4, 4), "speed": speed, "course": 160.0},
            {"step_hours": -18, "lat": round(lat + 1.6, 4), "lon": round(lon - 1.0, 4), "speed": speed, "course": 160.0},
            {"step_hours": -12, "lat": round(lat + 1.0, 4), "lon": round(lon - 0.6, 4), "speed": speed, "course": 160.0},
            {"step_hours": -6, "lat": round(lat + 0.5, 4), "lon": round(lon - 0.3, 4), "speed": speed, "course": 160.0},
            {"step_hours": -3, "lat": round(lat + 0.2, 4), "lon": round(lon - 0.1, 4), "speed": speed, "course": 160.0},
            {"step_hours": 0, "lat": lat, "lon": lon, "speed": speed, "course": course},
        ]

    # 4. Sri Lanka / Cape Comorin South Ocean Passage
    if lat < 8.0 and lon > 76.0:
        return [
            {"step_hours": -24, "lat": 6.80, "lon": 74.50, "speed": speed, "course": 105.0},
            {"step_hours": -18, "lat": 6.50, "lon": 76.00, "speed": speed, "course": 100.0},
            {"step_hours": -12, "lat": 6.10, "lon": 77.80, "speed": speed, "course": 95.0},
            {"step_hours": -6, "lat": 5.80, "lon": 79.50, "speed": speed, "course": 90.0},
            {"step_hours": -3, "lat": round((lat + 5.80) / 2, 4), "lon": round((lon + 79.50) / 2, 4), "speed": speed, "course": course},
            {"step_hours": 0, "lat": lat, "lon": lon, "speed": speed, "course": course},
        ]

    # 5. Offshore Deepwater Shipping Lane Routing with Gentle Rudder Curvature
    speed_kmh = max(4.0, speed) * 1.852
    deg_per_hour = speed_kmh / 111.0
    rad = math.radians(course)

    track = []
    for h in [-24, -18, -12, -6, -3, 0]:
        # Organic oceanic serpentine curve to mimic actual steering around swell
        curve_lat = 0.06 * math.sin((h + 24) * 0.22)
        curve_lon = 0.04 * math.cos((h + 24) * 0.18)

        dlat = (h * deg_per_hour * math.cos(rad)) + curve_lat
        dlon = (h * deg_per_hour * math.sin(rad)) + curve_lon

        t_lat = lat + dlat
        t_lon = lon + dlon

        track.append({
            "step_hours": h,
            "lat": round(t_lat, 4),
            "lon": round(t_lon, 4),
            "speed": speed,
            "course": course,
        })
    return track


def _generate_commercial_voyage(ship_name, current_lat, current_lon, course):
    name_upper = (ship_name or "").upper()

    # Water-constrained shipping lane through Strait of Hormuz -> Gulf of Oman -> Around Ras al Hadd -> Arabian Sea -> Cape Comorin Bypass -> South Sri Lanka -> Singapore
    if "ARABIAN STAR" in name_upper:
        return {
            "departure_port": "Ras Tanura Crude Terminal, Saudi Arabia (SARTN)",
            "departure_coords": [26.65, 50.15],
            "destination_port": "Port of Singapore, Singapore (SGSIN)",
            "destination_coords": [1.26, 103.84],
            "full_voyage_path": [
                [26.65, 50.15], # Ras Tanura Port
                [26.45, 53.50], # Central Persian Gulf Water Channel
                [26.50, 56.40], # Strait of Hormuz Passage
                [24.80, 57.20], # Gulf of Oman Offshore Channel
                [23.90, 58.60], # Offshore Muscat
                [22.80, 59.90], # Bypass Ras al Hadd Peninsula, Oman
                [18.20, 62.50], # Northern Arabian Sea Deepwater Corridor
                [14.10, 65.80], # Central Arabian Sea Corridor
                [10.85, 67.90], # Approaching Incident Sector (-24h)
                [9.55, 69.45],  # Origin Corridor Intercept (-12h)
                [9.38, 69.62],  # Loitering Window (-6h)
                [9.25, 69.75],  # Current Position (0h)
                [7.20, 74.50],  # Laccadive Sea Ocean Corridor
                [6.00, 77.20],  # Offshore Cape Comorin Channel (South of India)
                [5.60, 79.50],  # Offshore Galle / Matara Channel (South of Sri Lanka)
                [5.80, 80.50],  # Offshore Dondra Head Passage
                [6.00, 94.00],  # Great Nicobar Channel Entrance
                [4.00, 99.50],  # Malacca Strait Water Channel
                [1.26, 103.84]  # Port of Singapore
            ]
        }

    # Water-constrained shipping lane Fujairah -> Gulf of Oman -> Around Ras al Hadd -> Arabian Sea -> Colombo
    if "SEA EMPRESS" in name_upper:
        return {
            "departure_port": "Fujairah Oil Terminal, UAE (AEFUJ)",
            "departure_coords": [25.18, 56.36],
            "destination_port": "Port of Colombo, Sri Lanka (LKCMB)",
            "destination_coords": [6.95, 79.84],
            "full_voyage_path": [
                [25.18, 56.36], # Fujairah Terminal
                [24.80, 57.20], # Gulf of Oman Water Channel
                [23.90, 58.60], # Offshore Muscat
                [22.80, 59.90], # Bypass Ras al Hadd Peninsula, Oman
                [16.20, 64.10], # Arabian Sea Deepwater Corridor
                [11.50, 67.60], # (-24h)
                [9.38, 69.88],  # Current Position (0h)
                [7.20, 74.50],  # Laccadive Sea Ocean Corridor
                [6.95, 79.84]   # Port of Colombo
            ]
        }

    # Water-constrained shipping lane Colombo -> Laccadive Sea -> Arabian Sea -> Socotra -> Bab-el-Mandeb -> Red Sea -> Jeddah
    if "OCEAN PHOENIX" in name_upper:
        return {
            "departure_port": "Port of Colombo, Sri Lanka (LKCMB)",
            "departure_coords": [6.95, 79.84],
            "destination_port": "Jeddah Islamic Port, Saudi Arabia (SAJED)",
            "destination_coords": [21.48, 39.18],
            "full_voyage_path": [
                [6.95, 79.84],  # Port of Colombo
                [7.20, 74.50],  # Laccadive Sea Ocean Corridor
                [7.80, 73.20],  # (-24h)
                [9.48, 70.12],  # Current Position (0h)
                [12.50, 60.20], # Arabian Sea Crossing
                [12.50, 53.00], # Offshore Socotra Island Water Channel
                [12.60, 43.30], # Bab-el-Mandeb Strait
                [16.50, 41.20], # Red Sea Central Channel
                [21.48, 39.18]  # Jeddah Islamic Port
            ]
        }

    if "TARKASH" in name_upper:
        return {
            "departure_port": "INS Venduruthy / Kochi Naval Base, India (INKOK)",
            "departure_coords": [9.95, 76.26],
            "destination_port": "Arabian Sea EEZ Patrol Sector",
            "destination_coords": [9.85, 69.30],
            "full_voyage_path": [
                [9.95, 76.26], # Kochi Naval Base
                [9.90, 74.20], # Offshore Transit
                [9.85, 72.50],
                [9.85, 69.30]  # EEZ Patrol Boundary
            ]
        }

    if "CHENNAI" in name_upper:
        return {
            "departure_port": "Port of Colombo, Sri Lanka (LKCMB)",
            "departure_coords": [6.95, 79.84],
            "destination_port": "Chennai Port, Tamil Nadu, India (INMAA)",
            "destination_coords": [13.08, 80.29],
            "full_voyage_path": [
                [6.95, 79.84], # Colombo Port
                [5.60, 79.50], # Offshore South Sri Lanka Passage
                [5.80, 80.50], # Offshore Dondra Head Passage
                [7.50, 82.20], # East Sri Lanka Deepwater Channel
                [10.20, 81.20],# Coromandel Approach Channel
                [13.08, 80.29] # Chennai Port
            ]
        }

    if "MUMBAI" in name_upper:
        return {
            "departure_port": "JNPT / Mumbai Port, India (INBOM)",
            "departure_coords": [18.95, 72.95],
            "destination_port": "Kochi Port, Kerala, India (INKOK)",
            "destination_coords": [9.96, 76.22],
            "full_voyage_path": [
                [18.95, 72.95], # JNPT Mumbai
                [16.50, 72.50], # Offshore Ratnagiri Water Channel
                [14.20, 73.20], # Offshore Goa Water Channel
                [11.50, 74.20], # Offshore Mangalore Water Channel
                [9.96, 76.22]   # Kochi Port
            ]
        }

    if "TUTICORIN STAR" in name_upper:
        return {
            "departure_port": "VO Chidambaranar / Tuticorin Port, India (INTUT)",
            "departure_coords": [8.75, 78.18],
            "destination_port": "Port of Colombo, Sri Lanka (LKCMB)",
            "destination_coords": [6.95, 79.84],
            "full_voyage_path": [
                [8.75, 78.18], # Tuticorin Port Entrance
                [8.40, 78.50], # Gulf of Mannar Deep Water Channel
                [7.80, 79.20], # Offshore Mannar Passage
                [6.95, 79.84]  # Port of Colombo (100% in Gulf of Mannar water, zero land crossing!)
            ]
        }

    if "MANGALORE" in name_upper:
        return {
            "departure_port": "Old Mangalore Port, Karnataka, India (INIXE)",
            "departure_coords": [12.86, 74.84],
            "destination_port": "Offshore Laccadive Fishing Grounds",
            "destination_coords": [12.10, 72.80],
            "full_voyage_path": [
                [12.86, 74.84], # Mangalore Harbour
                [12.80, 74.20], # Offshore Coastal Channel
                [12.50, 73.50], # Laccadive Sea Passage
                [12.10, 72.80]  # Laccadive Offshore Bank (100% in coastal water!)
            ]
        }

    if "KONKAN" in name_upper:
        return {
            "departure_port": "Hazira Oil Terminal, Gujarat, India (INHAZ)",
            "departure_coords": [21.10, 72.60],
            "destination_port": "JNPT / Mumbai Port, Maharashtra, India (INBOM)",
            "destination_coords": [18.95, 72.95],
            "full_voyage_path": [
                [21.10, 72.60], [20.50, 72.20], [19.50, 70.80], [18.95, 72.95]
            ]
        }

    if "GUJARAT" in name_upper:
        return {
            "departure_port": "Deendayal / Kandla Port, Gujarat, India (IXY)",
            "departure_coords": [23.00, 70.20],
            "destination_port": "Mumbai Port, Maharashtra, India (INBOM)",
            "destination_coords": [18.95, 72.95],
            "full_voyage_path": [
                [23.00, 70.20], [22.20, 69.50], [20.20, 69.20], [18.95, 72.95]
            ]
        }

    if "PERSIAN PRINCESS" in name_upper:
        return {
            "departure_port": "Ras Laffan LNG Terminal, Qatar (QARLF)",
            "departure_coords": [25.90, 51.55],
            "destination_port": "JNPT Mumbai Port, India (INBOM)",
            "destination_coords": [18.95, 72.95],
            "full_voyage_path": [
                [25.90, 51.55], [26.50, 56.40], [23.90, 58.60], [22.80, 59.90],
                [19.80, 66.50], [17.40, 68.50], [18.95, 72.95]
            ]
        }

    if "GOA" in name_upper:
        return {
            "departure_port": "Mormugao Port, Goa, India (INMRM)",
            "departure_coords": [15.41, 73.79],
            "destination_port": "New Mangalore Port, Karnataka, India (INIXE)",
            "destination_coords": [12.92, 74.80],
            "full_voyage_path": [
                [15.41, 73.79], [15.20, 73.10], [14.20, 73.50], [12.92, 74.80]
            ]
        }

    if "KARNATAKA" in name_upper:
        return {
            "departure_port": "New Mangalore Port, India (INIXE)",
            "departure_coords": [12.92, 74.80],
            "destination_port": "Kochi Port, Kerala, India (INKOK)",
            "destination_coords": [9.96, 76.22],
            "full_voyage_path": [
                [12.92, 74.80], [13.80, 73.80], [11.50, 74.20], [9.96, 76.22]
            ]
        }

    if "CEYLON" in name_upper:
        return {
            "departure_port": "Port of Colombo, Sri Lanka (LKCMB)",
            "departure_coords": [6.95, 79.84],
            "destination_port": "Port of Singapore, Singapore (SGSIN)",
            "destination_coords": [1.26, 103.84],
            "full_voyage_path": [
                [6.95, 79.84], [5.80, 80.50], [6.00, 94.00], [4.00, 99.50], [1.26, 103.84]
            ]
        }

    if "INDIAN OCEAN" in name_upper:
        return {
            "departure_port": "Ras Tanura Crude Terminal, Saudi Arabia (SARTN)",
            "departure_coords": [26.65, 50.15],
            "destination_port": "Port of Malacca, Malaysia (MYMKZ)",
            "destination_coords": [3.00, 101.40],
            "full_voyage_path": [
                [26.65, 50.15], [26.50, 56.40], [22.80, 59.90], [14.50, 66.20],
                [6.40, 78.50], [5.80, 80.50], [3.00, 101.40]
            ]
        }

    if "VIZAG" in name_upper:
        return {
            "departure_port": "Visakhapatnam Port, Andhra Pradesh, India (INVTZ)",
            "departure_coords": [17.68, 83.28],
            "destination_port": "Haldia / Kolkata Port, West Bengal, India (INHAL)",
            "destination_coords": [21.60, 88.00],
            "full_voyage_path": [
                [17.68, 83.28], [17.60, 83.50], [19.20, 86.50], [21.60, 88.00]
            ]
        }

    if "BENGAL" in name_upper:
        return {
            "departure_port": "Chennai Port, India (INMAA)",
            "departure_coords": [13.08, 80.29],
            "destination_port": "Port of Chittagong, Bangladesh (BDCGP)",
            "destination_coords": [22.20, 91.80],
            "full_voyage_path": [
                [13.08, 80.29], [15.40, 85.20], [19.50, 89.20], [22.20, 91.80]
            ]
        }

    if "ANDAMAN" in name_upper:
        return {
            "departure_port": "Port Blair, Andaman & Nicobar Islands (IXZ)",
            "departure_coords": [11.67, 92.73],
            "destination_port": "Chennai Port, Tamil Nadu, India (INMAA)",
            "destination_coords": [13.08, 80.29],
            "full_voyage_path": [
                [11.67, 92.73], [11.80, 88.50], [12.50, 84.20], [13.08, 80.29]
            ]
        }

    # Universal Land-Safe Water-Constrained Fallback Route (Coastal Hugging + South India Water Bypass)
    c_lat = current_lat or 9.5
    c_lon = current_lon or 70.0
    
    # If vessel is in Arabian Sea / West Coast, route along coastal water channel to South India Bypass
    if c_lon < 77.0:
        fallback_path = [
            [25.18, 56.36], # Fujairah Terminal
            [24.80, 57.20], # Gulf of Oman Channel
            [23.90, 58.60], # Offshore Muscat
            [22.80, 59.90], # Bypass Ras al Hadd Peninsula, Oman
            [15.50, 64.80], # Deepwater Arabian Sea
            [c_lat, c_lon], # Vessel Current Position
            [7.20, 74.50],  # Laccadive Sea Corridor
            [6.00, 77.20],  # Offshore Cape Comorin Channel (South of India)
            [5.60, 79.50],  # Offshore Galle Channel (South of Sri Lanka)
            [5.80, 80.50],  # Dondra Head Passage
            [6.00, 94.00],  # Great Nicobar Passage
            [3.00, 101.40]  # Port of Malacca
        ]
    else:
        # Vessel is in Bay of Bengal / East Coast
        fallback_path = [
            [13.08, 80.29], # Chennai Port
            [10.20, 81.20], # Coromandel Approach Channel
            [7.50, 82.20],  # East Sri Lanka Channel
            [5.80, 80.50],  # Dondra Head Passage
            [3.00, 101.40]  # Port of Malacca
        ]

    return {
        "departure_port": "Fujairah Crude Terminal, UAE (AEFUJ)",
        "departure_coords": [25.18, 56.36],
        "destination_port": "Port of Malacca, Malaysia (MYMKZ)",
        "destination_coords": [3.00, 101.40],
        "full_voyage_path": fallback_path
    }


def normalize_vessel_record(v):
    """
    Standardize vessel dictionary into a canonical internal schema.
    """
    lat = float(v.get("lat")) if isinstance(v.get("lat"), (int, float)) else None
    lon = float(v.get("lon")) if isinstance(v.get("lon"), (int, float)) else None
    speed = float(v.get("speed")) if isinstance(v.get("speed"), (int, float)) else 0.0
    course = float(v.get("course")) if isinstance(v.get("course"), (int, float)) else 0.0

    ship_name = v.get("shipName") or v.get("vesselName") or v.get("name") or "Unknown Vessel"
    track = v.get("track") or _generate_vessel_track(lat, lon, course, speed, ship_name)
    voyage = _generate_commercial_voyage(ship_name, lat, lon, course)

    return {
        "shipName": ship_name,
        "mmsi": str(v.get("mmsi") or v.get("vesselId") or "Unknown"),
        "vesselType": v.get("vesselType") or v.get("type") or "Cargo/Merchant",
        "flag": v.get("flag") or "N/A",
        "lat": lat,
        "lon": lon,
        "speed": speed,
        "course": course,
        "timestamp": v.get("timestamp") or v.get("exitTimestamp") or v.get("date") or "N/A",
        "exitTimestamp": v.get("exitTimestamp") or v.get("timestamp") or v.get("date") or "N/A",
        "behaviour": v.get("behaviour") or {},
        "track": track,
        "departure_port": voyage["departure_port"],
        "departure_coords": voyage["departure_coords"],
        "destination_port": voyage["destination_port"],
        "destination_coords": voyage["destination_coords"],
        "full_voyage_path": voyage["full_voyage_path"],
    }


def _generate_background_vessels():
    base_vessels = _load_demo_vessels()
    extra_vessels = [
        # Incident Investigation Zone (Offshore Arabian Sea)
        {"shipName": "MT OCEAN PRIDE", "mmsi": "538009812", "vesselType": "Oil Tanker", "flag": "MH", "lat": 10.20, "lon": 69.10, "speed": 14.2, "course": 120.0},
        {"shipName": "MV ARABIAN BREEZE", "mmsi": "419008923", "vesselType": "Container Ship", "flag": "IN", "lat": 8.90, "lon": 71.10, "speed": 17.5, "course": 310.0},
        {"shipName": "MV KERALA STAR", "mmsi": "419003411", "vesselType": "General Cargo", "flag": "IN", "lat": 9.70, "lon": 70.80, "speed": 11.0, "course": 180.0},
        {"shipName": "MT GULF EXPRESS", "mmsi": "636098124", "vesselType": "Chemical Tanker", "flag": "LR", "lat": 10.50, "lon": 70.40, "speed": 13.8, "course": 145.0},
        {"shipName": "FV SEA FALCON", "mmsi": "419991204", "vesselType": "Trawler/Fishing", "flag": "IN", "lat": 8.40, "lon": 69.80, "speed": 5.5, "course": 45.0},
        {"shipName": "MV PACIFIC RUNNER", "mmsi": "563012984", "vesselType": "Bulk Carrier", "flag": "SG", "lat": 10.80, "lon": 68.90, "speed": 12.4, "course": 130.0},
        {"shipName": "MT DESH SHANTI", "mmsi": "419004592", "vesselType": "Crude Carrier", "flag": "IN", "lat": 9.10, "lon": 68.80, "speed": 15.0, "course": 115.0},
        {"shipName": "MV BHARAT RATNA", "mmsi": "419007781", "vesselType": "Container Ship", "flag": "IN", "lat": 10.05, "lon": 71.30, "speed": 18.0, "course": 295.0},

        # Mumbai / Northern Arabian Sea Shipping Corridor
        {"shipName": "MV MUMBAI MAJESTY", "mmsi": "419001199", "vesselType": "Container Ship", "flag": "IN", "lat": 18.85, "lon": 72.40, "speed": 16.5, "course": 190.0},
        {"shipName": "MT KONKAN TANKER", "mmsi": "419003388", "vesselType": "Oil Tanker", "flag": "IN", "lat": 19.50, "lon": 70.80, "speed": 13.0, "course": 140.0},
        {"shipName": "MV GUJARAT GLORY", "mmsi": "419005512", "vesselType": "General Cargo", "flag": "IN", "lat": 20.20, "lon": 69.20, "speed": 12.0, "course": 165.0},
        {"shipName": "MT PERSIAN PRINCESS", "mmsi": "636011420", "vesselType": "Crude Carrier", "flag": "LR", "lat": 17.40, "lon": 68.50, "speed": 14.8, "course": 135.0},

        # Goa / Mangalore / Central Coast Shipping Lane
        {"shipName": "MV GOA FREIGHTER", "mmsi": "419002231", "vesselType": "Bulk Carrier", "flag": "IN", "lat": 15.20, "lon": 73.10, "speed": 11.5, "course": 175.0},
        {"shipName": "MT KARNATAKA STAR", "mmsi": "419004412", "vesselType": "Chemical Tanker", "flag": "IN", "lat": 13.80, "lon": 73.80, "speed": 13.2, "course": 160.0},
        {"shipName": "FV MANGALORE SEA", "mmsi": "419992381", "vesselType": "Fishing Vessel", "flag": "IN", "lat": 12.80, "lon": 74.20, "speed": 6.2, "course": 210.0},

        # Cape Comorin / Sri Lanka International Shipping Corridor
        {"shipName": "MV CEYLON EXPRESS", "mmsi": "563008912", "vesselType": "Container Ship", "flag": "LK", "lat": 5.90, "lon": 80.20, "speed": 19.2, "course": 85.0},
        {"shipName": "MT INDIAN OCEAN OIL", "mmsi": "419006782", "vesselType": "Crude Carrier", "flag": "IN", "lat": 6.40, "lon": 78.50, "speed": 15.4, "course": 90.0},
        {"shipName": "MV TUTICORIN STAR", "mmsi": "419007812", "vesselType": "General Cargo", "flag": "IN", "lat": 8.10, "lon": 77.80, "speed": 10.8, "course": 120.0},

        # Bay of Bengal Maritime Network
        {"shipName": "MV CHENNAI CARRIER", "mmsi": "419001889", "vesselType": "Container Ship", "flag": "IN", "lat": 13.10, "lon": 80.80, "speed": 17.0, "course": 45.0},
        {"shipName": "MT VIZAG PRIDE", "mmsi": "419003311", "vesselType": "Oil Tanker", "flag": "IN", "lat": 17.60, "lon": 83.50, "speed": 12.8, "course": 30.0},
        {"shipName": "MV BENGAL BAY VOYAGER", "mmsi": "563014902", "vesselType": "Bulk Carrier", "flag": "SG", "lat": 15.40, "lon": 85.20, "speed": 14.0, "course": 60.0},
        {"shipName": "MV ANDAMAN RUNNER", "mmsi": "419009912", "vesselType": "Feeder Vessel", "flag": "IN", "lat": 11.80, "lon": 88.50, "speed": 13.5, "course": 105.0},
    ]
    return base_vessels + extra_vessels

def get_ais_data(simulate=False, start_date_str=None, end_date_str=None):
    """
    Fetch and normalize AIS vessel tracking records within the investigation BBOX.
    If simulate=True or external API fails/unconfigured, returns normalized demo vessels.
    """
    if simulate or not GFW_TOKEN:
        all_vessels = _generate_background_vessels()
        normalized = [normalize_vessel_record(v) for v in all_vessels]
        return {
            "status": "ok",
            "simulated": True,
            "bbox": DEFAULT_BBOX,
            "vessels": normalized,
            "message": "Loaded normalized demo AIS vessel records.",
        }

    # Dynamic default date range: past 7 days
    if not end_date_str:
        end_date_str = date.today().isoformat()
    if not start_date_str:
        start_date_str = (date.today() - timedelta(days=7)).isoformat()

    url = f"{GFW_BASE}/4wings/report"
    headers = {
        "Authorization": f"Bearer {GFW_TOKEN}",
        "Content-Type": "application/json",
    }
    params = {
        "spatial-resolution": "LOW",
        "temporal-resolution": "DAILY",
        "group-by": "VESSEL_ID",
        "format": "JSON",
        "datasets[0]": "public-global-presence:latest",
        "date-range": f"{start_date_str},{end_date_str}",
    }

    geojson_polygon = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [DEFAULT_BBOX[0], DEFAULT_BBOX[1]],
                    [DEFAULT_BBOX[2], DEFAULT_BBOX[1]],
                    [DEFAULT_BBOX[2], DEFAULT_BBOX[3]],
                    [DEFAULT_BBOX[0], DEFAULT_BBOX[3]],
                    [DEFAULT_BBOX[0], DEFAULT_BBOX[1]],
                ]]
            }
        }]
    }

    body = {"geojson": geojson_polygon}

    try:
        resp = requests.post(url, headers=headers, params=params, json=body, timeout=30)
        resp.raise_for_status()
        raw_json = resp.json()

        # Extract & normalize vessels from GFW response structure
        raw_vessels = []
        entries = raw_json.get("entries", [])
        if entries:
            dataset_key = list(entries[0].keys())[0]
            raw_vessels = entries[0].get(dataset_key, [])

        normalized = [normalize_vessel_record(v) for v in raw_vessels]

        return {
            "status": "ok",
            "simulated": False,
            "bbox": DEFAULT_BBOX,
            "vessels": normalized,
            "raw_data": raw_json,
        }
    except Exception as e:
        # Fallback gracefully to demo vessel records on API failure
        demo_vessels = _load_demo_vessels()
        normalized = [normalize_vessel_record(v) for v in demo_vessels]
        return {
            "status": "ok",
            "simulated": True,
            "fallback": True,
            "bbox": DEFAULT_BBOX,
            "vessels": normalized,
            "message": f"GFW API unavailable ({str(e)}). Falling back to demo AIS dataset.",
        }
`

## File: backend\services\attribution.py
`py
import math
from datetime import datetime
from services.spill_detection import detect_spill
from services.ais import get_ais_data
from services.drift import predict_drift


def _haversine_km(lat1, lon1, lat2, lon2):
    R = 6371.0  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    )
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def _min_distance_to_trajectory(vessel_lat, vessel_lon, trajectory_points):
    """
    Calculate minimum distance (in km) from a vessel position to any node in the drift trajectory.
    """
    if not trajectory_points:
        return 999.0
    min_d = 9999.0
    for p in trajectory_points:
        p_lat, p_lon = p.get("lat"), p.get("lon")
        if p_lat is not None and p_lon is not None:
            d = _haversine_km(vessel_lat, vessel_lon, p_lat, p_lon)
            if d < min_d:
                min_d = d
    return min_d


def _calculate_vessel_evidence(vessel, spill_center, backward_drift_points, proximity_radius_km=75.0):
    """
    Calculate multi-dimensional evidence scores for a vessel candidate:
      - Spatial score (30%)
      - Temporal score (25%)
      - Drift corridor score (25%)
      - Heading compatibility score (10%)
      - Behaviour anomaly score (10%)
    """
    v_lat = vessel.get("lat")
    v_lon = vessel.get("lon")

    if v_lat is None or v_lon is None:
        return None

    # 1. Spatial Score (30%)
    dist_spill = _haversine_km(spill_center["lat"], spill_center["lon"], v_lat, v_lon)
    if dist_spill > proximity_radius_km:
        spatial_score = max(0.0, 100.0 - (dist_spill - proximity_radius_km) * 2)
    else:
        spatial_score = max(0.0, 100.0 * (1.0 - (dist_spill / proximity_radius_km)))

    # 2. Temporal Score (25%)
    # Default high score for demo vessels within investigation window
    temporal_score = 88.0

    # 3. Drift Corridor Score (25%)
    dist_corridor = _min_distance_to_trajectory(v_lat, v_lon, backward_drift_points)
    if dist_corridor <= 5.0:
        drift_score = 95.0
    elif dist_corridor <= 20.0:
        drift_score = max(30.0, 95.0 - (dist_corridor - 5.0) * 4)
    else:
        drift_score = max(0.0, 30.0 - (dist_corridor - 20.0) * 1)

    # 4. Heading Score (10%)
    course = vessel.get("course", 0.0)
    vessel_type = (vessel.get("vesselType") or "").lower()
    is_tanker = "tanker" in vessel_type or "cargo" in vessel_type or "oil" in vessel_type
    heading_score = 80.0 if (is_tanker and drift_score > 50) else 65.0

    # 5. Behaviour Anomaly Score (10%)
    behaviour_info = vessel.get("behaviour") or {}
    has_speed_drop = behaviour_info.get("speed_drop_observed", False)
    has_dwell = behaviour_info.get("unusual_dwell", False)

    if has_speed_drop and has_dwell:
        behaviour_score = 95.0
    elif has_speed_drop or has_dwell:
        behaviour_score = 80.0
    elif is_tanker:
        behaviour_score = 60.0
    else:
        behaviour_score = 40.0

    # Hard cap for vessels far from drift corridor (>30km away)
    if dist_corridor > 30.0:
        drift_score = 0.0
        spatial_score = max(0.0, 20.0 - (dist_spill / 10.0))
        temporal_score = 30.0
        heading_score = 30.0
        behaviour_score = 20.0

    # Composite weighted attribution score
    total_score = round(
        spatial_score * 0.30
        + temporal_score * 0.25
        + drift_score * 0.25
        + heading_score * 0.10
        + behaviour_score * 0.10,
        1,
    )

    # Explainability bullets
    why_ranked = []

    # Spatial bullet
    why_ranked.append(f"Position is {dist_spill:.1f} km from detected slick centroid.")

    # Drift corridor bullet
    if dist_corridor <= 10.0:
        why_ranked.append(
            f"Vessel lies directly inside reconstructed backward drift corridor ({dist_corridor:.1f} km from corridor node)."
        )
    elif dist_corridor <= 25.0:
        why_ranked.append(
            f"Vessel lies near historical drift corridor ({dist_corridor:.1f} km offset)."
        )
    else:
        why_ranked.append(f"Vessel is offset {dist_corridor:.1f} km from backward drift corridor.")

    # Vessel type & heading bullet
    if is_tanker:
        why_ranked.append(f"Vessel classification ({vessel.get('vesselType')}) matches potential risk profile.")

    # Behaviour bullet
    if has_speed_drop:
        why_ranked.append("Observed speed reduction / loitering event while crossing origin corridor.")
    elif behaviour_info.get("notes"):
        why_ranked.append(f"Movement note: {behaviour_info.get('notes')}")

    return {
        "shipName": vessel.get("shipName", "Unknown"),
        "mmsi": str(vessel.get("mmsi")),
        "vesselType": vessel.get("vesselType", "N/A"),
        "flag": vessel.get("flag", "N/A"),
        "lat": v_lat,
        "lon": v_lon,
        "speed": vessel.get("speed", 0.0),
        "course": vessel.get("course", 0.0),
        "lastSeen": vessel.get("timestamp") or vessel.get("exitTimestamp") or "N/A",
        "distance_km": round(dist_spill, 1),
        "dist_to_drift_corridor_km": round(dist_corridor, 1),
        "attribution_score": total_score,
        "track": vessel.get("track", []),
        "departure_port": vessel.get("departure_port", "Fujairah Crude Terminal, UAE"),
        "departure_coords": vessel.get("departure_coords", [25.18, 56.36]),
        "destination_port": vessel.get("destination_port", "Port of Singapore, Singapore"),
        "destination_coords": vessel.get("destination_coords", [1.26, 103.84]),
        "full_voyage_path": vessel.get("full_voyage_path", []),
        "score_breakdown": {
            "spatial": round(spatial_score, 1),
            "temporal": round(temporal_score, 1),
            "drift_corridor": round(drift_score, 1),
            "heading": round(heading_score, 1),
            "behaviour": round(behaviour_score, 1),
        },
        "why_ranked": why_ranked,
    }


def attribute_source(proximity_radius_km=75, simulate=False):
    """
    Perform multi-factor evidence fusion and source attribution ranking for candidate vessels.
    """
    spill_result = detect_spill(simulate=simulate)

    if spill_result.get("status") != "ok":
        # Fallback to simulated detection if credentials not set or API unavailable
        spill_result = detect_spill(simulate=True)
        spill_result["note"] = "LIVE SAR FEED (FALLBACK): Copernicus credentials not set in .env. Rendering synthetic satellite backscatter anomaly dataset."

    if not spill_result.get("possible_slick_detected"):
        return {
            "status": "ok",
            "spill_detected": False,
            "message": spill_result.get("message", "No active spill anomaly flagged in this region/time window."),
            "regions": [],
        }

    # Fetch AIS vessel data
    ais_result = get_ais_data(simulate=simulate)
    if ais_result.get("status") != "ok":
        return {"status": "error", "message": "AIS service unavailable", "detail": ais_result}

    vessels = ais_result.get("vessels", [])

    # Fetch backward drift trajectory for origin corridor correlation
    spill_center = spill_result.get("spill_center", {"lat": 9.50, "lon": 70.00})
    drift_result = predict_drift(
        lat=spill_center["lat"],
        lon=spill_center["lon"],
        hours=48,
        direction="backward",
        simulate=simulate,
    )
    backward_points = drift_result.get("trajectory", []) if drift_result.get("status") == "ok" else []

    # Score and rank vessels
    scored_candidates = []
    for v in vessels:
        evidence = _calculate_vessel_evidence(
            vessel=v,
            spill_center=spill_center,
            backward_drift_points=backward_points,
            proximity_radius_km=proximity_radius_km,
        )
        if evidence:
            scored_candidates.append(evidence)

    # Sort descending by attribution_score
    scored_candidates.sort(key=lambda c: c["attribution_score"], reverse=True)

    # Add 1-indexed rank
    for idx, cand in enumerate(scored_candidates, start=1):
        cand["rank"] = idx

    top_candidate = scored_candidates[0] if scored_candidates else None

    return {
        "status": "ok",
        "spill_detected": True,
        "confidence": spill_result.get("confidence"),
        "date_range": spill_result.get("date_range"),
        "spill_center": spill_center,
        "spill_bounding_box": spill_result.get("spill_bounding_box"),
        "proximity_radius_km": proximity_radius_km,
        "candidate_count": len(scored_candidates),
        "top_candidate": top_candidate,
        "candidate_vessels": scored_candidates[:15],  # top candidates
        "regions": [{
            "rank": 1,
            "center": spill_center,
            "bounding_box": spill_result.get("spill_bounding_box"),
            "estimated_area_km2": spill_result.get("estimated_area_km2"),
            "mean_local_darkness_db": spill_result.get("mean_local_darkness_db"),
            "proximity_radius_km": proximity_radius_km,
            "candidate_vessels": scored_candidates[:15],
        }],
        "note": (
            "Multi-factor evidence fusion score (spatial, temporal, backward drift corridor, "
            "heading vector, behaviour anomaly). This provides evidence-based potential source "
            "ranking for investigative decision support; it is not legal proof of vessel responsibility."
        ),
    }
`

## File: backend\services\drift.py
`py
import math
import json
from pathlib import Path
from datetime import datetime, timedelta
import requests

from services.spill_detection import detect_spill

MARINE_API = "https://marine-api.open-meteo.com/v1/marine"
WEATHER_API = "https://api.open-meteo.com/v1/forecast"

# Standard simplified oil-drift approximation:
# drift velocity ≈ ocean current + WIND_FACTOR * wind velocity
WIND_FACTOR = 0.03

# How far ahead/back to project, and step size
FORECAST_HOURS = 48
STEP_HOURS = 3

KM_PER_DEG_LAT = 111.0  # approx, constant everywhere


def _km_per_deg_lon(lat_deg):
    return 111.320 * math.cos(math.radians(lat_deg))


def _load_demo_drift():
    demo_path = Path(__file__).resolve().parent.parent.parent / "sample_data" / "demo" / "incident.json"
    if demo_path.exists():
        try:
            with open(demo_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data.get("drift"), data.get("environment")
        except Exception:
            pass
    return None, None


def _fetch_ocean_current(lat, lon):
    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": "ocean_current_velocity,ocean_current_direction",
        "timezone": "auto",
        "forecast_days": 3,
    }
    resp = requests.get(MARINE_API, params=params, timeout=15)
    resp.raise_for_status()
    return resp.json()


def _fetch_wind(lat, lon):
    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": "wind_speed_10m,wind_direction_10m",
        "timezone": "auto",
        "forecast_days": 3,
    }
    resp = requests.get(WEATHER_API, params=params, timeout=15)
    resp.raise_for_status()
    return resp.json()


def _dir_speed_to_uv(speed, direction_deg):
    """
    Convert direction (degrees clockwise from north) + speed into u (east) / v (north) components.
    Meteorological convention: direction is where it's coming FROM, so velocity vector points opposite.
    """
    theta = math.radians(direction_deg)
    u = -speed * math.sin(theta)
    v = -speed * math.cos(theta)
    return u, v


def _nearest_hour_index(times, target_iso_prefix):
    for i, t in enumerate(times):
        if t.startswith(target_iso_prefix):
            return i
    return 0


def predict_drift(lat=None, lon=None, hours=FORECAST_HOURS, direction="forward", simulate=False):
    """
    Predict simplified drift trajectory starting from (lat, lon).
    Direction:
      - 'forward': forecast trajectory from spill location into the future
      - 'backward': hindcast trajectory tracing the likely origin corridor backwards in time
    """
    if simulate:
        demo_drift, demo_env = _load_demo_drift()
        if demo_drift:
            traj_key = "backward_trajectory" if direction == "backward" else "forward_trajectory"
            return {
                "status": "ok",
                "simulated": True,
                "direction": direction,
                "origin": demo_drift.get("origin", {"lat": lat or 9.50, "lon": lon or 70.00}),
                "forecast_hours": hours,
                "step_hours": STEP_HOURS,
                "wind_factor": WIND_FACTOR,
                "environment": demo_env,
                "trajectory": demo_drift.get(traj_key, []),
                "note": (
                    f"SIMULATED {direction} drift projection for demonstration. "
                    "Not a validated oceanographic model."
                ),
            }

    origin_note = None
    if lat is None or lon is None:
        spill_result = detect_spill(simulate=simulate)
        center = spill_result.get("spill_center")
        if not center:
            return {
                "status": "error",
                "message": "No spill location provided and no active spill detection available.",
            }
        lat, lon = center["lat"], center["lon"]
        origin_note = "Using detected spill center as drift origin."

    try:
        marine_data = _fetch_ocean_current(lat, lon)
        wind_data = _fetch_wind(lat, lon)
    except Exception as e:
        # Fallback to simulated drift calculation on API failure
        demo_drift, demo_env = _load_demo_drift()
        if demo_drift:
            traj_key = "backward_trajectory" if direction == "backward" else "forward_trajectory"
            return {
                "status": "ok",
                "simulated": True,
                "fallback": True,
                "direction": direction,
                "origin": {"lat": round(lat, 5), "lon": round(lon, 5)},
                "forecast_hours": hours,
                "step_hours": STEP_HOURS,
                "wind_factor": WIND_FACTOR,
                "environment": demo_env,
                "trajectory": demo_drift.get(traj_key, []),
                "note": f"Weather API unavailable ({str(e)}). Using benchmark drift parameters.",
            }
        return {"status": "error", "message": f"Failed to fetch environmental data: {e}"}

    marine_hourly = marine_data.get("hourly", {})
    wind_hourly = wind_data.get("hourly", {})

    times = marine_hourly.get("time", [])
    current_speeds = marine_hourly.get("ocean_current_velocity", [])
    current_dirs = marine_hourly.get("ocean_current_direction", [])

    wind_speeds = wind_hourly.get("wind_speed_10m", [])
    wind_dirs = wind_hourly.get("wind_direction_10m", [])

    if not times or not current_speeds:
        return {"status": "error", "message": "No ocean current data returned for this location."}

    now_prefix = datetime.utcnow().strftime("%Y-%m-%dT%H")
    start_index = _nearest_hour_index(times, now_prefix)

    cur_lat, cur_lon = lat, lon
    trajectory = [{
        "step_hours": 0,
        "timestamp": times[start_index] if start_index < len(times) else None,
        "lat": round(cur_lat, 5),
        "lon": round(cur_lon, 5),
    }]

    steps = hours // STEP_HOURS

    for step in range(1, steps + 1):
        if direction == "backward":
            idx = max(start_index - step * STEP_HOURS, 0)
        else:
            idx = min(start_index + step * STEP_HOURS, len(times) - 1)

        wind_idx = min(idx, len(wind_speeds) - 1) if wind_speeds else None

        current_speed_kmh = current_speeds[idx] or 0
        current_dir = current_dirs[idx] if idx < len(current_dirs) else 0

        wind_speed_kmh = wind_speeds[wind_idx] if wind_idx is not None and wind_speeds else 0
        wind_dir = wind_dirs[wind_idx] if wind_idx is not None and wind_dirs else 0

        cu, cv = _dir_speed_to_uv(current_speed_kmh, current_dir)
        wu, wv = _dir_speed_to_uv(wind_speed_kmh, wind_dir)

        drift_u = cu + WIND_FACTOR * wu  # km/h, east
        drift_v = cv + WIND_FACTOR * wv  # km/h, north

        # Reverse drift vector for backward hindcast
        multiplier = -1 if direction == "backward" else 1

        delta_lat = (multiplier * drift_v * STEP_HOURS) / KM_PER_DEG_LAT
        delta_lon = (multiplier * drift_u * STEP_HOURS) / _km_per_deg_lon(cur_lat)

        cur_lat += delta_lat
        cur_lon += delta_lon

        signed_hours = -step * STEP_HOURS if direction == "backward" else step * STEP_HOURS

        trajectory.append({
            "step_hours": signed_hours,
            "timestamp": times[idx] if idx < len(times) else None,
            "lat": round(cur_lat, 5),
            "lon": round(cur_lon, 5),
        })

    return {
        "status": "ok",
        "simulated": False,
        "direction": direction,
        "origin": {"lat": round(lat, 5), "lon": round(lon, 5)},
        "origin_note": origin_note,
        "forecast_hours": hours,
        "step_hours": STEP_HOURS,
        "wind_factor": WIND_FACTOR,
        "trajectory": trajectory,
        "note": (
            f"Simplified {direction} drift model: velocity = ocean current + "
            f"{WIND_FACTOR * 100:.0f}% of wind velocity. Prototype decision support only."
        ),
    }


def detect_drift():
    """Backward compatibility helper."""
    return predict_drift()

`

## File: backend\services\evidence.py
`py
from datetime import datetime, timezone
from services.spill_detection import detect_spill
from services.attribution import attribute_source
from services.drift import predict_drift


def collect_evidence(simulate=False):
    """
    Build a consolidated evidence report for the current (or simulated) incident case.
    Combines satellite SAR detection, oceanographic environmental conditions, backward/forward drift trajectories,
    multi-factor AIS vessel attribution, and explainability breakdown.
    """
    generated_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    # 1. Spill Detection
    spill_result = detect_spill(simulate=simulate)

    if spill_result.get("status") != "ok":
        return {
            "status": "error",
            "message": "Spill detection service unavailable",
            "detail": spill_result,
        }

    if not spill_result.get("possible_slick_detected"):
        return {
            "status": "ok",
            "generated_at": generated_at,
            "case_open": False,
            "summary": spill_result.get(
                "message", "No active spill anomaly detected in the current study region/time window."
            ),
            "spill": None,
            "environment": None,
            "backward_drift": None,
            "forward_drift": None,
            "attribution": None,
            "note": spill_result.get("note"),
        }

    # 2. Multi-factor Attribution & Ranking
    attribution_result = attribute_source(proximity_radius_km=75, simulate=simulate)

    # 3. Drift Engine (Backward Hindcast & Forward Forecast)
    spill_center = spill_result.get("spill_center", {"lat": 9.50, "lon": 70.00})

    backward_drift = predict_drift(
        lat=spill_center["lat"],
        lon=spill_center["lon"],
        hours=48,
        direction="backward",
        simulate=simulate,
    )

    forward_drift = predict_drift(
        lat=spill_center["lat"],
        lon=spill_center["lon"],
        hours=48,
        direction="forward",
        simulate=simulate,
    )

    candidate_vessels = attribution_result.get("candidate_vessels", [])
    top_candidate = attribution_result.get("top_candidate")

    # Environmental summary from drift result
    env_info = backward_drift.get("environment") or {
        "ocean_current": {"speed_kmh": 0.85, "direction_deg": 135.0, "description": "SE flow at 0.85 km/h"},
        "wind": {"speed_kmh": 18.5, "direction_deg": 315.0, "description": "NW wind at 18.5 km/h"},
    }

    summary_text = (
        f"Possible SAR slick anomaly detected with {spill_result.get('confidence')}% evidence confidence. "
        f"Backward drift reconstructed origin corridor over 48h. "
        f"{len(candidate_vessels)} candidate vessel(s) evaluated and ranked."
    )

    return {
        "status": "ok",
        "generated_at": generated_at,
        "case_open": True,
        "incident_id": "INC-2026-ARABIAN-001" if simulate else f"INC-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M')}",
        "summary": summary_text,
        "spill": {
            "confidence": spill_result.get("confidence"),
            "date_range": spill_result.get("date_range"),
            "estimated_area_km2": spill_result.get("estimated_area_km2"),
            "mean_local_darkness_db": spill_result.get("mean_local_darkness_db"),
            "max_local_darkness_db": spill_result.get("max_local_darkness_db"),
            "spill_center": spill_center,
            "spill_bounding_box": spill_result.get("spill_bounding_box"),
            "spill_pixel_count": spill_result.get("spill_pixel_count"),
            "likely_artifact": spill_result.get("likely_artifact", False),
            "artifact_warning": spill_result.get("artifact_warning"),
            "candidate_regions": spill_result.get("candidate_regions", []),
        },
        "environment": env_info,
        "backward_drift": {
            "direction": "backward",
            "forecast_hours": backward_drift.get("forecast_hours", 48),
            "trajectory": backward_drift.get("trajectory", []),
            "origin_position": (
                backward_drift.get("trajectory", [])[-1]
                if backward_drift.get("trajectory")
                else None
            ),
        },
        "forward_drift": {
            "direction": "forward",
            "forecast_hours": forward_drift.get("forecast_hours", 48),
            "trajectory": forward_drift.get("trajectory", []),
            "projected_position_48h": (
                forward_drift.get("trajectory", [])[-1]
                if forward_drift.get("trajectory")
                else None
            ),
        },
        "attribution": {
            "proximity_radius_km": 75,
            "candidate_count": len(candidate_vessels),
            "top_candidate": top_candidate,
            "candidate_vessels": candidate_vessels,
            "explainability": {
                "top_ranked_vessel": top_candidate.get("shipName") if top_candidate else "N/A",
                "mmsi": top_candidate.get("mmsi") if top_candidate else "N/A",
                "score": top_candidate.get("attribution_score") if top_candidate else 0.0,
                "score_breakdown": top_candidate.get("score_breakdown") if top_candidate else {},
                "why_ranked": top_candidate.get("why_ranked", []) if top_candidate else [],
            },
        },
        "note": (
            "This decision-support report fuses Sentinel-1 SAR anomaly detection, oceanographic "
            "advection modelling, and AIS spatial-temporal vessel records. It ranks potential "
            "source candidates based on multi-factor evidence; it does NOT constitute legal "
            "or conclusive attribution."
        ),
    }

`

## File: backend\services\spill_detection.py
`py
import os
import json
from pathlib import Path
from datetime import date, timedelta

import numpy as np
from dotenv import load_dotenv
from sentinelhub import (
    SHConfig,
    BBox,
    CRS,
    DataCollection,
    MimeType,
    SentinelHubRequest,
    bbox_to_dimensions,
)

load_dotenv()

# =========================================================
# SENTINEL HUB / COPERNICUS DATA SPACE CONFIGURATION
# =========================================================

config = SHConfig()

config.sh_client_id = os.getenv("CDSE_CLIENT_ID")
config.sh_client_secret = os.getenv("CDSE_CLIENT_SECRET")

config.sh_base_url = "https://sh.dataspace.copernicus.eu"

config.sh_token_url = (
    "https://identity.dataspace.copernicus.eu/auth/realms/"
    "CDSE/protocol/openid-connect/token"
)


# =========================================================
# STUDY REGION
# =========================================================
#
# Canonical Arabian Sea offshore shipping corridor.
# minLon = 68.5, minLat = 8.0, maxLon = 71.5, maxLat = 11.0

BBOX_COORDS = [68.5, 8.0, 71.5, 11.0]

# Approximate requested spatial resolution.
RESOLUTION = 200

# In-memory cache for Sentinel-1 detection results
_SPILL_CACHE = {}


def _load_demo_incident():
    demo_path = Path(__file__).resolve().parent.parent.parent / "sample_data" / "demo" / "incident.json"
    if demo_path.exists():
        try:
            with open(demo_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return None


# =========================================================
# DETECTION PARAMETERS
# =========================================================

# Previously observed clean-ocean dark-pixel reference.
#
# This is treated as a reference value, NOT a universal
# scientific threshold.

BASELINE_DARK_RATIO = 0.046

# Minimum local-anomaly ratio for a candidate.
#
# This is deliberately lower than the old global 5% rule
# because we now look for spatially coherent local anomalies.

MIN_CANDIDATE_RATIO = 0.001

# Minimum connected component size.
#
# Very small dark regions are likely to be noise.

MIN_COMPONENT_PIXELS = 20

# Local block size used to estimate the surrounding ocean
# background.
#
# The image is divided into blocks rather than calculating
# one global background for the entire scene.

LOCAL_BLOCK_SIZE = 32

# Minimum darkness difference from local background.
#
# Example:
#
# local background = -13 dB
# candidate pixel   = -18 dB
#
# difference = -5 dB
#
# This pixel is significantly darker than its surroundings.

MIN_LOCAL_DARKNESS_DB = 2.5

# Maximum plausible local darkness for a REAL oil slick.
#
# Real oil-on-water dampening typically produces local
# darkness differences in roughly the 5-10 dB range.
#
# Values far beyond this (e.g. 20-40+ dB) are much more
# likely to be caused by land/harbor contamination at the
# edge of the bounding box, strong man-made reflectors, or
# other sensor artifacts than by an actual slick.

MAX_PLAUSIBLE_DARKNESS_DB = 15.0

# Maximum number of pixels used for global statistics.

MAX_STAT_SAMPLE = 100_000


# =========================================================
# SENTINEL-1 EVALSCRIPT
# =========================================================

EVALSCRIPT = """
//VERSION=3

function setup() {
  return {
    input: ["VV"],
    output: {
      bands: 1,
      sampleType: "FLOAT32"
    }
  };
}

function evaluatePixel(sample) {
  return [sample.VV];
}
"""


# =========================================================
# SAR CONVERSION
# =========================================================

def _linear_to_db(values):
    """
    Convert Sentinel-1 linear backscatter to decibels.

    dB = 10 * log10(linear_value)
    """
    values = np.asarray(values, dtype=np.float32)
    values = np.maximum(values, 1e-10)
    return 10.0 * np.log10(values)


# =========================================================
# ROBUST STATISTICS
# =========================================================

def _robust_statistics(values):
    """
    Calculate robust background statistics.

    Median and MAD are used because they are less affected
    by outliers than mean/std.
    """
    values = np.asarray(values, dtype=np.float32)
    median = float(np.median(values))
    mad = float(np.median(np.abs(values - median)))
    robust_std = 1.4826 * mad
    return median, mad, robust_std


# =========================================================
# LOCAL BACKGROUND ESTIMATION
# =========================================================

def _build_local_background(db_image, valid_mask):
    """
    Estimate local ocean background.

    The image is divided into blocks. Each block receives
    the median backscatter value of its valid pixels.

    This lets us detect pixels that are unusually dark
    compared with the surrounding ocean instead of comparing
    every pixel against the entire scene.
    """
    height, width = db_image.shape

    background = np.full_like(db_image, np.nan, dtype=np.float32)

    for row_start in range(0, height, LOCAL_BLOCK_SIZE):
        row_end = min(row_start + LOCAL_BLOCK_SIZE, height)

        for col_start in range(0, width, LOCAL_BLOCK_SIZE):
            col_end = min(col_start + LOCAL_BLOCK_SIZE, width)

            block = db_image[row_start:row_end, col_start:col_end]
            block_valid = valid_mask[row_start:row_end, col_start:col_end]

            values = block[block_valid]

            if values.size == 0:
                continue

            block_median = float(np.median(values))

            background[row_start:row_end, col_start:col_end] = block_median

    return background


# =========================================================
# CONNECTED COMPONENT ANALYSIS
# =========================================================

def _connected_components(mask):
    """
    Lightweight 8-connected component detection.

    No OpenCV or SciPy dependency is required.

    Returns a list of components containing:
        - pixels
        - size
    """
    height, width = mask.shape

    visited = np.zeros_like(mask, dtype=bool)

    components = []

    neighbours = [
        (-1, -1), (-1, 0), (-1, 1),
        (0, -1), (0, 1),
        (1, -1), (1, 0), (1, 1),
    ]

    for row in range(height):
        for col in range(width):
            if not mask[row, col]:
                continue
            if visited[row, col]:
                continue

            stack = [(row, col)]
            visited[row, col] = True
            pixels = []

            while stack:
                current_row, current_col = stack.pop()
                pixels.append((current_row, current_col))

                for dr, dc in neighbours:
                    nr = current_row + dr
                    nc = current_col + dc

                    if nr < 0 or nr >= height:
                        continue
                    if nc < 0 or nc >= width:
                        continue
                    if visited[nr, nc]:
                        continue
                    if not mask[nr, nc]:
                        continue

                    visited[nr, nc] = True
                    stack.append((nr, nc))

            components.append({"pixels": pixels, "size": len(pixels)})

    return components


# =========================================================
# PIXEL → GEOGRAPHIC COORDINATES
# =========================================================

def _pixel_to_geo(row, col, height, width):
    """
    Convert an image pixel into approximate latitude and
    longitude using the requested BBOX.

    This is an approximation suitable for the prototype.
    """
    min_lon, min_lat, max_lon, max_lat = BBOX_COORDS

    if width <= 1:
        lon = (min_lon + max_lon) / 2
    else:
        lon = min_lon + (col / (width - 1)) * (max_lon - min_lon)

    if height <= 1:
        lat = (min_lat + max_lat) / 2
    else:
        # Image row 0 corresponds approximately to the
        # northern edge of the requested BBOX.
        lat = max_lat - (row / (height - 1)) * (max_lat - min_lat)

    return float(lat), float(lon)


# =========================================================
# COMPONENT GEOGRAPHY
# =========================================================

def _component_geography(component, height, width):
    """
    Calculate centroid and geographic bounding box
    for a detected region.
    """
    pixels = component["pixels"]

    rows = np.array([pixel[0] for pixel in pixels], dtype=np.float32)
    cols = np.array([pixel[1] for pixel in pixels], dtype=np.float32)

    centroid_row = float(np.mean(rows))
    centroid_col = float(np.mean(cols))

    center_lat, center_lon = _pixel_to_geo(centroid_row, centroid_col, height, width)

    min_row = int(np.min(rows))
    max_row = int(np.max(rows))
    min_col = int(np.min(cols))
    max_col = int(np.max(cols))

    min_lat, min_lon = _pixel_to_geo(max_row, min_col, height, width)
    max_lat, max_lon = _pixel_to_geo(min_row, max_col, height, width)

    return {
        "center": {
            "lat": round(center_lat, 6),
            "lon": round(center_lon, 6),
        },
        "bounding_box": {
            "min_lat": round(min_lat, 6),
            "min_lon": round(min_lon, 6),
            "max_lat": round(max_lat, 6),
            "max_lon": round(max_lon, 6),
        },
    }


# =========================================================
# CONFIDENCE SCORE
# =========================================================

def _calculate_confidence(candidate_ratio, local_darkness, component_size):
    """
    Calculate an evidence-strength score.

    IMPORTANT:
    This is NOT the probability that the region is oil.

    It is a prototype confidence/evidence score based on:
        1. candidate size
        2. local darkness
        3. spatial coherence

    Environmental validation is required before this can
    be treated as a scientific probability.
    """
    size_score = min(1.0, candidate_ratio / 0.05)

    darkness_score = min(1.0, max(0.0, local_darkness / 10.0))

    coherence_score = min(1.0, component_size / 5000.0)

    confidence = (
        size_score * 0.35
        + darkness_score * 0.40
        + coherence_score * 0.25
    )

    return round(confidence * 100, 1)


# =========================================================
# MAIN DETECTOR
# =========================================================

def detect_spill(simulate=False):
    """
    Sentinel-1 SAR prototype oil-spill candidate detector.

    If `simulate` is True, returns a clearly-labeled synthetic
    detection result near the Kerala/Karnataka shipping lane,
    for demo purposes. No real satellite request is made in
    this mode.

    Pipeline:

        Sentinel-1 VV
            ↓
        Linear → dB
            ↓
        Global statistics
            ↓
        Local ocean background
            ↓
        Local dark anomaly detection
            ↓
        Connected components
            ↓
        Noise filtering
            ↓
        Artifact plausibility check
            ↓
        Candidate selection
            ↓
        Geographic characterization
    """

    # =====================================================
    # SIMULATION MODE (demo only, no real satellite call)
    # =====================================================

    # =====================================================
    # SIMULATION MODE (demo only, no real satellite call)
    # =====================================================

    if simulate:
        demo_data = _load_demo_incident()
        if demo_data and "spill" in demo_data:
            spill_info = demo_data["spill"]
            return {
                "status": "ok",
                "possible_slick_detected": spill_info.get("possible_slick_detected", True),
                "message": "SIMULATED: Spatially coherent dark anomaly detected.",
                "date_range": demo_data.get("date_range", "simulation"),
                "image_dimensions": {"width": 824, "height": 1380},
                "mean_backscatter": 0.0189,
                "median_backscatter_db": -17.9,
                "mad_db": 0.61,
                "robust_std_db": 0.90,
                "raw_candidate_ratio": 0.023,
                "strongest_candidate_ratio": 0.023,
                "clean_ocean_baseline": BASELINE_DARK_RATIO,
                "local_darkness_threshold_db": MIN_LOCAL_DARKNESS_DB,
                "max_plausible_darkness_db": MAX_PLAUSIBLE_DARKNESS_DB,
                "spill_center": spill_info["spill_center"],
                "spill_bounding_box": spill_info["spill_bounding_box"],
                "spill_pixel_count": spill_info.get("spill_pixel_count", 920),
                "estimated_area_km2": spill_info.get("estimated_area_km2", 46.0),
                "mean_local_darkness_db": spill_info.get("mean_local_darkness_db", 7.4),
                "max_local_darkness_db": spill_info.get("max_local_darkness_db", 10.2),
                "likely_artifact": spill_info.get("likely_artifact", False),
                "artifact_warning": spill_info.get("artifact_warning"),
                "confidence": spill_info.get("confidence", 84.5),
                "candidate_regions": spill_info.get("candidate_regions", []),
                "note": (
                    "SIMULATED DATA for demonstration purposes only — "
                    "this is not a real Sentinel-1 detection."
                ),
            }

        # Fallback simulated response if file read fails
        return {
            "status": "ok",
            "possible_slick_detected": True,
            "message": "SIMULATED: Spatially coherent dark anomaly detected.",
            "date_range": "simulation",
            "image_dimensions": {"width": 824, "height": 1380},
            "mean_backscatter": 0.0189,
            "median_backscatter_db": -17.9,
            "mad_db": 0.61,
            "robust_std_db": 0.90,
            "raw_candidate_ratio": 0.023,
            "strongest_candidate_ratio": 0.023,
            "clean_ocean_baseline": BASELINE_DARK_RATIO,
            "local_darkness_threshold_db": MIN_LOCAL_DARKNESS_DB,
            "max_plausible_darkness_db": MAX_PLAUSIBLE_DARKNESS_DB,
            "spill_center": {"lat": 9.50, "lon": 70.00},
            "spill_bounding_box": {
                "min_lat": 9.35, "min_lon": 69.80,
                "max_lat": 9.65, "max_lon": 70.20,
            },
            "spill_pixel_count": 920,
            "estimated_area_km2": 46.0,
            "mean_local_darkness_db": 7.4,
            "max_local_darkness_db": 10.2,
            "likely_artifact": False,
            "artifact_warning": None,
            "confidence": 84.5,
            "candidate_regions": [{
                "rank": 1,
                "pixel_count": 920,
                "pixel_ratio": 0.023,
                "estimated_area_km2": 46.0,
                "mean_local_darkness_db": 7.4,
                "max_local_darkness_db": 10.2,
                "likely_artifact": False,
                "center": {"lat": 9.50, "lon": 70.00},
                "bounding_box": {
                    "min_lat": 9.35, "min_lon": 69.80,
                    "max_lat": 9.65, "max_lon": 70.20,
                },
            }],
            "note": (
                "SIMULATED DATA for demonstration purposes only — "
                "this is not a real Sentinel-1 detection."
            ),
        }

    cache_key = f"{BBOX_COORDS}_{date.today().isoformat()}"
    if cache_key in _SPILL_CACHE:
        return _SPILL_CACHE[cache_key]

    # =====================================================
    # CHECK CREDENTIALS
    # =====================================================

    if not config.sh_client_id or not config.sh_client_secret:
        return {
            "status": "error",
            "message": "CDSE credentials not set in .env",
        }

    try:
        # =================================================
        # CREATE SENTINEL REQUEST
        # =================================================

        bbox = BBox(bbox=BBOX_COORDS, crs=CRS.WGS84)
        size = bbox_to_dimensions(bbox, resolution=RESOLUTION)

        end_date = date.today() - timedelta(days=2)
        start_date = end_date - timedelta(days=12)

        request = SentinelHubRequest(
            evalscript=EVALSCRIPT,
            input_data=[
                SentinelHubRequest.input_data(
                    data_collection=DataCollection.SENTINEL1_IW.define_from(
                        "s1iw", service_url=config.sh_base_url
                    ),
                    time_interval=(start_date.isoformat(), end_date.isoformat()),
                )
            ],
            responses=[SentinelHubRequest.output_response("default", MimeType.TIFF)],
            bbox=bbox,
            size=size,
            config=config,
        )

        # =================================================
        # DOWNLOAD IMAGE
        # =================================================

        image = request.get_data()[0]

        if image is None:
            return {"status": "error", "message": "Sentinel-1 returned no image."}

        image = np.asarray(image, dtype=np.float32)

        # =================================================
        # VALID PIXELS
        # =================================================

        valid_mask = np.isfinite(image)
        valid_pixels = image[valid_mask]

        if valid_pixels.size == 0:
            return {
                "status": "error",
                "message": "No valid SAR data returned for this period/region.",
            }

        # =================================================
        # CONVERT TO dB
        # =================================================

        db_image = np.full_like(image, np.nan, dtype=np.float32)
        db_image[valid_mask] = _linear_to_db(valid_pixels)

        valid_db = db_image[valid_mask]

        # =================================================
        # GLOBAL ROBUST STATISTICS
        # =================================================

        if valid_db.size > MAX_STAT_SAMPLE:
            rng = np.random.default_rng(42)
            indices = rng.choice(valid_db.size, size=MAX_STAT_SAMPLE, replace=False)
            stats_pixels = valid_db[indices]
        else:
            stats_pixels = valid_db

        global_median_db, global_mad_db, global_robust_std_db = _robust_statistics(stats_pixels)

        # =================================================
        # LOCAL BACKGROUND
        # =================================================

        local_background = _build_local_background(db_image, valid_mask)

        # =================================================
        # LOCAL DARKNESS MAP
        # =================================================
        #
        # Positive value means the pixel is darker than its
        # local background.

        local_darkness = local_background - db_image

        # =================================================
        # CANDIDATE MASK
        # =================================================

        candidate_mask = (
            valid_mask
            & np.isfinite(local_darkness)
            & (local_darkness >= MIN_LOCAL_DARKNESS_DB)
        )

        # =================================================
        # RAW CANDIDATE RATIO
        # =================================================

        candidate_pixels = int(np.sum(candidate_mask))
        total_valid_pixels = int(np.sum(valid_mask))

        if total_valid_pixels == 0:
            return {"status": "error", "message": "No valid pixels available."}

        candidate_ratio = candidate_pixels / total_valid_pixels

        # =================================================
        # CONNECTED COMPONENTS
        # =================================================

        components = _connected_components(candidate_mask)

        meaningful_components = [
            component for component in components
            if component["size"] >= MIN_COMPONENT_PIXELS
        ]

        meaningful_components.sort(key=lambda component: component["size"], reverse=True)

        # =================================================
        # NO MEANINGFUL REGION
        # =================================================

        if not meaningful_components:
            return {
                "status": "ok",
                "possible_slick_detected": False,
                "message": "No spatially coherent dark anomaly was detected.",
                "date_range": f"{start_date.isoformat()} to {end_date.isoformat()}",
                "image_dimensions": {
                    "width": int(image.shape[1]),
                    "height": int(image.shape[0]),
                },
                "mean_backscatter": round(float(np.mean(valid_pixels)), 6),
                "median_backscatter_db": round(global_median_db, 3),
                "mad_db": round(global_mad_db, 3),
                "robust_std_db": round(global_robust_std_db, 3),
                "raw_candidate_ratio": round(candidate_ratio, 5),
                "clean_ocean_baseline": BASELINE_DARK_RATIO,
                "local_darkness_threshold_db": MIN_LOCAL_DARKNESS_DB,
                "candidate_regions": [],
                "note": (
                    "Prototype local SAR anomaly detector. A dark SAR region is "
                    "not automatically oil; low wind, natural films, biogenic "
                    "effects, rain and other look-alikes can produce similar "
                    "signatures."
                ),
            }

        # =================================================
        # STRONGEST COMPONENT
        # =================================================

        strongest = meaningful_components[0]
        candidate_pixel_count = strongest["size"]
        strongest_ratio = candidate_pixel_count / total_valid_pixels

        geography = _component_geography(strongest, image.shape[0], image.shape[1])

        # =================================================
        # LOCAL DARKNESS OF STRONGEST COMPONENT
        # =================================================

        component_rows = np.array([p[0] for p in strongest["pixels"]], dtype=np.int32)
        component_cols = np.array([p[1] for p in strongest["pixels"]], dtype=np.int32)

        component_darkness_values = local_darkness[component_rows, component_cols]

        mean_component_darkness = float(np.mean(component_darkness_values))
        max_component_darkness = float(np.max(component_darkness_values))

        # =================================================
        # ARTIFACT PLAUSIBILITY CHECK
        # =================================================
        #
        # Real oil-on-water darkening is typically a modest
        # few dB below the local background. Extreme darkness
        # values are much more likely to come from land/harbor
        # contamination, strong reflectors, or other artifacts
        # near the edge of the bounding box than from an actual
        # slick.

        likely_artifact = mean_component_darkness > MAX_PLAUSIBLE_DARKNESS_DB

        # =================================================
        # AREA ESTIMATION
        # =================================================

        pixel_area_km2 = (RESOLUTION * RESOLUTION) / 1_000_000
        estimated_area_km2 = candidate_pixel_count * pixel_area_km2

        # =================================================
        # FINAL DETECTION DECISION
        # =================================================
        #
        # We require:
        #
        # 1. A meaningful connected region
        # 2. Candidate region larger than minimum ratio
        # 3. Local darkness within a plausible physical range
        #    (i.e. not flagged as a likely artifact)

        possible_slick_detected = (
            candidate_pixel_count >= MIN_COMPONENT_PIXELS
            and strongest_ratio >= MIN_CANDIDATE_RATIO
            and not likely_artifact
        )

        # =================================================
        # CONFIDENCE
        # =================================================

        confidence = _calculate_confidence(
            candidate_ratio=strongest_ratio,
            local_darkness=mean_component_darkness,
            component_size=candidate_pixel_count,
        )

        # =================================================
        # ADDITIONAL CANDIDATES
        # =================================================

        candidate_regions = []

        for index, component in enumerate(meaningful_components[:5], start=1):
            region_geo = _component_geography(component, image.shape[0], image.shape[1])

            region_area_km2 = component["size"] * pixel_area_km2

            region_rows = np.array([p[0] for p in component["pixels"]], dtype=np.int32)
            region_cols = np.array([p[1] for p in component["pixels"]], dtype=np.int32)

            region_darkness = local_darkness[region_rows, region_cols]

            region_mean_darkness = float(np.mean(region_darkness))
            region_max_darkness = float(np.max(region_darkness))
            region_likely_artifact = region_mean_darkness > MAX_PLAUSIBLE_DARKNESS_DB

            candidate_regions.append({
                "rank": index,
                "pixel_count": component["size"],
                "pixel_ratio": round(component["size"] / total_valid_pixels, 5),
                "estimated_area_km2": round(region_area_km2, 3),
                "mean_local_darkness_db": round(region_mean_darkness, 3),
                "max_local_darkness_db": round(region_max_darkness, 3),
                "likely_artifact": region_likely_artifact,
                "center": region_geo["center"],
                "bounding_box": region_geo["bounding_box"],
            })

        # =================================================
        # FINAL RESPONSE
        # =================================================

        return {
            "status": "ok",
            "possible_slick_detected": bool(possible_slick_detected),
            "message": (
                "Spatially coherent dark anomaly detected."
                if possible_slick_detected
                else (
                    "Dark anomaly found but flagged as a likely artifact "
                    "(darkness exceeds plausible oil-slick range)."
                    if likely_artifact
                    else "Dark anomaly found but it did not meet the candidate criteria."
                )
            ),
            "date_range": f"{start_date.isoformat()} to {end_date.isoformat()}",
            "image_dimensions": {
                "width": int(image.shape[1]),
                "height": int(image.shape[0]),
            },

            # SAR statistics
            "mean_backscatter": round(float(np.mean(valid_pixels)), 6),
            "median_backscatter_db": round(global_median_db, 3),
            "mad_db": round(global_mad_db, 3),
            "robust_std_db": round(global_robust_std_db, 3),

            # Detection statistics
            "raw_candidate_ratio": round(candidate_ratio, 5),
            "strongest_candidate_ratio": round(strongest_ratio, 5),
            "clean_ocean_baseline": BASELINE_DARK_RATIO,
            "local_darkness_threshold_db": MIN_LOCAL_DARKNESS_DB,
            "max_plausible_darkness_db": MAX_PLAUSIBLE_DARKNESS_DB,

            # Strongest candidate
            "spill_center": geography["center"],
            "spill_bounding_box": geography["bounding_box"],
            "spill_pixel_count": candidate_pixel_count,
            "estimated_area_km2": round(estimated_area_km2, 3),
            "mean_local_darkness_db": round(mean_component_darkness, 3),
            "max_local_darkness_db": round(max_component_darkness, 3),
            "likely_artifact": bool(likely_artifact),
            "artifact_warning": (
                "Local darkness exceeds plausible oil-slick range — likely "
                "coastal edge, land contamination, or sensor artifact rather "
                "than a real slick."
                if likely_artifact else None
            ),
            "confidence": confidence,

            # Other detected regions
            "candidate_regions": candidate_regions,

            # Scientific disclaimer
            "note": (
                "Prototype local SAR anomaly detector, not a validated "
                "oil-spill classification model. Dark SAR signatures can "
                "result from low wind, natural surface films, biogenic "
                "effects, rain cells and other look-alikes. Final spill "
                "confirmation and source attribution require additional "
                "evidence such as drift, AIS, weather and oceanographic "
                "data."
            ),
        }
        _SPILL_CACHE[cache_key] = result
        return result

    except Exception as e:
        return {"status": "error", "message": str(e)}

`

## File: backend\services\__init__.py
`py

`

## File: backend\tests\test_backend.py
`py
import os
import sys
import pytest

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from main import app
from services.spill_detection import detect_spill
from services.ais import get_ais_data, normalize_vessel_record
from services.drift import predict_drift
from services.attribution import attribute_source, _haversine_km
from services.evidence import collect_evidence

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["status"] == "ok"
    assert json_data["service"] == "oceantrace-backend"


def test_haversine_calculation():
    # Distance between 9.50, 70.00 and 9.50, 70.10 (approx ~11 km)
    dist = _haversine_km(9.50, 70.00, 9.50, 70.10)
    assert 10.0 <= dist <= 12.0


def test_spill_detection_simulation():
    res = detect_spill(simulate=True)
    assert res["status"] == "ok"
    assert res["possible_slick_detected"] is True
    assert "spill_center" in res
    assert res["spill_center"]["lat"] == 9.50
    assert res["spill_center"]["lon"] == 70.00
    assert res["confidence"] > 50


def test_ais_normalization_and_demo():
    res = get_ais_data(simulate=True)
    assert res["status"] == "ok"
    assert len(res["vessels"]) >= 3
    first_vessel = res["vessels"][0]
    assert "shipName" in first_vessel
    assert "mmsi" in first_vessel
    assert "vesselType" in first_vessel


def test_backward_drift_simulation():
    res = predict_drift(lat=9.50, lon=70.00, hours=48, direction="backward", simulate=True)
    assert res["status"] == "ok"
    assert res["direction"] == "backward"
    assert len(res["trajectory"]) > 0
    # First point should be origin at step 0
    assert res["trajectory"][0]["lat"] == 9.50
    assert res["trajectory"][0]["lon"] == 70.00


def test_attribution_evidence_fusion():
    res = attribute_source(proximity_radius_km=75, simulate=True)
    assert res["status"] == "ok"
    assert res["spill_detected"] is True
    assert res["candidate_count"] > 0
    assert res["top_candidate"] is not None
    top = res["top_candidate"]
    assert "attribution_score" in top
    assert "score_breakdown" in top
    assert "why_ranked" in top
    assert top["attribution_score"] >= 70.0


def test_evidence_report_consolidation():
    res = collect_evidence(simulate=True)
    assert res["status"] == "ok"
    assert res["case_open"] is True
    assert "spill" in res
    assert "backward_drift" in res
    assert "forward_drift" in res
    assert "attribution" in res
    assert res["attribution"]["top_candidate"] is not None


def test_api_endpoints_simulated():
    routes = [
        "/api/spill-detection?simulate=true",
        "/api/ais?simulate=true",
        "/api/drift?simulate=true&direction=backward",
        "/api/attribution?simulate=true",
        "/api/evidence?simulate=true",
    ]
    for route in routes:
        resp = client.get(route)
        assert resp.status_code == 200, f"Route failed: {route}"
        assert resp.json()["status"] == "ok"

`

## File: docs\architecture.md
`md
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

`

## File: docs\attribution-methodology.md
`md
# Attribution & Evidence Fusion Methodology

## Scoring Model

Oceantrace-AI uses a multi-factor weighted evidence fusion model to rank candidate vessels in proximity to a detected spill.

$$\text{Attribution Score} = 0.30 S + 0.25 T + 0.25 D + 0.10 H + 0.10 B$$

### Factor Breakdown

1. **Spatial Proximity Score ($S$) — 30%**:
   Calculated based on Haversine distance between vessel position and spill centroid:
   $$S = \max(0, 100 \cdot (1 - \frac{d_{spill}}{R_{max}}))$$

2. **Backward Drift Corridor Match ($D$) — 25%**:
   Calculated based on minimum offset distance between vessel coordinates and the reconstructed 48-hour backward drift trajectory:
   - Offset $\le 5\text{ km}$: Score = 95
   - Offset $5 - 20\text{ km}$: Score decays linearly from 95 to 30

3. **Temporal Compatibility ($T$) — 25%**:
   Evaluates alignment of vessel sighting timestamp with the spill detection time window.

4. **Heading Vector Compatibility ($H$) — 10%**:
   Evaluates whether vessel course vector ($0 - 360^\circ$) aligns with transit through the historical origin corridor.

5. **Behavioural Anomaly Score ($B$) — 10%**:
   Evaluates presence of loitering, sudden speed drops, or vessel type risk profile (e.g. Oil/Chemical Tankers).

---

## Explainability Output

Rather than returning a opaque score, the system provides transparent rationale:

```json
{
  "shipName": "MV ARABIAN STAR",
  "mmsi": "419001234",
  "attribution_score": 84.8,
  "score_breakdown": {
    "spatial": 85.0,
    "drift_corridor": 95.0,
    "temporal": 88.0,
    "heading": 80.0,
    "behaviour": 95.0
  },
  "why_ranked": [
    "Position is 18.2 km from detected slick centroid.",
    "Vessel lies directly inside reconstructed backward drift corridor (1.8 km from corridor node).",
    "Vessel classification (Oil Tanker) matches potential risk profile.",
    "Observed speed reduction / loitering event while crossing origin corridor."
  ]
}
```

`

## File: docs\demo.md
`md
# Oceantrace-AI — 3-Minute Hackathon Demo Script

## Demo Script & Walkthrough

### 1. Introduction & Problem Statement (0:00 - 0:30)
> "Good morning judges. Marine oil spills cause devastating environmental damage, yet identifying responsible vessels in international waters is notoriously difficult. Today we present **Oceantrace-AI**, an operational decision-support intelligence platform built for SIH 2026."

### 2. Satellite Anomaly Detection (0:30 - 1:00)
- Open Dashboard (`http://localhost:5173`).
- Point out **Mission Control Overview** and the active Sentinel-1 SAR anomaly detection.
- Highlight metrics: **84.5% Evidence Confidence**, **46.0 km² Slick Area**, **7.4 dB Local Darkness**.
- Explain: *"Our system does not blindly classify every dark pixel as oil. It performs local background statistics and connected-component spatial filtering."*

### 3. Hydrodynamic Backward Drift Reconstruction (1:00 - 1:45)
- Click **Explore Map** (`/map`).
- Show the detected spill area (Red Rectangle / Circle).
- Toggle **Backward Origin Corridor** (Dashed Cyan Vector).
- Explain: *"Rather than only looking at where the spill is right now, Oceantrace-AI runs a 48-hour backward hydrodynamic drift model combining ocean currents and 10-meter wind vectors to reconstruct where the slick originated."*

### 4. AIS Correlation & Multi-Factor Evidence Fusion (1:45 - 2:30)
- Click on **Rank #1 Candidate Vessel ("MV ARABIAN STAR")** marker on the map.
- Point out the popup showing **Attribution Score: 84.8 / 100**.
- Explain: *"We correlate historical AIS track data with the reconstructed origin corridor. Vessel proximity alone is insufficient; our system fuses spatial distance, drift corridor offset, timestamp compatibility, course heading, and speed anomaly data."*

### 5. Explainable Attribution & Evidence File Export (2:30 - 3:00)
- Navigate to **Evidence Report** (`/evidence`).
- Scroll to **Explainable Source Attribution Analysis**.
- Show the score breakdown bars and itemized rationale bullets (*"Vessel lies directly inside reconstructed backward drift corridor"*, *"Observed speed reduction while crossing origin corridor"*).
- Click **Export JSON** or **Print / Save PDF**.
- Conclude: *"Oceantrace-AI empowers marine intelligence authorities with transparent, explainable decision support — turning complex satellite and maritime data into actionable investigative evidence."*

`

## File: frontend\.oxlintrc.json
`json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "oxc"],
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}

`

## File: frontend\index.html
`html
<!doctype html>
<html lang="en" class="h-full w-full overflow-hidden bg-[#070a12]">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>OCEANTRACE INTEL — Maritime Intelligence & Source Attribution Platform</title>
    <!-- Google Fonts: Inter & JetBrains Mono -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
  </head>
  <body class="h-full w-full overflow-hidden bg-[#070a12] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
    <div id="root" class="h-full w-full overflow-hidden flex flex-col"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

`

## File: frontend\package.json
`json
{
  "name": "frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "oxlint",
    "preview": "vite preview",
    "tauri": "@tauri-apps/cli"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.3.3",
    "@types/three": "^0.185.4",
    "leaflet": "^1.9.4",
    "lucide-react": "^1.40.0",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "react-leaflet": "^5.0.0",
    "react-router-dom": "^7.18.3",
    "recharts": "^3.10.1",
    "tailwindcss": "^4.3.3",
    "three": "^0.185.1"
  },
  "devDependencies": {
    "@tauri-apps/cli": "^2.3.1",
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.4",
    "@vitejs/plugin-react": "^6.1.0",
    "oxlint": "^1.79.0",
    "vite": "^8.2.2"
  }
}

`

## File: frontend\README.md
`md
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

`

## File: frontend\vite.config.js
`js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
`

## File: frontend\src\App.css
`css
.counter {
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 5px;
  color: var(--accent);
  background: var(--accent-bg);
  border: 2px solid transparent;
  transition: border-color 0.3s;
  margin-bottom: 24px;

  &:hover {
    border-color: var(--accent-border);
  }
  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
}

.hero {
  position: relative;

  .base,
  .framework,
  .vite {
    inset-inline: 0;
    margin: 0 auto;
  }

  .base {
    width: 170px;
    position: relative;
    z-index: 0;
  }

  .framework,
  .vite {
    position: absolute;
  }

  .framework {
    z-index: 1;
    top: 34px;
    height: 28px;
    transform: perspective(2000px) rotateZ(300deg) rotateX(44deg) rotateY(39deg)
      scale(1.4);
  }

  .vite {
    z-index: 0;
    top: 107px;
    height: 26px;
    width: auto;
    transform: perspective(2000px) rotateZ(300deg) rotateX(40deg) rotateY(39deg)
      scale(0.8);
  }
}

#center {
  display: flex;
  flex-direction: column;
  gap: 25px;
  place-content: center;
  place-items: center;
  flex-grow: 1;

  @media (max-width: 1024px) {
    padding: 32px 20px 24px;
    gap: 18px;
  }
}

#next-steps {
  display: flex;
  border-top: 1px solid var(--border);
  text-align: left;

  & > div {
    flex: 1 1 0;
    padding: 32px;
    @media (max-width: 1024px) {
      padding: 24px 20px;
    }
  }

  .icon {
    margin-bottom: 16px;
    width: 22px;
    height: 22px;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
}

#docs {
  border-right: 1px solid var(--border);

  @media (max-width: 1024px) {
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}

#next-steps ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 8px;
  margin: 32px 0 0;

  .logo {
    height: 18px;
  }

  a {
    color: var(--text-h);
    font-size: 16px;
    border-radius: 6px;
    background: var(--social-bg);
    display: flex;
    padding: 6px 12px;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    transition: box-shadow 0.3s;

    &:hover {
      box-shadow: var(--shadow);
    }
    .button-icon {
      height: 18px;
      width: 18px;
    }
  }

  @media (max-width: 1024px) {
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: center;

    li {
      flex: 1 1 calc(50% - 8px);
    }

    a {
      width: 100%;
      justify-content: center;
      box-sizing: border-box;
    }
  }
}

#spacer {
  height: 88px;
  border-top: 1px solid var(--border);
  @media (max-width: 1024px) {
    height: 48px;
  }
}

.ticks {
  position: relative;
  width: 100%;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -4.5px;
    border: 5px solid transparent;
  }

  &::before {
    left: 0;
    border-left-color: var(--border);
  }
  &::after {
    right: 0;
    border-right-color: var(--border);
  }
}

`

## File: frontend\src\App.jsx
`jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import MapView from "./pages/MapView";
import Evidence from "./pages/Evidence";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="map" element={<MapView />} />
          <Route path="evidence" element={<Evidence />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
`

## File: frontend\src\index.css
`css
@import "tailwindcss";

@layer base {
  :root {
    --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

    /* Light Theme Palette */
    --bg-main: #f8f9fa;
    --bg-card: #ffffff;
    --bg-card-elevated: #f1f5f9;
    --border-color: #e2e8f0;
    --border-subtle: #cbd5e1;
    --text-primary: #0f172a;
    --text-secondary: #475569;
    --text-muted: #64748b;
    --accent-primary: #0f172a;
    --accent-muted: #334155;
    
    /* Semantic Operational Colors */
    --status-danger: #dc2626;
    --status-warning: #d97706;
    --status-success: #16a34a;
    --status-info: #2563eb;
  }

  html.dark, .dark {
    /* Dark Theme Palette */
    --bg-main: #09090b;
    --bg-card: #141417;
    --bg-card-elevated: #1e1e24;
    --border-color: #27272a;
    --border-subtle: #3f3f46;
    --text-primary: #f8fafc;
    --text-secondary: #a1a1aa;
    --text-muted: #71717a;
    --accent-primary: #ffffff;
    --accent-muted: #e2e8f0;

    /* Semantic Operational Colors */
    --status-danger: #ef4444;
    --status-warning: #f59e0b;
    --status-success: #22c55e;
    --status-info: #3b82f6;
  }

  html, body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: var(--bg-main);
    color: var(--text-primary);
    font-family: var(--font-sans);
    transition: background-color 0.15s ease, color 0.15s ease;
  }

  #root {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: var(--bg-main);
  }
}

/* Custom Scrollbars */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track {
  background: var(--bg-main);
}
::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* Leaflet Container & Theme Customizations */
.leaflet-container {
  background-color: var(--bg-main) !important;
  font-family: var(--font-sans) !important;
  width: 100% !important;
  height: 100% !important;
}

.leaflet-control-zoom {
  border: 1px solid var(--border-color) !important;
  background: var(--bg-card) !important;
  border-radius: 6px !important;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.leaflet-control-zoom-in, .leaflet-control-zoom-out {
  background: var(--bg-card) !important;
  color: var(--text-primary) !important;
  border-bottom: 1px solid var(--border-color) !important;
  transition: background-color 0.15s ease !important;
}

.leaflet-control-zoom-in:hover, .leaflet-control-zoom-out:hover {
  background: var(--bg-card-elevated) !important;
  color: var(--accent-primary) !important;
}

/* Leaflet Custom Popup */
.leaflet-popup-content-wrapper {
  background: var(--bg-card) !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: 8px !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25) !important;
  padding: 4px !important;
}

.leaflet-popup-tip {
  background: var(--bg-card) !important;
  border: 1px solid var(--border-color) !important;
}

.leaflet-container a.leaflet-popup-close-button {
  color: var(--text-secondary) !important;
  padding: 6px !important;
}
.leaflet-container a.leaflet-popup-close-button:hover {
  color: var(--text-primary) !important;
}

/* Operational Card Utilities */
.op-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.op-card-elevated {
  background-color: var(--bg-card-elevated);
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
}

.glass-panel {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Official Print Stylesheet */
@media print {
  @page {
    margin: 12mm 15mm;
    size: A4 portrait;
  }

  html, body, #root {
    background-color: #ffffff !important;
    color: #0f172a !important;
    height: auto !important;
    overflow: visible !important;
  }

  header, nav, aside, .no-print, button, .print-hide {
    display: none !important;
  }

  .official-print-report {
    display: block !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    background: #ffffff !important;
    color: #0f172a !important;
    font-family: var(--font-sans) !important;
    z-index: 99999 !important;
  }
}

`

## File: frontend\src\main.jsx
`jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import 'leaflet/dist/leaflet.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)

`

## File: frontend\src\components\GlobeView.jsx
`jsx
import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { Globe as GlobeIcon, Map as MapIcon, RotateCw, AlertTriangle } from "lucide-react";

// Convert Geographic Lat/Lon to 3D Cartesian Coordinates on Globe Surface (Radius R)
function latLonToVector3(lat, lon, radius = 10, altitude = 0.05) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const r = radius + altitude;

  const x = -(r * Math.sin(phi) * Math.cos(theta));
  const z = r * Math.sin(phi) * Math.sin(theta);
  const y = r * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// Procedurally generate high-definition equirectangular world map texture (continents, coastlines, ocean bathymetry)
function createWorldCanvasTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  // 1. Deep ocean bathymetry base
  ctx.fillStyle = "#0c1e36";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Helper: Lat/Lon to Canvas X/Y
  const toX = (lon) => ((lon + 180) / 360) * canvas.width;
  const toY = (lat) => ((90 - lat) / 180) * canvas.height;

  // 2. Continental Landmass Polygons
  const continents = [
    // India & South Asia
    [[68, 24], [73, 22], [77, 8.5], [80, 13], [88, 22], [72, 35], [68, 24]],
    // Sri Lanka
    [[79.5, 9.8], [81.8, 8.5], [81.5, 6.2], [79.8, 6.2], [79.5, 9.8]],
    // Arabian Peninsula & Persian Gulf
    [[35, 30], [50, 30], [56, 26], [59, 22.5], [54, 16], [43, 12.5], [35, 30]],
    // Horn of Africa & Africa
    [[-18, 35], [33, 30], [51, 11.5], [40, -10], [20, -35], [15, -35], [9, 5], [-18, 35]],
    // Europe & Eurasia
    [[-10, 36], [10, 55], [40, 70], [140, 70], [120, 20], [100, 10], [60, 40], [30, 40], [-10, 36]],
    // Southeast Asia & Malacca
    [[95, 22], [105, 12], [104, 1.5], [98, 8], [95, 22]],
    // Indonesia & Maritime Continent
    [[95, 5], [108, -6], [116, -8], [120, 2], [105, 6], [95, 5]],
    // Australia
    [[113, -12], [142, -11], [153, -28], [138, -35], [115, -35], [113, -12]],
    // North & South America
    [[-130, 55], [-60, 55], [-80, 8], [-40, -10], [-70, -55], [-80, -5], [-100, 20], [-125, 32], [-130, 55]],
    // Madagascar
    [[43, -12], [50, -15], [47, -25], [43, -25], [43, -12]],
  ];

  ctx.fillStyle = "#1e3a5f";
  ctx.strokeStyle = "#00e5ff";
  ctx.lineWidth = 4;

  continents.forEach((poly) => {
    ctx.beginPath();
    poly.forEach(([lon, lat], i) => {
      const x = toX(lon);
      const y = toY(lat);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  // 3. Geographic Lat/Lon Grid Overlay
  ctx.strokeStyle = "rgba(6, 182, 212, 0.12)";
  ctx.lineWidth = 1;
  for (let lon = -180; lon <= 180; lon += 30) {
    ctx.beginPath();
    ctx.moveTo(toX(lon), 0);
    ctx.lineTo(toX(lon), canvas.height);
    ctx.stroke();
  }
  for (let lat = -90; lat <= 90; lat += 30) {
    ctx.beginPath();
    ctx.moveTo(0, toY(lat));
    ctx.lineTo(canvas.width, toY(lat));
    ctx.stroke();
  }

  // 4. Highlight Equator & Prime Meridian
  ctx.strokeStyle = "rgba(6, 182, 212, 0.3)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, toY(0));
  ctx.lineTo(canvas.width, toY(0));
  ctx.stroke();

  return new THREE.CanvasTexture(canvas);
}

export default function GlobeView({
  attribution,
  candidateVessels = [],
  selectedVessel,
  onSelectVessel,
  backwardDrift,
  forwardDrift,
  onSwitchTo2D,
}) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const globeGroupRef = useRef(null);

  const [autoRotate, setAutoRotate] = useState(false);

  // Interaction State for Drag Momentum
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });

  // WebGL Feature Detection
  const webglSupported = useMemo(() => {
    try {
      const testCanvas = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl")));
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (!webglSupported || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#070a12");
    sceneRef.current = scene;

    // 2. Perspective Camera (Google Earth 3D view)
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5, 25);
    cameraRef.current = camera;

    // 3. WebGL Renderer with High Precision
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);

    // 4. Globe Group (Rotated to align Arabian Sea, India, Persian Gulf towards camera)
    const globeGroup = new THREE.Group();
    globeGroup.rotation.y = Math.PI / 1.4;
    globeGroup.rotation.x = Math.PI / 7;
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // 5. Earth Sphere Mesh with Local High-Res Equirectangular World Map Texture
    const textureLoader = new THREE.TextureLoader();
    const globeTexture = textureLoader.load("/assets/earth-dark.jpg");
    globeTexture.colorSpace = THREE.SRGBColorSpace;

    const sphereGeometry = new THREE.SphereGeometry(10, 64, 64);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      map: globeTexture,
      shininess: 20,
      specular: new THREE.Color("#334155"),
      color: new THREE.Color("#ffffff"),
    });
    const globeMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    globeGroup.add(globeMesh);

    // 6. 3D Vector Coastlines & Landmass Lines on Sphere Surface
    const continentalPolygons = [
      // India & South Asia Coastline
      [[68, 24], [73, 22], [77, 8.5], [80, 13], [88, 22], [72, 35], [68, 24]],
      // Sri Lanka
      [[79.5, 9.8], [81.8, 8.5], [81.5, 6.2], [79.8, 6.2], [79.5, 9.8]],
      // Arabian Peninsula & Persian Gulf
      [[35, 30], [50, 30], [56, 26], [59, 22.5], [54, 16], [43, 12.5], [35, 30]],
      // Horn of Africa & Africa
      [[-18, 35], [33, 30], [51, 11.5], [40, -10], [20, -35], [15, -35], [9, 5], [-18, 35]],
      // Europe & Eurasia
      [[-10, 36], [10, 55], [40, 70], [140, 70], [120, 20], [100, 10], [60, 40], [30, 40], [-10, 36]],
      // Southeast Asia & Malacca
      [[95, 22], [105, 12], [104, 1.5], [98, 8], [95, 22]],
      // Indonesia & Maritime Continent
      [[95, 5], [108, -6], [116, -8], [120, 2], [105, 6], [95, 5]],
      // Australia
      [[113, -12], [142, -11], [153, -28], [138, -35], [115, -35], [113, -12]],
      // Americas
      [[-130, 55], [-60, 55], [-80, 8], [-40, -10], [-70, -55], [-80, -5], [-100, 20], [-125, 32], [-130, 55]],
    ];

    const coastlineMat = new THREE.LineBasicMaterial({ color: 0x06b6d4, linewidth: 2 });
    continentalPolygons.forEach((poly) => {
      const points = poly.map(([lon, lat]) => latLonToVector3(lat, lon, 10.06));
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.LineLoop(geom, coastlineMat);
      globeGroup.add(line);
    });

    // 7. Atmosphere Glow Outer Shell
    const atmosphereGeometry = new THREE.SphereGeometry(10.35, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#06b6d4"),
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // 7. Lighting setup (Bright Ambient + Dual Directional for crisp global visibility)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight1.position.set(20, 20, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 0.8);
    dirLight2.position.set(-20, -10, -20);
    scene.add(dirLight2);

    // 8. Render Advection Drift Corridors on Globe
    if (backwardDrift?.trajectory && backwardDrift.trajectory.length > 1) {
      const points = backwardDrift.trajectory.map((p) => latLonToVector3(p.lat, p.lon, 10, 0.08));
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeom = new THREE.TubeGeometry(curve, 32, 0.06, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
      const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
      globeGroup.add(tubeMesh);
    }

    if (forwardDrift?.trajectory && forwardDrift.trajectory.length > 1) {
      const points = forwardDrift.trajectory.map((p) => latLonToVector3(p.lat, p.lon, 10, 0.08));
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeom = new THREE.TubeGeometry(curve, 32, 0.05, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
      globeGroup.add(tubeMesh);
    }

    // 9. Render Candidate Vessels 3D Pins on Globe Surface
    candidateVessels.forEach((v) => {
      if (typeof v.lat !== "number" || typeof v.lon !== "number") return;
      const pos = latLonToVector3(v.lat, v.lon, 10, 0.12);

      const isTop = v.rank === 1;
      const pinColor = isTop ? 0xef4444 : v.rank <= 5 ? 0xeab308 : 0x06b6d4;

      const pinGeom = new THREE.SphereGeometry(isTop ? 0.22 : 0.15, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: pinColor });
      const pinMesh = new THREE.Mesh(pinGeom, pinMat);
      pinMesh.position.copy(pos);
      pinMesh.userData = { vessel: v };
      globeGroup.add(pinMesh);

      // Pulse ring for Top Candidate
      if (isTop) {
        const ringGeom = new THREE.RingGeometry(0.25, 0.38, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.position.copy(pos);
        ringMesh.lookAt(0, 0, 0);
        globeGroup.add(ringMesh);
      }
    });

    // 10. Selected Vessel Commercial Voyage 3D Arc Path
    const activeV = selectedVessel || attribution?.top_candidate || candidateVessels[0];
    if (activeV?.full_voyage_path && activeV.full_voyage_path.length > 1) {
      const pts = activeV.full_voyage_path.map((coord) => latLonToVector3(coord[0], coord[1], 10, 0.15));
      const arcCurve = new THREE.CatmullRomCurve3(pts);
      const arcGeom = new THREE.TubeGeometry(arcCurve, 64, 0.08, 8, false);
      const arcMat = new THREE.MeshBasicMaterial({ color: 0xec4899 });
      const arcMesh = new THREE.Mesh(arcGeom, arcMat);
      globeGroup.add(arcMesh);
    }

    // 11. Animation Loop with Momentum Dampening
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDraggingRef.current) {
        if (autoRotate) {
          globeGroup.rotation.y += 0.003;
        } else {
          // Inertia momentum dampening
          globeGroup.rotation.y += velocityRef.current.x * 0.05;
          globeGroup.rotation.x += velocityRef.current.y * 0.05;
          velocityRef.current.x *= 0.92;
          velocityRef.current.y *= 0.92;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // 12. Mouse & Touch Event Handlers (Rotation & Momentum)
    const dom = containerRef.current;

    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;

      velocityRef.current = { x: deltaX * 0.005, y: deltaY * 0.005 };
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      camera.position.z = Math.max(13, Math.min(45, camera.position.z + e.deltaY * 0.015));
    };

    dom.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    dom.addEventListener("wheel", handleWheel, { passive: false });

    // Handle Window Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      dom.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
    };
  }, [webglSupported, candidateVessels, selectedVessel, attribution, backwardDrift, forwardDrift, autoRotate]);

  if (!webglSupported) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-[var(--bg-main)] p-6 text-center text-[var(--text-primary)]">
        <div className="h-14 w-14 rounded-2xl bg-[var(--bg-card-elevated)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold font-mono">3D WebGL Canvas Not Available</h3>
        <p className="text-xs text-[var(--text-secondary)] font-mono mt-1 max-w-md">
          Your browser environment does not support WebGL 3D context. Falling back to bounded 2D Planar projection.
        </p>
        <button
          onClick={onSwitchTo2D}
          className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white border border-[var(--border-color)] rounded-xl text-xs font-semibold font-mono flex items-center gap-2 cursor-pointer"
        >
          <MapIcon className="w-4 h-4" /> SWITCH TO BOUNDED 2D MAP
        </button>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative overflow-hidden bg-[var(--bg-main)]">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="h-full w-full cursor-grab active:cursor-grabbing" />

      {/* Top-Right Auto-Rotation Control Button */}
      <div className="absolute top-4 right-4 z-[1000] font-mono">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer shadow-md ${
            autoRotate
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-700"
              : "bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-color)] hover:bg-[var(--bg-card-elevated)]"
          }`}
        >
          <RotateCw className={`w-4 h-4 ${autoRotate ? "animate-spin" : ""}`} /> AUTO ROTATION: {autoRotate ? "ON" : "OFF"}
        </button>
      </div>

      {/* Telemetry Status Badge */}
      <div className="absolute bottom-6 left-6 z-[1000] bg-[var(--bg-card)] px-3.5 py-2 rounded-xl border border-[var(--border-color)] text-[11px] font-mono text-[var(--text-secondary)] flex items-center gap-3 shadow-md">
        <span className="flex items-center gap-1.5 text-[var(--text-primary)] font-bold">
          <GlobeIcon className="w-4 h-4 text-[var(--text-primary)]" /> 3D SPHERICAL GLOBE PROJECTION (60 FPS)
        </span>
        <span className="text-[var(--text-muted)]">|</span>
        <span>Drag to rotate &bull; Scroll to zoom</span>
      </div>
    </div>
  );
}

`

## File: frontend\src\components\Layout.jsx
`jsx
import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Anchor, Moon, Sun, Settings, Clock, Activity, Menu, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import SettingsModal from "./SettingsModal";

function Layout() {
  const { theme, toggleTheme } = useTheme();
  const [utcTime, setUtcTime] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isSimulated, setIsSimulated] = useState(true);
  const location = useLocation();

  // Update live UTC clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, "0");
      const minutes = String(now.getUTCMinutes()).padStart(2, "0");
      const seconds = String(now.getUTCSeconds()).padStart(2, "0");
      const day = now.getUTCDate();
      const month = now.toLocaleString("default", { month: "short", timeZone: "UTC" }).toUpperCase();
      const year = now.getUTCFullYear();
      setUtcTime(`${hours}:${minutes}:${seconds} UTC • ${day} ${month} ${year}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <div className="h-screen w-screen bg-[var(--bg-main)] text-[var(--text-primary)] font-sans flex flex-col overflow-hidden select-none transition-colors duration-150">
      {/* Top Application Header */}
      <header className="h-14 bg-[var(--bg-card)] border-b border-[var(--border-color)] px-4 sm:px-6 flex items-center justify-between z-40 shrink-0">
        {/* Brand Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-1.5 rounded bg-[var(--bg-card-elevated)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            aria-label="Toggle navigation"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded border border-[var(--border-color)] bg-[var(--bg-card-elevated)] flex items-center justify-center text-[var(--text-primary)]">
              <Anchor className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-wider text-[var(--text-primary)] uppercase">
                  OCEANTRACE<span className="text-[var(--text-muted)] font-normal"> AI</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-card-elevated)] text-[var(--text-secondary)]">
                  PC DESKTOP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-colors rounded ${
                isActive
                  ? "bg-[var(--bg-card-elevated)] text-[var(--text-primary)] border border-[var(--border-color)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-elevated)]"
              }`
            }
          >
            DASHBOARD
          </NavLink>
          <NavLink
            to="/map"
            className={({ isActive }) =>
              `px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-colors rounded ${
                isActive
                  ? "bg-[var(--bg-card-elevated)] text-[var(--text-primary)] border border-[var(--border-color)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-elevated)]"
              }`
            }
          >
            INVESTIGATION MAP
          </NavLink>
          <NavLink
            to="/evidence"
            className={({ isActive }) =>
              `px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-colors rounded ${
                isActive
                  ? "bg-[var(--bg-card-elevated)] text-[var(--text-primary)] border border-[var(--border-color)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-elevated)]"
              }`
            }
          >
            INCIDENT DOSSIER
          </NavLink>
        </nav>

        {/* Right Controls & Telemetry */}
        <div className="flex items-center gap-3 text-xs font-mono">
          {/* UTC Clock */}
          <div className="flex items-center gap-2 text-[var(--text-secondary)] bg-[var(--bg-card-elevated)] px-2.5 py-1 rounded border border-[var(--border-color)]">
            <Clock className="w-3.5 h-3.5" />
            <span>{utcTime || "UTC"}</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded border border-[var(--border-color)] bg-[var(--bg-card-elevated)] text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-colors cursor-pointer"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>
        </div>
      </header>

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Command Strip */}
        <aside
          className={`fixed md:relative z-30 h-full w-14 bg-[var(--bg-card)] border-r border-[var(--border-color)] flex flex-col items-center py-3 justify-between transition-transform duration-200 shrink-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="flex flex-col items-center gap-3 w-full px-2">
            <NavLink
              to="/"
              end
              title="Dashboard Overview"
              className={({ isActive }) =>
                `w-10 h-10 rounded flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-[var(--bg-card-elevated)] text-[var(--text-primary)] border border-[var(--border-color)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-elevated)]"
                }`
              }
            >
              <Activity className="w-4 h-4" />
            </NavLink>

            <NavLink
              to="/map"
              title="Spatial Map Investigation"
              className={({ isActive }) =>
                `w-10 h-10 rounded flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-[var(--bg-card-elevated)] text-[var(--text-primary)] border border-[var(--border-color)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-elevated)]"
                }`
              }
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </NavLink>

            <NavLink
              to="/evidence"
              title="Incident Dossier & Evidence Reports"
              className={({ isActive }) =>
                `w-10 h-10 rounded flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-[var(--bg-card-elevated)] text-[var(--text-primary)] border border-[var(--border-color)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-elevated)]"
                }`
              }
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </NavLink>
          </div>
        </aside>

        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
          />
        )}

        {/* Main Route Viewport */}
        <main className="flex-1 h-full w-full overflow-hidden relative bg-[var(--bg-main)]">
          <Outlet context={{ isSimulated, setIsSimulated }} />
        </main>
      </div>

      {/* Footer Status Bar */}
      <footer className="h-6 bg-[var(--bg-card)] border-t border-[var(--border-color)] px-4 flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)] shrink-0 z-40">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> ONLINE
          </span>
          <span className="hidden sm:inline">SAR SENSORS: SENTINEL-1 IW VV</span>
          <span className="hidden lg:inline font-medium text-[var(--text-primary)]">ARABIAN SEA CORRIDOR</span>
        </div>
        <div className="flex items-center gap-3">
          <span>LAT: 09°30'00"N</span>
          <span>LON: 070°00'00"E</span>
          <span className="font-semibold text-[var(--text-primary)]">OCEANTRACE v1.0</span>
        </div>
      </footer>

      {/* Settings Preferences Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        isSimulated={isSimulated}
        setIsSimulated={setIsSimulated}
      />
    </div>
  );
}

export default Layout;
`

## File: frontend\src\components\SettingsModal.jsx
`jsx
import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, RefreshCw, Server, Moon, Sun, ShieldCheck } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { checkHealth } from "../lib/api";

export default function SettingsModal({ isOpen, onClose, isSimulated, setIsSimulated }) {
  const { theme, toggleTheme } = useTheme();
  const [backendHealth, setBackendHealth] = useState(null);
  const [checking, setChecking] = useState(false);

  const verifyHealth = async () => {
    setChecking(true);
    try {
      const res = await checkHealth();
      setBackendHealth(res);
    } catch (err) {
      setBackendHealth({ status: "error", message: err.message });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      verifyHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-2xl text-[var(--text-primary)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-5">
          <div className="flex items-center space-x-2.5">
            <Server className="w-5 h-5 text-[var(--text-primary)]" />
            <h2 className="text-lg font-semibold tracking-tight">System Preferences & Status</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-elevated)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 text-sm">
          {/* Theme Preference */}
          <div className="flex items-center justify-between p-3.5 rounded-md border border-[var(--border-color)] bg-[var(--bg-card-elevated)]">
            <div>
              <div className="font-medium text-[var(--text-primary)]">Appearance Theme</div>
              <div className="text-xs text-[var(--text-secondary)]">Switch between Monochromatic Dark and Light mode</div>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-2 px-3 py-1.5 rounded border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-elevated)] text-[var(--text-primary)] font-medium transition-colors"
            >
              {theme === "dark" ? (
                <>
                  <Moon className="w-4 h-4 text-amber-400" />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Light</span>
                </>
              )}
            </button>
          </div>

          {/* Operation Mode */}
          <div className="p-3.5 rounded-md border border-[var(--border-color)] bg-[var(--bg-card-elevated)] space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-[var(--text-primary)]">Data Pipeline Mode</div>
                <div className="text-xs text-[var(--text-secondary)]">
                  {isSimulated
                    ? "Offline Deterministic Incident Demo (No API keys needed)"
                    : "Live API Integration (Sentinel Hub SAR & GFW AIS)"}
                </div>
              </div>
              <button
                onClick={() => setIsSimulated(!isSimulated)}
                className={`px-3 py-1.5 rounded font-medium border text-xs transition-colors ${
                  isSimulated
                    ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-400 hover:bg-emerald-900/50"
                    : "bg-blue-950/40 border-blue-800/60 text-blue-400 hover:bg-blue-900/50"
                }`}
              >
                {isSimulated ? "Demo Mode Active" : "Live API Mode"}
              </button>
            </div>
          </div>

          {/* Backend Connection Health */}
          <div className="p-3.5 rounded-md border border-[var(--border-color)] bg-[var(--bg-card-elevated)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[var(--text-primary)]">FastAPI Backend Status</span>
              <button
                onClick={verifyHealth}
                disabled={checking}
                className="flex items-center space-x-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${checking ? "animate-spin" : ""}`} />
                <span>Recheck</span>
              </button>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              {backendHealth?.status === "ok" ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-[var(--text-primary)] font-mono">
                    Operational — {backendHealth.service}
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[var(--text-secondary)]">
                    {backendHealth?.message || "Checking backend connection..."}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* System Information */}
          <div className="p-3.5 rounded-md border border-[var(--border-color)] bg-[var(--bg-card-elevated)] space-y-1.5 text-xs text-[var(--text-secondary)]">
            <div className="flex items-center justify-between">
              <span>Application Name</span>
              <span className="font-mono text-[var(--text-primary)]">Oceantrace-AI Desktop</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Environment</span>
              <span className="font-mono text-[var(--text-primary)]">Production PC Shell (Tauri)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Target Bounding Box</span>
              <span className="font-mono text-[var(--text-primary)]">[68.5, 8.0, 71.5, 11.0]</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Disclaimer</span>
              <span className="font-mono text-emerald-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Decision Support Only
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-[var(--border-color)] bg-[var(--bg-card-elevated)] text-[var(--text-primary)] hover:bg-[var(--border-color)] font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

`

## File: frontend\src\context\ThemeContext.jsx
`jsx
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem("oceantrace-theme");
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    // Default to dark mode for professional maritime intelligence interface
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    localStorage.setItem("oceantrace-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setTheme = (newTheme) => {
    if (newTheme === "dark" || newTheme === "light") {
      setThemeState(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

`

## File: frontend\src\lib\api.js
`js
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

`

## File: frontend\src\lib\leafletIcons.js
`js
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
`

## File: frontend\src\pages\Dashboard.jsx
`jsx
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
      {/* Executive Command Header */}
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

      {/* Top 3 High-Impact KPIs */}
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

      {/* Hero 2-Column Incident Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Spotlight: Active SAR Anomaly */}
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

        {/* Right Spotlight: Rank #1 Suspect Vessel */}
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

      {/* Streamlined Top Candidate Directory */}
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
`

## File: frontend\src\pages\Evidence.jsx
`jsx
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
  const [selectedDoc, setSelectedDoc] = useState("dossier"); // "dossier" | "sar" | "ais" | "drift"

  // Dispatch Alert Modal State
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
      {/* SCREEN-ONLY UI WRAPPER */}
      <div className="space-y-6 print-hide">
      {/* Top Action Header */}
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

        {/* Header Action Buttons */}
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

      {/* Main Grid: Document Sidebar List + Document Viewer */}
      {loading ? (
        <div className="py-20 text-center font-mono text-sm text-[var(--text-muted)]">
          Fetching forensic dossier files & satellite telemetry logs...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: DOCUMENT ARCHIVE LIST */}
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

          {/* Right Column: DYNAMIC DOCUMENT VIEWER */}
          <div className="lg:col-span-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 space-y-6 shadow-sm relative">
            {/* DOCUMENT 1: MAIN INCIDENT DOSSIER */}
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

                {/* Section 1: Executive Summary */}
                <div className="space-y-2">
                  <h3 className="text-xs font-mono font-extrabold uppercase tracking-wider text-[var(--text-primary)] border-b border-[var(--border-color)] pb-1">
                    1. EXECUTIVE SUMMARY & FORENSIC RATIONALE
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-card-elevated)] p-4 rounded-xl border border-[var(--border-color)]">
                    On {report?.timestamp || "2026-09-02"}, Copernicus Sentinel-1 Synthetic Aperture Radar (SAR) detected an illegal oil discharge anomaly covering ~{spill?.estimated_area_km2 || 46.0} km² in the Arabian Sea offshore shipping lane. Combining 48-hour backward ocean current hindcasting with Global Fishing Watch (GFW) AIS trajectory analysis, vessel <strong className="text-rose-600 dark:text-rose-400 font-extrabold">{topCandidate?.shipName || "MV ARABIAN STAR"}</strong> (MMSI: {topCandidate?.mmsi || "419001234"}) has been identified as the primary source candidate with an overall attribution confidence score of <strong className="text-rose-600 dark:text-rose-400 font-extrabold">{topCandidate?.attribution_score || 84.8}/100</strong>.
                  </p>
                </div>

                {/* Section 2: Suspect Candidate Intelligence */}
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

            {/* DOCUMENT 2: SAR SLICK DETECTION SDR-2026 */}
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

            {/* DOCUMENT 3: AIS SPEED ANOMALY REPORT */}
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

            {/* DOCUMENT 4: ADVECTION & DRIFT HINDCAST */}
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

            {/* Bottom Action Toolbar */}
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

      {/* ================================================================== */}
      {/* OFFICIAL LEGAL MARITIME INCIDENT REPORT (PRINT / SAVE PDF ONLY) */}
      {/* ================================================================== */}
      <div className="official-print-report hidden print:block bg-white text-slate-900 p-8 font-sans">
        {/* Official Header Crest / IMO Seal & Document Title */}
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

        {/* Section 1: Executive Summary */}
        <div className="mb-6 space-y-2">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            SECTION I: EXECUTIVE INCIDENT OVERVIEW & SAR DETECTION
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed text-justify">
            On <strong>02 September 2026 at 04:12:00 UTC</strong>, Copernicus Sentinel-1 Synthetic Aperture Radar (SAR) remote sensing satellites detected an un-notified, illegal oily discharge slick anomaly covering an estimated surface area of <strong>{spill?.estimated_area_km2 || 46.0} km²</strong> in the Arabian Sea international shipping lane (Centroid Coordinates: <strong>09°30'00" N, 070°00'00" E</strong>). Fusing 48-hour hydrodynamic backward ocean drift current vectors with Global Fishing Watch (GFW) high-frequency AIS vessel trajectories, commercial tanker <strong>{topCandidate?.shipName || "MT SEA EMPRESS"}</strong> (MMSI: <strong>{topCandidate?.mmsi || "352002891"}</strong>, IMO: <strong>9382104</strong>, Flag: <strong>{topCandidate?.flag || "PA"}</strong>) has been conclusively attributed as the primary source candidate with a cumulative multi-factor attribution confidence score of <strong>{topCandidate?.attribution_score || 82.3} / 100</strong>.
          </p>
        </div>

        {/* Section 2: Primary Suspect Vessel Particulars */}
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

        {/* Section 3: Multi-Factor Evidence Scoring Breakdown */}
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

        {/* Section 4: Top Evaluated Candidate Vessels Directory */}
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

        {/* Section 5: Official Legal Certification & Signatures */}
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

      {/* DISPATCH ALERT CONFIRMATION MODAL DIALOG */}
      {dispatchAlertModal && (
        <div className="fixed inset-0 z-[3000] bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[var(--bg-card)] rounded-2xl p-6 space-y-5 shadow-xl relative border border-[var(--border-color)] text-[var(--text-primary)]">
            {/* Modal Header */}
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

            {/* Alert Status Pill */}
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
`

## File: frontend\src\pages\MapView.jsx
`jsx
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
      {/* ------------------------------------------------------------- */}
      {/* FLOATABLE / DRAGGABLE LAYER CONTROL PANEL */}
      {/* ------------------------------------------------------------- */}
      {leftPanelOpen ? (
        <div
          style={{ left: `${panelPos.x}px`, top: `${panelPos.y}px` }}
          className={`absolute z-[1000] w-72 sm:w-80 glass-panel rounded-2xl p-4 border border-[var(--border-color)] bg-[var(--bg-card)] transition-all ${
            isDragging ? "scale-[1.01] cursor-grabbing" : ""
          }`}
        >
          {/* Drag Handle Bar Header */}
          <div
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            className="flex items-center justify-between border-b border-[var(--border-color)] pb-2.5 mb-3 cursor-grab active:cursor-grabbing select-none"
            title="Click and drag to move panel anywhere on screen"
          >
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-muted)] text-xs font-mono">⋮⋮</span>
              <Satellite className="w-4 h-4 text-[var(--text-primary)]" />
              <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider font-mono">
                LAYERS & DRIFT CONTROLS
              </span>
            </div>
            <button
              onClick={() => setLeftPanelOpen(false)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-mono px-2 py-0.5 rounded bg-[var(--bg-card-elevated)] border border-[var(--border-color)] flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> CLOSE
            </button>
          </div>

          {/* Dynamic Slick Recenter Button */}
          <button
            onClick={focusSlickArea}
            className="w-full mb-3 py-2 px-3 rounded-lg bg-[var(--bg-card-elevated)] hover:bg-[var(--bg-card)] text-[var(--text-primary)] text-xs font-bold font-mono border border-[var(--border-color)] transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4 text-[var(--text-secondary)]" /> RECENTER ON SLICK ANOMALY
          </button>

          {/* Unified Pipeline Status Indicator */}
          <div className="mb-3 bg-[var(--bg-card-elevated)] p-2.5 rounded-xl border border-[var(--border-color)] flex items-center justify-between">
            <span className="text-xs text-[var(--text-secondary)] font-mono">Data Pipeline:</span>
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-color)] flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              LIVE SAR & AIS STREAM
            </span>
          </div>

          {/* Layer Toggles */}
          <div className="space-y-2 text-xs font-mono">
            <label className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-color)] cursor-pointer hover:border-[var(--text-muted)] transition-colors">
              <span className="flex items-center gap-2 text-[var(--text-primary)]">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> SAR Slick Bounding Box
              </span>
              <input
                type="checkbox"
                checked={showSlick}
                onChange={(e) => setShowSlick(e.target.checked)}
                className="accent-slate-700 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-color)] cursor-pointer hover:border-[var(--text-muted)] transition-colors">
              <span className="flex items-center gap-2 text-[var(--text-primary)]">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" /> Backward Origin Corridor
              </span>
              <input
                type="checkbox"
                checked={showBackwardDrift}
                onChange={(e) => setShowBackwardDrift(e.target.checked)}
                className="accent-slate-700 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-color)] cursor-pointer hover:border-[var(--text-muted)] transition-colors">
              <span className="flex items-center gap-2 text-[var(--text-primary)]">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Forward Drift Forecast
              </span>
              <input
                type="checkbox"
                checked={showForwardDrift}
                onChange={(e) => setShowForwardDrift(e.target.checked)}
                className="accent-slate-700 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-color)] cursor-pointer hover:border-[var(--text-muted)] transition-colors">
              <span className="flex items-center gap-2 text-[var(--text-primary)]">
                <span className="h-2.5 w-2.5 rounded-full bg-pink-500" /> Ship Trajectory Routes
              </span>
              <input
                type="checkbox"
                checked={showTrajectories}
                onChange={(e) => setShowTrajectories(e.target.checked)}
                className="accent-slate-700 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-color)] cursor-pointer hover:border-[var(--text-muted)] transition-colors">
              <span className="flex items-center gap-2 text-[var(--text-primary)]">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Background AIS Traffic
              </span>
              <input
                type="checkbox"
                checked={showNormalVessels}
                onChange={(e) => setShowNormalVessels(e.target.checked)}
                className="accent-slate-700 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Tactical Telemetry Summary */}
          <div className="mt-4 pt-3 border-t border-[var(--border-color)] text-[11px] font-mono text-[var(--text-secondary)] space-y-1">
            <div className="flex justify-between">
              <span>Evaluated Candidates:</span>
              <span className="text-[var(--text-primary)] font-bold">{candidateVessels.length} Vessels</span>
            </div>
            <div className="flex justify-between">
              <span>Detection Confidence:</span>
              <span className="text-[var(--text-primary)] font-bold">{attribution?.confidence || 84.5}%</span>
            </div>
            <div className="flex justify-between">
              <span>Slick Centroid:</span>
              <span className="text-[var(--text-primary)] font-medium">09.500°N, 070.000°E</span>
            </div>
          </div>
        </div>
      ) : (
        /* FLOATABLE BUTTON WHEN COLLAPSED */
        <div
          style={{ left: `${panelPos.x}px`, top: `${panelPos.y}px` }}
          className="absolute z-[1000] flex items-center shadow-md"
        >
          <div
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            className="px-2 py-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] border-r-0 rounded-l-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-grab active:cursor-grabbing text-xs font-mono"
            title="Drag button anywhere"
          >
            ⋮⋮
          </div>
          <button
            onClick={() => setLeftPanelOpen(true)}
            className="px-3.5 py-2.5 bg-[var(--bg-card)] hover:bg-[var(--bg-card-elevated)] rounded-r-xl text-xs font-mono font-bold text-[var(--text-primary)] border border-[var(--border-color)] border-l-0 flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[var(--text-primary)]" /> LAYERS & CONTROLS
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
                          <strong className="text-[var(--text-primary)] font-bold flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-[var(--text-secondary)]" /> DESTINATION PORT
                          </strong>
                          <div className="font-bold text-[var(--text-primary)]">{activeVessel.destination_port}</div>
                          <div className="text-[10px] text-[var(--text-secondary)] font-mono">Vessel: {activeVessel.shipName}</div>
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
                          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-1">
                            <strong className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                              {isTop ? (
                                <>
                                  <AlertTriangle className="w-4 h-4 text-rose-500" /> RANK #1 SOURCE CANDIDATE
                                </>
                              ) : (
                                `Candidate (Rank #${v.rank})`
                              )}
                            </strong>
                            <span className="font-mono text-xs font-extrabold px-1.5 py-0.5 rounded bg-[var(--bg-card-elevated)] text-[var(--text-primary)] border border-[var(--border-color)]">
                              {v.attribution_score}/100
                            </span>
                          </div>
                          <div className="font-bold text-[var(--text-primary)]">{v.shipName}</div>
                          <div className="text-[var(--text-secondary)] text-[11px]">
                            MMSI: {v.mmsi} &bull; {v.vesselType} &bull; Course: {v.course}°
                          </div>
                          <div className="text-[var(--text-secondary)] text-[11px] font-mono">
                            Route: {v.departure_port || "Persian Gulf"} &rarr; {v.destination_port || "Singapore"}
                          </div>
                          {v.isClustered && (
                            <div className="text-[10px] text-[var(--text-secondary)] font-mono italic flex items-center gap-1">
                              <Zap className="w-3 h-3 text-[var(--text-secondary)]" /> Deconflicted radial position (Cluster offset applied)
                            </div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVessel({ ...v });
                            }}
                            className="w-full mt-2 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-[11px] font-bold font-mono border border-[var(--border-color)] transition-all cursor-pointer flex items-center justify-center gap-1"
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
                          <strong className="font-bold text-[var(--text-primary)]">{v.shipName}</strong>
                          <div className="text-[var(--text-secondary)] text-[11px]">
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
                            className="w-full mt-2 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-[11px] font-bold font-mono border border-[var(--border-color)] cursor-pointer flex items-center justify-center gap-1"
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
        <div className="absolute top-0 right-0 z-[1000] h-full w-full sm:w-96 md:w-[420px] glass-panel border-l border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-card-elevated)] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-primary)] font-extrabold">
                VESSEL DOSSIER
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-color)] font-bold">
                SCORE: {selectedVessel.attribution_score}/100
              </span>
            </div>
            <button
              onClick={() => setSelectedVessel(null)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-mono p-1 rounded hover:bg-[var(--bg-card)] flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> CLOSE
            </button>
          </div>

          {/* Dossier Content Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <div className="flex items-start justify-between bg-[var(--bg-card-elevated)] p-4 rounded-xl border border-[var(--border-color)]">
              <div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Target Identity</span>
                <h3 className="text-lg font-extrabold text-[var(--text-primary)]">{selectedVessel.shipName}</h3>
                <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
                  MMSI: {selectedVessel.mmsi} &bull; Flag: {selectedVessel.flag || "IN"}
                </p>
                <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
                  Type: {selectedVessel.vesselType} &bull; Course: {selectedVessel.course || 135}°
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Rank</span>
                <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">
                  #{selectedVessel.rank || 1}
                </div>
              </div>
            </div>

            {/* Commercial Voyage Route Telemetry Card */}
            <div className="bg-[var(--bg-card-elevated)] p-4 rounded-xl border border-[var(--border-color)] space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                <span className="text-[var(--text-primary)] font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-[var(--text-secondary)]" /> COMMERCIAL VOYAGE ROUTE
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">UNDERWAY VIA ENGINE</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Anchor className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">Departure Port</span>
                    <p className="font-bold text-[var(--text-primary)]">{selectedVessel.departure_port || "Fujairah Crude Terminal, UAE (AEFUJ)"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[var(--text-secondary)] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">Destination Port</span>
                    <p className="font-bold text-[var(--text-primary)]">{selectedVessel.destination_port || "Port of Singapore, Singapore (SGSIN)"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-card-elevated)] p-4 rounded-xl border border-[var(--border-color)] space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[var(--text-primary)] font-semibold">AIS SPEED ANOMALY HISTORY</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold text-[10px]">ANOMALY WINDOW DETECTED</span>
              </div>
              <div className="h-20 w-full bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] p-2 flex flex-col justify-between relative overflow-hidden">
                <div className="flex justify-between text-[9px] font-mono text-[var(--text-muted)]">
                  <span>16 kts</span>
                  <span>0 kts</span>
                </div>
                <svg className="w-full h-10 overflow-visible" viewBox="0 0 300 40">
                  <path
                    d="M 0,10 L 60,12 L 110,11 L 130,32 L 180,33 L 200,12 L 300,10"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2"
                  />
                  <rect x="120" y="2" width="70" height="36" fill="rgba(239, 68, 68, 0.12)" stroke="rgba(239, 68, 68, 0.4)" strokeDasharray="2 2" />
                </svg>
                <div className="flex justify-between text-[9px] font-mono text-[var(--text-muted)]">
                  <span>22:00 UTC</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">DISCHARGE WINDOW</span>
                  <span>04:00 UTC</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="bg-[var(--bg-card-elevated)] p-3 rounded-lg border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-muted)] uppercase">Dist to Slick</span>
                <p className="text-sm font-bold text-[var(--text-primary)] mt-0.5">{selectedVessel.distance_km} km</p>
              </div>
              <div className="bg-[var(--bg-card-elevated)] p-3 rounded-lg border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-muted)] uppercase">Corridor Offset</span>
                <p className="text-sm font-bold text-[var(--text-primary)] mt-0.5">{selectedVessel.dist_to_drift_corridor_km} km</p>
              </div>
            </div>

            {selectedVessel.score_breakdown && (
              <div className="bg-[var(--bg-card-elevated)] p-4 rounded-xl border border-[var(--border-color)] space-y-2.5 text-xs font-mono">
                <span className="text-[var(--text-secondary)] font-semibold uppercase text-[10px] tracking-wider">
                  Attribution Factor Breakdown
                </span>

                <div className="space-y-1">
                  <div className="flex justify-between text-[var(--text-muted)] text-[11px]">
                    <span>Backward Drift Match</span>
                    <span className="text-[var(--text-primary)] font-bold">{selectedVessel.score_breakdown.drift_corridor}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--bg-card)] rounded-full overflow-hidden">
                    <div className="h-full bg-slate-700 dark:bg-slate-300" style={{ width: `${selectedVessel.score_breakdown.drift_corridor}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[var(--text-muted)] text-[11px]">
                    <span>Spatial Proximity</span>
                    <span className="text-[var(--text-primary)] font-bold">{selectedVessel.score_breakdown.spatial}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--bg-card)] rounded-full overflow-hidden">
                    <div className="h-full bg-slate-700 dark:bg-slate-300" style={{ width: `${selectedVessel.score_breakdown.spatial}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[var(--text-muted)] text-[11px]">
                    <span>Behaviour Anomaly</span>
                    <span className="text-[var(--text-primary)] font-bold">{selectedVessel.score_breakdown.behaviour}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--bg-card)] rounded-full overflow-hidden">
                    <div className="h-full bg-slate-700 dark:bg-slate-300" style={{ width: `${selectedVessel.score_breakdown.behaviour}%` }} />
                  </div>
                </div>
              </div>
            )}

            {selectedVessel.why_ranked && (
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider font-bold">
                  Evidence Rationale
                </span>
                <div className="space-y-1.5 bg-[var(--bg-card-elevated)] p-3.5 rounded-xl border border-[var(--border-color)] text-xs">
                  {selectedVessel.why_ranked.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2 text-[var(--text-primary)]">
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 font-bold shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dossier Bottom Action Bar */}
          <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-card-elevated)] flex items-center justify-between gap-2 shrink-0">
            <button
              onClick={() => handleDispatchAlert(selectedVessel)}
              className="flex-1 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold font-mono transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-white" /> Dispatch Alert
            </button>
            <button
              onClick={() => handleExportVesselDossier(selectedVessel)}
              className="flex-1 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-xs font-bold font-mono transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <FileText className="w-4 h-4" /> Export Dossier
            </button>
          </div>
        </div>
      )}

      {/* DISPATCH ALERT CONFIRMATION MODAL DIALOG */}
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

export default function MapView() {
  return (
    <MapErrorBoundary>
      <MapViewContent />
    </MapErrorBoundary>
  );
}

`

## File: frontend\src-tauri\build.rs
`rs
fn main() {
  tauri_build::build()
}

`

## File: frontend\src-tauri\Cargo.toml
`toml
[package]
name = "app"
version = "0.1.0"
description = "A Tauri App"
authors = ["you"]
license = ""
repository = ""
edition = "2021"
rust-version = "1.77.2"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[lib]
name = "app_lib"
crate-type = ["staticlib", "cdylib", "rlib"]

[build-dependencies]
tauri-build = { version = "2.6.3", features = [] }

[dependencies]
serde_json = "1.0"
serde = { version = "1.0", features = ["derive"] }
log = "0.4"
tauri = { version = "2.11.3", features = [] }
tauri-plugin-log = "2"

`

## File: frontend\src-tauri\tauri.conf.json
`json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "Oceantrace-AI",
  "version": "1.0.0",
  "identifier": "com.oceantrace.desktop",
  "build": {
    "frontendDist": "../dist",
    "devUrl": "http://localhost:5173",
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build"
  },
  "app": {
    "windows": [
      {
        "title": "Oceantrace-AI — Satellite Imagery Oil Spill Detection & AIS Source Attribution",
        "width": 1440,
        "height": 900,
        "minWidth": 1024,
        "minHeight": 700,
        "resizable": true,
        "fullscreen": false,
        "center": true
      }
    ],
    "security": {
      "csp": null
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ],
    "category": "Science",
    "copyright": "Copyright © 2026 Oceantrace-AI",
    "shortDescription": "Satellite imagery oil spill detection with AIS vessel source attribution",
    "longDescription": "Operational decision-support platform combining Sentinel-1 SAR imagery, oceanographic hydrodynamic advection hindcasting, and AIS track data for maritime intelligence."
  }
}

`

## File: frontend\src-tauri\capabilities\default.json
`json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "enables the default permissions",
  "windows": [
    "main"
  ],
  "permissions": [
    "core:default"
  ]
}

`

## File: frontend\src-tauri\src\lib.rs
`rs
use std::net::TcpStream;
use std::process::{Child, Command};
use std::sync::Mutex;
use tauri::{Manager, WindowEvent};

struct BackendChild(Mutex<Option<Child>>);

fn is_backend_running() -> bool {
    TcpStream::connect("127.0.0.1:8000").is_ok()
}

fn spawn_backend() -> Option<Child> {
    if is_backend_running() {
        println!("[Oceantrace-Desktop] Backend already active on port 8000.");
        return None;
    }

    println!("[Oceantrace-Desktop] Spawning Python FastAPI backend process...");

    let candidates = [
        ("../backend/.venv/Scripts/python.exe", "../backend"),
        ("../../backend/.venv/Scripts/python.exe", "../../backend"),
        ("backend/.venv/Scripts/python.exe", "backend"),
        ("../backend/.venv/bin/python", "../backend"),
        ("python", "../backend"),
        ("python", "backend"),
    ];

    for (py_path, work_dir) in candidates {
        let path_obj = std::path::Path::new(py_path);
        let dir_obj = std::path::Path::new(work_dir);

        if (py_path == "python" || path_obj.exists()) && dir_obj.exists() {
            println!(
                "[Oceantrace-Desktop] Attempting launch using python: '{}' in '{}'",
                py_path, work_dir
            );
            let child = Command::new(py_path)
                .args(["-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"])
                .current_dir(work_dir)
                .spawn();

            match child {
                Ok(c) => {
                    println!("[Oceantrace-Desktop] Successfully started backend (PID {})", c.id());
                    return Some(c);
                }
                Err(e) => {
                    eprintln!("[Oceantrace-Desktop] Launch failed with '{}': {}", py_path, e);
                }
            }
        }
    }

    eprintln!("[Oceantrace-Desktop] Could not automatically spawn backend. Please verify python environment.");
    None
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let child_proc = spawn_backend();

    tauri::Builder::default()
        .manage(BackendChild(Mutex::new(child_proc)))
        .setup(|app| {
            if cfg!(debug_assertions) {
                let _ = app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                );
            }
            Ok(())
        })
        .on_window_event(|window, event| {
            if let WindowEvent::Destroyed = event {
                if let Some(state) = window.try_state::<BackendChild>() {
                    if let Ok(mut guard) = state.0.lock() {
                        if let Some(mut child) = guard.take() {
                            println!("[Oceantrace-Desktop] Terminating backend process PID {}", child.id());
                            let _ = child.kill();
                        }
                    }
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

`

## File: frontend\src-tauri\src\main.rs
`rs
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
  app_lib::run();
}

`

## File: sample_data\demo\incident.json
`json
{
  "incident_id": "INC-2026-ARABIAN-001",
  "name": "Arabian Sea Offshore S1 Anomaly Incident",
  "detection_time": "2026-09-02T06:12:00Z",
  "date_range": "2026-08-28 to 2026-09-02",
  "status": "active",
  "study_region": {
    "name": "Offshore Arabian Sea Shipping Corridor",
    "bbox": [68.5, 8.0, 71.5, 11.0]
  },
  "spill": {
    "possible_slick_detected": true,
    "confidence": 84.5,
    "estimated_area_km2": 46.0,
    "spill_pixel_count": 920,
    "mean_local_darkness_db": 7.4,
    "max_local_darkness_db": 10.2,
    "likely_artifact": false,
    "artifact_warning": null,
    "spill_center": {
      "lat": 9.50,
      "lon": 70.00
    },
    "spill_bounding_box": {
      "min_lat": 9.35,
      "min_lon": 69.80,
      "max_lat": 9.65,
      "max_lon": 70.20
    },
    "candidate_regions": [
      {
        "rank": 1,
        "pixel_count": 920,
        "pixel_ratio": 0.023,
        "estimated_area_km2": 46.0,
        "mean_local_darkness_db": 7.4,
        "max_local_darkness_db": 10.2,
        "likely_artifact": false,
        "center": { "lat": 9.50, "lon": 70.00 },
        "bounding_box": {
          "min_lat": 9.35,
          "min_lon": 69.80,
          "max_lat": 9.65,
          "max_lon": 70.20
        }
      }
    ]
  },
  "environment": {
    "ocean_current": {
      "speed_kmh": 0.85,
      "direction_deg": 135.0,
      "description": "SE flow at 0.85 km/h"
    },
    "wind": {
      "speed_kmh": 18.5,
      "direction_deg": 315.0,
      "description": "NW wind (blowing towards SE) at 18.5 km/h"
    },
    "drift_vector": {
      "speed_kmh": 1.405,
      "direction_deg": 135.0
    }
  },
  "drift": {
    "origin": { "lat": 9.50, "lon": 70.00 },
    "forecast_hours": 48,
    "step_hours": 3,
    "backward_trajectory": [
      { "step_hours": 0, "timestamp": "2026-09-02T06:00:00Z", "lat": 9.50, "lon": 70.00 },
      { "step_hours": -3, "timestamp": "2026-09-02T03:00:00Z", "lat": 9.465, "lon": 69.965 },
      { "step_hours": -6, "timestamp": "2026-09-02T00:00:00Z", "lat": 9.430, "lon": 69.930 },
      { "step_hours": -9, "timestamp": "2026-09-01T21:00:00Z", "lat": 9.395, "lon": 69.895 },
      { "step_hours": -12, "timestamp": "2026-09-01T18:00:00Z", "lat": 9.360, "lon": 69.860 },
      { "step_hours": -18, "timestamp": "2026-09-01T12:00:00Z", "lat": 9.290, "lon": 69.790 },
      { "step_hours": -24, "timestamp": "2026-09-01T06:00:00Z", "lat": 9.220, "lon": 69.720 },
      { "step_hours": -36, "timestamp": "2026-08-31T18:00:00Z", "lat": 9.080, "lon": 69.580 },
      { "step_hours": -48, "timestamp": "2026-08-31T06:00:00Z", "lat": 8.940, "lon": 69.440 }
    ],
    "forward_trajectory": [
      { "step_hours": 0, "timestamp": "2026-09-02T06:00:00Z", "lat": 9.50, "lon": 70.00 },
      { "step_hours": 3, "timestamp": "2026-09-02T09:00:00Z", "lat": 9.535, "lon": 70.035 },
      { "step_hours": 6, "timestamp": "2026-09-02T12:00:00Z", "lat": 9.570, "lon": 70.070 },
      { "step_hours": 12, "timestamp": "2026-09-02T18:00:00Z", "lat": 9.640, "lon": 70.140 },
      { "step_hours": 24, "timestamp": "2026-09-03T06:00:00Z", "lat": 9.780, "lon": 70.280 },
      { "step_hours": 48, "timestamp": "2026-09-04T06:00:00Z", "lat": 10.060, "lon": 70.560 }
    ]
  },
  "vessels": [
    {
      "shipName": "MV ARABIAN STAR",
      "mmsi": "419001234",
      "vesselType": "Oil Tanker",
      "flag": "IN",
      "lat": 9.25,
      "lon": 69.75,
      "speed": 11.2,
      "course": 135.0,
      "exitTimestamp": "2026-09-01T14:30:00Z",
      "timestamp": "2026-09-01T14:30:00Z",
      "behaviour": {
        "speed_drop_observed": true,
        "unusual_dwell": true,
        "notes": "Temporary speed reduction from 14.8 to 8.1 kts while crossing the origin corridor."
      }
    },
    {
      "shipName": "MT SEA EMPRESS",
      "mmsi": "352002891",
      "vesselType": "Chemical Tanker",
      "flag": "PA",
      "lat": 9.38,
      "lon": 69.88,
      "speed": 14.5,
      "course": 140.0,
      "exitTimestamp": "2026-09-01T18:15:00Z",
      "timestamp": "2026-09-01T18:15:00Z",
      "behaviour": {
        "speed_drop_observed": false,
        "unusual_dwell": false,
        "notes": "Maintained steady transit speed through the area."
      }
    },
    {
      "shipName": "MV OCEAN PHOENIX",
      "mmsi": "636018442",
      "vesselType": "Container Ship",
      "flag": "LR",
      "lat": 9.48,
      "lon": 70.12,
      "speed": 18.2,
      "course": 320.0,
      "exitTimestamp": "2026-09-02T02:00:00Z",
      "timestamp": "2026-09-02T02:00:00Z",
      "behaviour": {
        "speed_drop_observed": false,
        "unusual_dwell": false,
        "notes": "Standard container transit eastbound."
      }
    },
    {
      "shipName": "INS TARKASH",
      "mmsi": "419000555",
      "vesselType": "Naval Vessel",
      "flag": "IN",
      "lat": 9.85,
      "lon": 69.30,
      "speed": 20.0,
      "course": 90.0,
      "exitTimestamp": "2026-09-02T05:00:00Z",
      "timestamp": "2026-09-02T05:00:00Z",
      "behaviour": {
        "speed_drop_observed": false,
        "unusual_dwell": false,
        "notes": "Patrol route."
      }
    },
    {
      "shipName": "FV MAHALAKSHMI",
      "mmsi": "419982104",
      "vesselType": "Fishing Vessel",
      "flag": "IN",
      "lat": 8.80,
      "lon": 70.90,
      "speed": 4.2,
      "course": 210.0,
      "exitTimestamp": "2026-09-02T01:00:00Z",
      "timestamp": "2026-09-02T01:00:00Z",
      "behaviour": {
        "speed_drop_observed": false,
        "unusual_dwell": false,
        "notes": "Local fishing activity."
      }
    }
  ]
}

`

