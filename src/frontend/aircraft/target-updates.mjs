import { projectAircraftPosition } from "./space-position.mjs";

export function updateAircraftTargetAndTrail({
  aircraft,
  location,
  elevationFeet = 0,
  targets,
  trails,
  receiveTimes,
  addTrail = true,
  removeExpiredTrails = true,
}) {
  const position = projectAircraftPosition(aircraft, location, elevationFeet);
  if (!position) return null;
  const distanceNm = Math.hypot(position.x, position.z);
  const expired = targets.update(aircraft, distanceNm);
  if (removeExpiredTrails) {
    trails.remove(expired);
    receiveTimes?.remove(expired);
  }
  if (addTrail) trails.add(aircraft.icao, position);
  receiveTimes?.set(aircraft.icao, aircraft.lastSeen);
  return { position, distanceNm };
}
