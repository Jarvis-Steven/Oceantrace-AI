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
