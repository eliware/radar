const APPROACH_LENGTH_NM = 10;
const FEET_PER_NM = 6076.12;
const EARTH_RADIUS_NM = 3440.065;

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
      ...destination(approach, bearing, APPROACH_LENGTH_NM),
      elevationFeet: elevationFeet + rise,
    },
  };
}

export function safeIlsElevation(point) {
  return Number.isFinite(point.elevationFeet) ? point.elevationFeet : 0;
}

function destination(point, bearingDegrees, rangeNm) {
  const angular = rangeNm / EARTH_RADIUS_NM;
  const bearing = (bearingDegrees * Math.PI) / 180;
  const latitude = (point.latitude * Math.PI) / 180;
  const longitude = (point.longitude * Math.PI) / 180;
  const nextLatitude = Math.asin(
    Math.sin(latitude) * Math.cos(angular) +
      Math.cos(latitude) * Math.sin(angular) * Math.cos(bearing),
  );
  const nextLongitude =
    longitude +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angular) * Math.cos(latitude),
      Math.cos(angular) - Math.sin(latitude) * Math.sin(nextLatitude),
    );
  return { latitude: (nextLatitude * 180) / Math.PI, longitude: (nextLongitude * 180) / Math.PI };
}
