import { default as calculateAircraftRange } from "../../../shared/aircraft/range.mjs";

function enrichRemoteAircraftRange(aircraft, location) {
  return { ...aircraft, ...calculateAircraftRange(location, aircraft) };
}
export default enrichRemoteAircraftRange;
