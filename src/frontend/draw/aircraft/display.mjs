import { default as getRadarPalette } from "../../radar/palette.mjs";
import { default as drawAircraftHistory } from "./history.mjs";
import { default as drawAircraftTags } from "./tags.mjs";
import { default as drawAircraftTracks } from "./tracks.mjs";
import { default as withAircraftDrawingStyle } from "./style.mjs";

function drawAircraftDisplay(
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
export default drawAircraftDisplay;
