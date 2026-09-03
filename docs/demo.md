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
