const unusableCallsigns = new Set(["AD", "OK", "RM", "UNKNOWN", "-"]);

export function hasUsefulCallsign(callsign) {
  const value = typeof callsign === "string" ? callsign.trim().toUpperCase() : "";
  return Boolean(value && !unusableCallsigns.has(value));
}

export function retainUsefulCallsign(previous, incoming) {
  return hasUsefulCallsign(incoming) || !hasUsefulCallsign(previous) ? incoming : previous;
}
