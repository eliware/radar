const unusableCallsigns = new Set(["AD", "OK", "RM", "UNKNOWN", "-"]);

function hasUsefulCallsign(callsign) {
  const value = typeof callsign === "string" ? callsign.trim().toUpperCase() : "";
  return Boolean(value && !unusableCallsigns.has(value));
}
export default hasUsefulCallsign;
