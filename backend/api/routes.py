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