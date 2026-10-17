export function getMetarAgeMinutes(observed, now = new Date()) {
  const match = String(observed ?? "").match(/^(\d{1,2}) (\d{2}):(\d{2})Z$/);
  if (!match) return null;
  const [, day, hour, minute] = match;
  let month = now.getUTCMonth();
  let year = now.getUTCFullYear();
  if (Number(day) > now.getUTCDate()) {
    month -= 1;
    if (month < 0) {
      month = 11;
      year -= 1;
    }
  }
  let stamp = Date.UTC(year, month, Number(day), Number(hour), Number(minute));
  if (stamp > now.getTime()) stamp = now.getTime();
  return Math.max(0, Math.floor((now.getTime() - stamp) / 60000));
}

export function formatMetarAge(observed, now = new Date()) {
  const ageMinutes = getMetarAgeMinutes(observed, now);
  if (ageMinutes === null) return "—";
  const hours = Math.floor(ageMinutes / 60);
  const minutes = ageMinutes % 60;
  return hours ? `${hours}h${minutes ? `${minutes}m` : ""}` : `${minutes}m`;
}
