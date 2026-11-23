import { default as getMetarAgeMinutes } from "../../../shared/metar/age.mjs";

function metarAgeStatusClass(observed, now) {
  return getMetarAgeMinutes(observed, now) > 60 ? " metar-age-old" : "";
}
export default metarAgeStatusClass;
