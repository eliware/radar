import { drawAircraftTrack } from "./track.mjs";
import { getAircraftHistoryMarks } from "./history-data.mjs";

export function drawAircraftHistory(context, aircraft, trailColor, now = Date.now()) {
  const previousAlpha = context.globalAlpha ?? 1;
  context.strokeStyle = trailColor;
  for (const { point, opacity } of getAircraftHistoryMarks(aircraft, now)) {
    context.globalAlpha = previousAlpha * opacity;
    drawAircraftTrack(context, point);
  }
  context.globalAlpha = previousAlpha;
}
