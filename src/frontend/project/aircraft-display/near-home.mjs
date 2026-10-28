import { isAircraftProjectedNearHome } from "../../aircraft/near-home/pass.mjs";

export function isAircraftDisplayNearHome(item, location, elevationFeet) {
  return isAircraftProjectedNearHome(item, location, elevationFeet);
}
