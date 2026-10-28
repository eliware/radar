import { isAircraftProjectedNearHome } from "../aircraft/near-home/aircraft-path.mjs";

export function classifyFlightAircraftNearHome(items, location, elevationFeet) {
  return [...items].map((item) => ({
    ...item,
    nearHomePass: isAircraftProjectedNearHome(item, location, elevationFeet),
  }));
}
