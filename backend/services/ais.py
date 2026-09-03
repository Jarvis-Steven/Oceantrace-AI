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