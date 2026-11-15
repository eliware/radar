import { getRadarPalette } from "../../radar/palette.mjs";
import { drawAircraftHistory } from "./history.mjs";
import { drawAircraftTags } from "./tags.mjs";
import { drawAircraftTracks } from "./tracks.mjs";
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
    drawAircraftTracks(context, aircraft, palette.bright, previousAlpha, now);
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
