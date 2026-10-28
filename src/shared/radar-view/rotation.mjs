export const DEFAULT_RADAR_ROTATION_DEGREES = 0;

export function parseRadarRotationSetting(value) {
  if (value === undefined || value === "") return DEFAULT_RADAR_ROTATION_DEGREES;
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0 || number > 359) {
    throw new Error("RADAR_DEFAULT_ROTATION must be an integer from 0 through 359.");
  }
  return number;
}
