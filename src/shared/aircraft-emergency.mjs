const EMERGENCY_SQUAWKS = new Set(["7600", "7700"]);
const HIJACK_SQUAWK = "7500";

export function getAircraftEmergencyLabel(aircraft) {
  const squawk = String(aircraft?.squawk ?? "")
    .trim()
    .padStart(4, "0");
  const emergency = String(aircraft?.emergency ?? "")
    .trim()
    .toLowerCase();
  if (
    squawk === HIJACK_SQUAWK ||
    ["5", "unlawful", "unlawful interference", "hijack"].includes(emergency)
  )
    return "HIJACK";
  if (EMERGENCY_SQUAWKS.has(squawk) || isEmergencyValue(emergency)) return "EMERG";
  return null;
}

function isEmergencyValue(value) {
  return value !== "" && !["0", "false", "none", "normal"].includes(value);
}
