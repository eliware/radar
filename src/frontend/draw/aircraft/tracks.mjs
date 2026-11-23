import { default as getAircraftAgeBrightness } from "../../aircraft/age-brightness.mjs";
import { default as displayColor } from "./display-color.mjs";
import { default as drawAircraftTrack } from "./track.mjs";

function drawAircraftTracks(context, aircraft, normalColor, previousAlpha, now) {
  for (const item of aircraft) {
    const color = displayColor(item, normalColor, now);
    context.fillStyle = color;
    context.strokeStyle = color;
    context.globalAlpha = previousAlpha * getAircraftAgeBrightness(item.receivedAt, now);
    drawAircraftTrack(context, item);
  }
}
export default drawAircraftTracks;
