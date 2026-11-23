import { default as formatMetarAge } from "../../../shared/metar/age-format.mjs";
import { default as metarAgeStatusClass } from "./status.mjs";

function formatMetarAgeDisplay(observed, now) {
  return {
    text: formatMetarAge(observed, now),
    statusClass: metarAgeStatusClass(observed, now),
  };
}
export default formatMetarAgeDisplay;
