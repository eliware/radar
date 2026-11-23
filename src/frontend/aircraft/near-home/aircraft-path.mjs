import { default as projectAircraftPosition } from "../space-position.mjs";
import { default as predictAircraftPosition } from "../../predict-aircraft-position.mjs";

function projectPredictedAircraftPath(aircraft, location, elevationFeet = 0) {
  const start = projectAircraftPosition(aircraft, location, elevationFeet);
  if (!start) return null;
  const end = predictAircraftPosition(start, aircraft);
  return end ? { start, end } : null;
}
export default projectPredictedAircraftPath;
