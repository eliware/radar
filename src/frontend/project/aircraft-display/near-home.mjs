import { isAircraftProjectedNearHome } from "../../aircraft/near-home/aircraft-path.mjs";

export function isAircraftDisplayNearHome(item, location, elevationFeet) {
  return isAircraftProjectedNearHome(item, location, elevationFeet);
}
