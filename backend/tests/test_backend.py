import os
import sys
import pytest

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
