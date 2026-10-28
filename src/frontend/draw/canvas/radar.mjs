import { projectAircraftDisplayItems } from "../../project/aircraft-display-items.mjs";
import { drawAircraftDisplay } from "../aircraft/display.mjs";
import { drawRadarScale } from "../radar/scale.mjs";
import { drawRadarScaleLegend } from "../radar/legend/table.mjs";
import { drawCanvasRadarReferences } from "./radar-references.mjs";
import { drawCanvasRadarWater } from "../water/canvas.mjs";
import { createCanvasRadarScope } from "./scope.mjs";
import { drawHomeMarker } from "./home.mjs";
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
  runwayVisibility = { runwaysVisible: true, extensionsVisible: true, baseLegsVisible: true },
  referenceVisibility = { airportsVisible: true, navaidsVisible: true },
  legendTopInset = 0,
) {
  const scope = createCanvasRadarScope(
    ctx,
    canvas,
    range,
    panX,
    panY,
    windowRef,
    rotation,
    connected,
  );
  const { width, height, radius, centerX, centerY, project, palette } = scope;
  drawCanvasRadarWater(ctx, waterVisible, waterPaths, project, location, width, height);
  scope.drawRings();
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
  drawHomeMarker(ctx, centerX, centerY, palette.bright);
  drawRadarScaleLegend(
    ctx,
    width,
    height,
    connected,
    ilsVisible,
    procedureVisibility,
    waterVisible,
    airwayVisibility,
    runwayVisibility,
    referenceVisibility,
    legendTopInset,
  );
  drawRadarScale(ctx, range, radius, height);
}
