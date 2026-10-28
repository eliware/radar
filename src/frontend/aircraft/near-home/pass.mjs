import { projectPredictedAircraftPath } from "./aircraft-path.mjs";
import { isPredictedAircraftPathNearHome } from "./path.mjs";

export function isAircraftProjectedNearHome(aircraft, location, elevationFeet = 0) {
  if (!Number.isFinite(aircraft?.altitudeFeet)) return false;
  const path = projectPredictedAircraftPath(aircraft, location, elevationFeet);
  if (!path) return false;
  return isPredictedAircraftPathNearHome(path.start, path.end);
}
