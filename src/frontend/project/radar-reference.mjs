import { projectAircraftPosition } from "../aircraft/space-position.mjs";

export function projectRadarReference(item, location, elevationFeet, project) {
  const position = projectAircraftPosition(
    { ...item, altitudeFeet: Number.isFinite(item.elevationFeet) ? item.elevationFeet : 0 },
    location,
    elevationFeet,
  );
  return position ? project(position) : null;
}
