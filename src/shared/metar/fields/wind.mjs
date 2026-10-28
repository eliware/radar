export function windDirectionText(wind) {
  if (!wind) return "—";
  return wind.degrees == null ? wind.direction : `${String(wind.degrees).padStart(3, "0")}°`;
}

export function windSpeedText(wind) {
  if (!wind) return "—";
  return `${wind.speed}${wind.gust == null ? "" : `G${wind.gust}`}`;
}
