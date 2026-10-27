import { runwayDestination } from "../../runway-destination.mjs";

const EXTENSION_NM = 10;
const EXTENSION_ALTITUDE_FEET = 3000;

export function createRunwayGuidePoints(end) {
  const outward = (end.alignmentDegrees + 180) % 360;
  const farEnd = runwayDestination(end, outward, EXTENSION_NM);
  const baseElevation = Number.isFinite(end.elevationFeet) ? end.elevationFeet : 0;
  const farAltitude = baseElevation + EXTENSION_ALTITUDE_FEET;
  return {
    extensionStart: { ...end, elevationFeet: baseElevation },
    extensionEnd: { ...farEnd, elevationFeet: farAltitude },
    baseLegs: [
      { ...runwayDestination(farEnd, outward - 90, 5), elevationFeet: farAltitude },
      { ...runwayDestination(farEnd, outward + 90, 5), elevationFeet: farAltitude },
    ],
  };
}
