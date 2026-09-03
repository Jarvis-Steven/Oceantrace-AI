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
