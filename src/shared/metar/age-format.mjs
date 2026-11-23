import { default as getMetarAgeMinutes } from "./age.mjs";

function formatMetarAge(observed, now = new Date()) {
  const ageMinutes = getMetarAgeMinutes(observed, now);
  if (ageMinutes === null) return "—";
  const hours = Math.floor(ageMinutes / 60);
  const minutes = ageMinutes % 60;
  return hours ? `${hours}h${minutes ? `${minutes}m` : ""}` : `${minutes}m`;
}
export default formatMetarAge;
