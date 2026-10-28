import { projectAircraftPosition } from "../space-position.mjs";
import { predictAircraftPosition } from "../../predict-aircraft-position.mjs";
import { isPredictedAircraftPathNearHome } from "./path.mjs";

export function isAircraftProjectedNearHome(aircraft, location, elevationFeet = 0) {
  if (!Number.isFinite(aircraft?.altitudeFeet)) return false;
  const start = projectAircraftPosition(aircraft, location, elevationFeet);
  const end = start && predictAircraftPosition(start, aircraft);
  if (!end) return false;
  return isPredictedAircraftPathNearHome(start, end);
}
