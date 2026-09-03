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
