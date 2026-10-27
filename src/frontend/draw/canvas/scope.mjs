import { createCanvasRadarProjector } from "../../create/canvas/radar/projector.mjs";
import { getRadarPalette } from "../../radar/palette.mjs";
import { prepareCanvasRadar } from "../../prepare-canvas-radar.mjs";
import { drawCanvasBackground } from "./background.mjs";
import { drawCanvasRings } from "./rings.mjs";

export function createCanvasRadarScope(
  context,
  canvas,
  range,
  panX,
  panY,
  windowRef,
  rotation = 0,
  connected = true,
) {
  const palette = getRadarPalette(connected);
  const { width, height } = prepareCanvasRadar(context, canvas, windowRef);
  drawCanvasBackground(context, width, height);
  const radius = Math.max(1, Math.min(width, height) * 0.44);
  const centerX = width / 2 + panX;
  const centerY = height / 2 + panY;
  const project = createCanvasRadarProjector(centerX, centerY, radius, range, rotation);
  return {
    width,
    height,
    radius,
    centerX,
    centerY,
    project,
    palette,
    drawRings() {
      context.save();
      context.translate(centerX, centerY);
      context.rotate(rotation);
      drawCanvasRings(context, 0, 0, radius, range, palette, rotation);
      context.restore();
    },
  };
}
