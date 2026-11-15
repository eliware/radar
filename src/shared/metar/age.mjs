export function getMetarAgeMinutes(observed, now = new Date()) {
  const match = String(observed ?? "").match(/^(\d{1,2}) (\d{2}):(\d{2})Z$/);
  if (!match) return null;
  const [, day, hour, minute] = match;
  const dayNumber = Number(day);
  const hourNumber = Number(hour);
  const minuteNumber = Number(minute);
  if (dayNumber < 1 || dayNumber > 31 || hourNumber > 23 || minuteNumber > 59) return null;
  let month = now.getUTCMonth();
  let year = now.getUTCFullYear();
  if (dayNumber > now.getUTCDate()) {
    const previousMonth = new Date(Date.UTC(year, month - 1, 1));
    month = previousMonth.getUTCMonth();
    year = previousMonth.getUTCFullYear();
  }
  while (dayNumber > daysInMonth(year, month)) {
    const previousMonth = new Date(Date.UTC(year, month - 1, 1));
    month = previousMonth.getUTCMonth();
    year = previousMonth.getUTCFullYear();
  }
  const date = new Date(Date.UTC(year, month, dayNumber, hourNumber, minuteNumber));
  let stamp = date.getTime();
  if (stamp > now.getTime()) stamp = now.getTime();
  return Math.max(0, Math.floor((now.getTime() - stamp) / 60000));
}

function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}
