import { getAircraftAgeBrightness } from "../../aircraft/age-brightness.mjs";
import { getRadarPalette } from "../../radar/palette.mjs";
import { displayColor } from "./display-color.mjs";
import { drawAircraftHistory } from "./history.mjs";
import { drawAircraftTags } from "./tags.mjs";
import { drawAircraftTrack } from "./track.mjs";
import { withAircraftDrawingStyle } from "./style.mjs";

export function drawAircraftDisplay(
  context,
  aircraft,
  fontSize,
  width,
  height,
  connected = true,
  now = Date.now(),
) {
  return withAircraftDrawingStyle(context, () => {
    const palette = getRadarPalette(connected);
    const previousAlpha = context.globalAlpha ?? 1;
    drawAircraftHistory(context, aircraft, palette.trail, now);
    context.fillStyle = palette.bright;
    context.strokeStyle = palette.bright;
    for (const item of aircraft) {
      const color = displayColor(item, palette.bright, now);
      context.fillStyle = color;
      context.strokeStyle = color;
      context.globalAlpha = previousAlpha * getAircraftAgeBrightness(item.receivedAt);
      drawAircraftTrack(context, item);
    }
    drawAircraftTags(
      context,
      aircraft,
      fontSize,
      width,
      height,
      palette.bright,
      previousAlpha,
      now,
    );
  });
}
