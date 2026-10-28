const APPROACH_LENGTH_NM = 10;
const FEET_PER_NM = 6076.12;
import { runwayDestination } from "./runway-destination.mjs";

export function buildIlsCourseGeometry(approach) {
  if (!Number.isFinite(approach.magneticCourse)) return null;
  const variation = Number.isFinite(approach.magneticVariation) ? approach.magneticVariation : 0;
  const correction = approach.magneticVariationHemisphere === "W" ? -variation : variation;
  const bearing = (approach.magneticCourse + correction + 180 + 360) % 360;
  const elevationFeet = safeIlsElevation(approach);
  const slope = Number.isFinite(approach.glideSlopeDegrees) ? approach.glideSlopeDegrees : 0;
  const rise = APPROACH_LENGTH_NM * FEET_PER_NM * Math.tan((slope * Math.PI) / 180);
  return {
    bearing,
    elevationFeet,
    endpoint: {
      ...runwayDestination(approach, bearing, APPROACH_LENGTH_NM),
      elevationFeet: elevationFeet + rise,
    },
  };
}

export function safeIlsElevation(point) {
  return Number.isFinite(point.elevationFeet) ? point.elevationFeet : 0;
}
