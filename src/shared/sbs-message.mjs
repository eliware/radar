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

function fieldValue(value, name) {
  const cleanValue = value?.trim() ?? "";
  if (!cleanValue) return null;
  if (name === "icao") return cleanValue.toUpperCase();
  if (!numericFields.has(name)) return cleanValue;
  const number = Number(cleanValue);
  return Number.isFinite(number) ? number : cleanValue;
}

export function parseSbsMessage(line) {
  const values = line.split(",");
  const recordType = values[0];
  if (!["MSG", "STA", "ID", "AIR", "SEL", "CLK"].includes(recordType)) return null;
  return Object.fromEntries(
    fieldNames.map((name, index) => [name, fieldValue(values[index], name)]),
  );
}
