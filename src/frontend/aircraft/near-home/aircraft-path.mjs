import { projectAircraftPosition } from "../space-position.mjs";
import { predictAircraftPosition } from "../../predict-aircraft-position.mjs";

export function projectPredictedAircraftPath(aircraft, location, elevationFeet = 0) {
  const start = projectAircraftPosition(aircraft, location, elevationFeet);
  if (!start) return null;
  const end = predictAircraftPosition(start, aircraft);
  return end ? { start, end } : null;
}
