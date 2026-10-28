import { formatMetarAge } from "../../../shared/metar/age-format.mjs";
import { metarAgeStatusClass } from "./status.mjs";

export function formatMetarAgeDisplay(observed, now) {
  return {
    text: formatMetarAge(observed, now),
    statusClass: metarAgeStatusClass(observed, now),
  };
}
