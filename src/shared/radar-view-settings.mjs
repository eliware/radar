export const DEFAULT_RADAR_RANGE_NM = 20;
export const DEFAULT_RADAR_ROTATION_DEGREES = 0;

export function parseRadarViewSettings(environment) {
  return {
    defaultRangeNm: parseSetting(
      environment.RADAR_DEFAULT_RANGE_NM,
      DEFAULT_RADAR_RANGE_NM,
      1,
      300,
      "RADAR_DEFAULT_RANGE_NM",
    ),
    defaultRotationDegrees: parseSetting(
      environment.RADAR_DEFAULT_ROTATION,
      DEFAULT_RADAR_ROTATION_DEGREES,
      0,
      359,
      "RADAR_DEFAULT_ROTATION",
      true,
    ),
  };
}

function parseSetting(value, fallback, minimum, maximum, name, integer = false) {
  if (value === undefined || value === "") return fallback;
  const number = Number(value);
  if (
    !Number.isFinite(number) ||
    number < minimum ||
    number > maximum ||
    (integer && !Number.isInteger(number))
  ) {
    const format = integer ? "an integer" : "a number";
    throw new Error(`${name} must be ${format} from ${minimum} through ${maximum}.`);
  }
  return number;
}
