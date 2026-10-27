const fieldNames = [
  "recordType",
  "transmissionType",
  "sessionId",
  "aircraftId",
  "icao",
  "flightId",
  "generatedDate",
  "generatedTime",
  "loggedDate",
  "loggedTime",
  "callsign",
  "altitudeFeet",
  "groundSpeedKnots",
  "trackDegrees",
  "latitude",
  "longitude",
  "verticalRateFeetPerMinute",
  "squawk",
  "alert",
  "emergency",
  "spi",
  "onGround",
];
const numericFields = new Set([
  "transmissionType",
  "altitudeFeet",
  "groundSpeedKnots",
  "trackDegrees",
  "latitude",
  "longitude",
  "verticalRateFeetPerMinute",
  "alert",
  "emergency",
  "spi",
  "onGround",
]);

export function parseSbsFields(values) {
  return Object.fromEntries(
    fieldNames.map((name, index) => [name, fieldValue(values[index], name)]),
  );
}

function fieldValue(value, name) {
  const cleanValue = value?.trim() ?? "";
  if (!cleanValue) return null;
  if (name === "icao") return cleanValue.toUpperCase();
  if (!numericFields.has(name)) return cleanValue;
  const number = Number(cleanValue);
  return Number.isFinite(number) ? number : cleanValue;
}
