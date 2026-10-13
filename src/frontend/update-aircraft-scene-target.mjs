import { projectAircraftPosition } from "./aircraft-space-position.mjs";
import { selectDefaultRadarRange } from "./radar-range.mjs";

export function updateAircraftSceneTarget(aircraft, state) {
  const position = projectAircraftPosition(aircraft, state.location, state.elevationFeet);
  if (!position) return;
  const expired = state.targets.update(aircraft, Math.hypot(position.x, position.z));
  state.trails.remove(expired);
  state.trails.add(aircraft.icao, position);
  if (!state.isAutoZoom()) return;
  const nextRange = selectDefaultRadarRange(state.targets.distances());
  if (nextRange !== state.radarCamera.range()) state.radarCamera.setRange(nextRange);
}
