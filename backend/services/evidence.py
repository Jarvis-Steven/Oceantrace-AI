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
