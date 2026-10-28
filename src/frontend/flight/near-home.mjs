import { isAircraftProjectedNearHome } from "../aircraft/near-home/pass.mjs";

export function classifyFlightAircraftNearHome(items, location, elevationFeet) {
  return [...items].map((item) => ({
    ...item,
    nearHomePass: isAircraftProjectedNearHome(item, location, elevationFeet),
  }));
}
