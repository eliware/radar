import { calculateAircraftRange } from "../../../shared/aircraft/range.mjs";

export function enrichRemoteAircraftRange(aircraft, location) {
  return { ...aircraft, ...calculateAircraftRange(location, aircraft) };
}
