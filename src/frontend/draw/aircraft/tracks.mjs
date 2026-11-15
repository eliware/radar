import { getAircraftAgeBrightness } from "../../aircraft/age-brightness.mjs";
import { displayColor } from "./display-color.mjs";
import { drawAircraftTrack } from "./track.mjs";

export function drawAircraftTracks(context, aircraft, normalColor, previousAlpha, now) {
  for (const item of aircraft) {
    const color = displayColor(item, normalColor, now);
    context.fillStyle = color;
    context.strokeStyle = color;
    context.globalAlpha = previousAlpha * getAircraftAgeBrightness(item.receivedAt, now);
    drawAircraftTrack(context, item);
  }
}
