import { MAX_RADAR_RANGE } from "../../radar/range.mjs";
import { default as drawAirportRunway } from "./runway/draw.mjs";

function drawAirportRunways(
  context,
  airports,
  project,
  runwaysVisible = true,
  extensionsVisible = true,
  baseLegsVisible = true,
) {
  for (const airport of airports.values()) {
    if (airport.rangeNm > MAX_RADAR_RANGE) continue;
    for (const runway of airport.runways ?? []) {
      drawAirportRunway(
        context,
        runway,
        airport,
        project,
        runwaysVisible,
        extensionsVisible,
        baseLegsVisible,
      );
    }
  }
}
export default drawAirportRunways;
