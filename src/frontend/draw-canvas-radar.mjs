import { projectAircraftDisplayItems } from "./project-aircraft-display-items.mjs";
import { drawAircraftDisplay } from "./draw-aircraft-display.mjs";
import { drawRadarScaleLegend } from "./draw-radar-scale-legend.mjs";
import { drawCanvasRadarReferences } from "./draw-canvas-radar-references.mjs";
import { getRadarPalette } from "./radar-palette.mjs";
import { drawCanvasRings } from "./draw-canvas-rings.mjs";
import { drawWaterOutlines } from "./draw-water-outlines.mjs";
import { prepareCanvasRadar } from "./prepare-canvas-radar.mjs";
import { createCanvasRadarProjector } from "./create-canvas-radar-projector.mjs";
export function drawCanvasRadar(
  ctx,
  canvas,
  aircraft,
  location,
  range,
  panX,
  panY,
  windowRef,
  rotation = 0,
  trails = new Map(),
  connected = true,
  airports = new Map(),
  navaids = new Map(),
  boundaries = new Map(),
  ilsApproaches = new Map(),
  ilsVisible = true,
  procedures = new Map(),
  procedureVisibility = { sidVisible: true, starVisible: true },
  waterPaths = [],
  waterVisible = true,
  homeElevationFeet = 0,
  airways = new Map(),
  airwayVisibility = { Q: true, J: true, V: true },
  runwayVisibility = { runwaysVisible: true, extensionsVisible: true },
  referenceVisibility = { airportsVisible: true, navaidsVisible: true },
) {
  const palette = getRadarPalette(connected);
  const { width, height } = prepareCanvasRadar(ctx, canvas, windowRef);
  const radius = Math.max(1, Math.min(width, height) * 0.44);
  const centerX = width / 2 + panX;
  const centerY = height / 2 + panY;
  const project = createCanvasRadarProjector(centerX, centerY, radius, range, rotation);
  if (waterVisible) drawWaterOutlines(ctx, waterPaths, project, location);
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);
  drawCanvasRings(ctx, 0, 0, radius, range, palette, rotation);
  ctx.restore();
  drawCanvasRadarReferences({
    ctx,
    location,
    range,
    radius,
    centerX,
    centerY,
    project,
    airports,
    navaids,
    boundaries,
    ilsApproaches,
    procedures,
    airways,
    ilsVisible,
    procedureVisibility,
    airwayVisibility,
    runwayVisibility,
    referenceVisibility,
  });
  const display = projectAircraftDisplayItems(
    aircraft,
    trails,
    location,
    homeElevationFeet,
    project,
  );
  drawAircraftDisplay(ctx, display, 9, width, height, connected);
  ctx.fillStyle = palette.bright;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
  ctx.fill();
  drawRadarScaleLegend(
    ctx,
    width,
    height,
    range,
    radius,
    connected,
    ilsVisible,
    procedureVisibility,
    waterVisible,
    airwayVisibility,
    runwayVisibility,
    referenceVisibility,
  );
}
