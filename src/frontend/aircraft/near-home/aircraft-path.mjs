import { projectAircraftPosition } from "../space-position.mjs";
import { predictAircraftPosition } from "../../predict-aircraft-position.mjs";
import { isPredictedAircraftPathNearHome } from "./path.mjs";

export function projectPredictedAircraftPath(aircraft, location, elevationFeet = 0) {
  const start = projectAircraftPosition(aircraft, location, elevationFeet);
  if (!start) return null;
  const end = predictAircraftPosition(start, aircraft);
  return end ? { start, end } : null;
}

export function isAircraftProjectedNearHome(aircraft, location, elevationFeet = 0) {
  if (!Number.isFinite(aircraft?.altitudeFeet)) return false;
  const path = projectPredictedAircraftPath(aircraft, location, elevationFeet);
  if (!path) return false;
  return isPredictedAircraftPathNearHome(path.start, path.end);
}
