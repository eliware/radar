import { getMetarAgeMinutes } from "../../../shared/metar/age.mjs";

export function metarAgeStatusClass(observed, now) {
  return getMetarAgeMinutes(observed, now) > 60 ? " metar-age-old" : "";
}
