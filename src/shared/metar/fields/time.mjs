export function timeText({ day, hour, minute }) {
  if (day == null || hour == null || minute == null) return "—";
  return `${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}Z`;
}
