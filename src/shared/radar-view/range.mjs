export const DEFAULT_RADAR_RANGE_NM = 20;

export function parseRadarRangeSetting(value) {
  if (value === undefined || value === "") return DEFAULT_RADAR_RANGE_NM;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 1 || number > 300) {
    throw new Error("RADAR_DEFAULT_RANGE_NM must be a number from 1 through 300.");
  }
  return number;
}
