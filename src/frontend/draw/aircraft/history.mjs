import { default as drawAircraftTrack } from "./track.mjs";
import { default as getAircraftHistoryMarks } from "./history-data.mjs";

function drawAircraftHistory(context, aircraft, trailColor, now = Date.now()) {
  const previousAlpha = context.globalAlpha ?? 1;
  context.strokeStyle = trailColor;
  for (const { point, opacity } of getAircraftHistoryMarks(aircraft, now)) {
    context.globalAlpha = previousAlpha * opacity;
    drawAircraftTrack(context, point);
  }
  context.globalAlpha = previousAlpha;
}
export default drawAircraftHistory;
