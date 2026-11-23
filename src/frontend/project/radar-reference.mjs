import { default as projectAircraftPosition } from "../aircraft/space-position.mjs";

function projectRadarReference(item, location, elevationFeet, project) {
  const position = projectAircraftPosition(
    { ...item, altitudeFeet: Number.isFinite(item.elevationFeet) ? item.elevationFeet : 0 },
    location,
    elevationFeet,
  );
  return position ? project(position) : null;
}
export default projectRadarReference;
