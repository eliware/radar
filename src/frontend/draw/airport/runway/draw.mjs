import { default as drawRunwayGuides } from "../guides.mjs";
import { default as drawRunwayLine } from "./line.mjs";
import { default as drawRunwaySegment } from "./segment.mjs";

function drawAirportRunway(
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
  if (runwaysVisible && points.length === 2) drawRunwayLine(context, points[0], points[1]);
  if (extensionsVisible || baseLegsVisible)
    for (const end of ends)
      drawRunwayGuides(context, end, project, extensionsVisible, baseLegsVisible);
}
export default drawAirportRunway;
