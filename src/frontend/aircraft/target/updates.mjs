import { projectAircraftTargetPosition } from "./position.mjs";

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
  const targetPosition = projectAircraftTargetPosition(aircraft, location, elevationFeet);
  if (!targetPosition) return null;
  const { position, distanceNm } = targetPosition;
  const expired = targets.update(aircraft, distanceNm);
  if (removeExpiredTrails) {
    trails.remove(expired);
    receiveTimes?.remove(expired);
  }
  if (addTrail) trails.add(aircraft.icao, position);
  receiveTimes?.set(aircraft.icao, aircraft.lastSeen);
  return { position, distanceNm };
}
