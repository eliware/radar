import { MAX_RADAR_RANGE } from "../../radar/range.mjs";
import { drawRunwayGuides } from "./guides.mjs";
import { drawRunwaySegment } from "./runway/segment.mjs";

export function drawAirportRunways(
  context,
  airports,
  project,
  runwaysVisible = true,
  extensionsVisible = true,
  baseLegsVisible = true,
) {
  context.strokeStyle = "#777777";
  context.lineWidth = 1.5;
  context.setLineDash([]);
  for (const airport of airports.values()) {
    if (airport.rangeNm > MAX_RADAR_RANGE) continue;
    for (const runway of airport.runways ?? []) {
      const ends = drawRunwaySegment(context, runway, airport, project, runwaysVisible);
      if (!ends) continue;
      if (extensionsVisible || baseLegsVisible)
        for (const end of ends)
          drawRunwayGuides(context, end, project, extensionsVisible, baseLegsVisible);
    }
  }
}
