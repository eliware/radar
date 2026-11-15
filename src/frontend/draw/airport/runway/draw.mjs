import { drawRunwayGuides } from "../guides.mjs";
import { drawRunwayLine } from "./line.mjs";
import { drawRunwaySegment } from "./segment.mjs";

export function drawAirportRunway(
  context,
  runway,
  airport,
  project,
  runwaysVisible,
  extensionsVisible,
  baseLegsVisible,
) {
  const segment = drawRunwaySegment(runway, airport, project);
  if (!segment) return;

  context.strokeStyle = "#777777";
  context.lineWidth = 1.5;
  context.setLineDash([]);
  const { ends, points } = segment;
  if (runwaysVisible) drawRunwayLine(context, points[0], points[1]);
  if (extensionsVisible || baseLegsVisible)
    for (const end of ends)
      drawRunwayGuides(context, end, project, extensionsVisible, baseLegsVisible);
}
