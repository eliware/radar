import { default as projectPredictedAircraftPath } from "./aircraft-path.mjs";
import { default as isPredictedAircraftPathNearHome } from "./path.mjs";

function isAircraftProjectedNearHome(aircraft, location, elevationFeet = 0) {
  if (!Number.isFinite(aircraft?.altitudeFeet)) return false;
  const path = projectPredictedAircraftPath(aircraft, location, elevationFeet);
  if (!path) return false;
  return isPredictedAircraftPathNearHome(path.start, path.end);
}
export default isAircraftProjectedNearHome;
