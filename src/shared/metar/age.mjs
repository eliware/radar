import { default as selectMetarObservationDate } from "./observation-date.mjs";

function getMetarAgeMinutes(observed, now = new Date()) {
  const match = String(observed ?? "").match(/^(\d{1,2}) (\d{2}):(\d{2})Z$/);
  if (!match) return null;
  const [, day, hour, minute] = match;
  const dayNumber = Number(day);
  const hourNumber = Number(hour);
  const minuteNumber = Number(minute);
  if (dayNumber < 1 || dayNumber > 31 || hourNumber > 23 || minuteNumber > 59) return null;
  const date = selectMetarObservationDate(dayNumber, now);
  date.setUTCHours(hourNumber, minuteNumber);
  let stamp = date.getTime();
  if (stamp > now.getTime()) stamp = now.getTime();
  return Math.max(0, Math.floor((now.getTime() - stamp) / 60000));
}
export default getMetarAgeMinutes;
