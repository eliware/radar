import { default as createCanvasRadarProjector } from "../../create/canvas/radar/projector.mjs";
import { default as getRadarPalette } from "../../radar/palette.mjs";
import { default as prepareCanvasRadar } from "../../prepare-canvas-radar.mjs";
import { default as drawCanvasBackground } from "./background.mjs";
import { default as drawCanvasRings } from "./rings.mjs";

function createCanvasRadarScope(
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
export default createCanvasRadarScope;
