import { default as projectAircraftPosition } from "../space-position.mjs";

function projectAircraftTargetPosition(aircraft, location, elevationFeet = 0) {
  const position = projectAircraftPosition(aircraft, location, elevationFeet);
  if (!position) return null;
  return { position, distanceNm: Math.hypot(position.x, position.z) };
}
export default projectAircraftTargetPosition;
