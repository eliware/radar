export function windSpeedText(wind) {
  if (!wind) return "—";
  return `${wind.speed}${wind.gust == null ? "" : `G${wind.gust}`}`;
}
