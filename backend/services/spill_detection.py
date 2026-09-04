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

config = SHConfig()

config.sh_client_id = os.getenv("CDSE_CLIENT_ID")
config.sh_client_secret = os.getenv("CDSE_CLIENT_SECRET")

config.sh_base_url = "https://sh.dataspace.copernicus.eu"

config.sh_token_url = (
    "https://identity.dataspace.copernicus.eu/auth/realms/"
    "CDSE/protocol/openid-connect/token"
)

BBOX_COORDS = [68.5, 8.0, 71.5, 11.0]

RESOLUTION = 200

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

BASELINE_DARK_RATIO = 0.046

MIN_CANDIDATE_RATIO = 0.001

MIN_COMPONENT_PIXELS = 20

LOCAL_BLOCK_SIZE = 32

MIN_LOCAL_DARKNESS_DB = 2.5

MAX_PLAUSIBLE_DARKNESS_DB = 15.0

MAX_STAT_SAMPLE = 100_000

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

def _linear_to_db(values):
    """
    Convert Sentinel-1 linear backscatter to decibels.

    dB = 10 * log10(linear_value)
    """
    values = np.asarray(values, dtype=np.float32)
    values = np.maximum(values, 1e-10)
    return 10.0 * np.log10(values)

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

        lat = max_lat - (row / (height - 1)) * (max_lat - min_lat)

    return float(lat), float(lon)

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

    if not config.sh_client_id or not config.sh_client_secret:
        return {
            "status": "error",
            "message": "CDSE credentials not set in .env",
        }

    try:

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

        image = request.get_data()[0]

        if image is None:
            return {"status": "error", "message": "Sentinel-1 returned no image."}

        image = np.asarray(image, dtype=np.float32)

        valid_mask = np.isfinite(image)
        valid_pixels = image[valid_mask]

        if valid_pixels.size == 0:
            return {
                "status": "error",
                "message": "No valid SAR data returned for this period/region.",
            }

        db_image = np.full_like(image, np.nan, dtype=np.float32)
        db_image[valid_mask] = _linear_to_db(valid_pixels)

        valid_db = db_image[valid_mask]

        if valid_db.size > MAX_STAT_SAMPLE:
            rng = np.random.default_rng(42)
            indices = rng.choice(valid_db.size, size=MAX_STAT_SAMPLE, replace=False)
            stats_pixels = valid_db[indices]
        else:
            stats_pixels = valid_db

        global_median_db, global_mad_db, global_robust_std_db = _robust_statistics(stats_pixels)

        local_background = _build_local_background(db_image, valid_mask)

        local_darkness = local_background - db_image

        candidate_mask = (
            valid_mask
            & np.isfinite(local_darkness)
            & (local_darkness >= MIN_LOCAL_DARKNESS_DB)
        )

        candidate_pixels = int(np.sum(candidate_mask))
        total_valid_pixels = int(np.sum(valid_mask))

        if total_valid_pixels == 0:
            return {"status": "error", "message": "No valid pixels available."}

        candidate_ratio = candidate_pixels / total_valid_pixels

        components = _connected_components(candidate_mask)

        meaningful_components = [
            component for component in components
            if component["size"] >= MIN_COMPONENT_PIXELS
        ]

        meaningful_components.sort(key=lambda component: component["size"], reverse=True)

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

        strongest = meaningful_components[0]
        candidate_pixel_count = strongest["size"]
        strongest_ratio = candidate_pixel_count / total_valid_pixels

        geography = _component_geography(strongest, image.shape[0], image.shape[1])

        component_rows = np.array([p[0] for p in strongest["pixels"]], dtype=np.int32)
        component_cols = np.array([p[1] for p in strongest["pixels"]], dtype=np.int32)

        component_darkness_values = local_darkness[component_rows, component_cols]

        mean_component_darkness = float(np.mean(component_darkness_values))
        max_component_darkness = float(np.max(component_darkness_values))

        likely_artifact = mean_component_darkness > MAX_PLAUSIBLE_DARKNESS_DB

        pixel_area_km2 = (RESOLUTION * RESOLUTION) / 1_000_000
        estimated_area_km2 = candidate_pixel_count * pixel_area_km2

        possible_slick_detected = (
            candidate_pixel_count >= MIN_COMPONENT_PIXELS
            and strongest_ratio >= MIN_CANDIDATE_RATIO
            and not likely_artifact
        )

        confidence = _calculate_confidence(
            candidate_ratio=strongest_ratio,
            local_darkness=mean_component_darkness,
            component_size=candidate_pixel_count,
        )

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

            "mean_backscatter": round(float(np.mean(valid_pixels)), 6),
            "median_backscatter_db": round(global_median_db, 3),
            "mad_db": round(global_mad_db, 3),
            "robust_std_db": round(global_robust_std_db, 3),

            "raw_candidate_ratio": round(candidate_ratio, 5),
            "strongest_candidate_ratio": round(strongest_ratio, 5),
            "clean_ocean_baseline": BASELINE_DARK_RATIO,
            "local_darkness_threshold_db": MIN_LOCAL_DARKNESS_DB,
            "max_plausible_darkness_db": MAX_PLAUSIBLE_DARKNESS_DB,

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

            "candidate_regions": candidate_regions,

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
