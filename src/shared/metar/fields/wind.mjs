export function windDirectionText(wind) {
  if (!wind) return "—";
  return wind.degrees == null ? wind.direction : `${String(wind.degrees).padStart(3, "0")}°`;
}
