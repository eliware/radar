import { drawAircraftDisplay } from "../draw/aircraft/display.mjs";
import { RADAR_SCOPE_RADIUS_RATIO } from "../radar/range.mjs";
import { drawRadarScale } from "../draw/radar/scale.mjs";
import { drawRadarScaleLegend } from "../draw/radar/legend/draw-scale-legend.mjs";
import { drawRadarReferences } from "../draw/radar/references.mjs";
import { projectAircraftDisplayItems } from "../project/aircraft-display-items.mjs";
import { drawCameraReadout } from "./overlay/readout.mjs";
import { createOverlayProjection } from "./overlay/projection.mjs";

export function createOverlayDrawer({ THREE, container, windowRef, canvas, context }) {
  const projection = createOverlayProjection({ THREE, container, windowRef, canvas, context });
  return function draw(
    aircraft,
    trails,
    location,
    elevationFeet,
    camera,
    range,
    connected = true,
    airports = new Map(),
    navaids = new Map(),
    boundaries = new Map(),
    ilsApproaches = new Map(),
    ilsVisible = true,
    procedures = new Map(),
    procedureVisibility = { sidVisible: true, starVisible: true },
    waterVisible = true,
    airways = new Map(),
    airwayVisibility = { Q: true, J: true, V: true },
    runwayVisibility = { runwaysVisible: true, extensionsVisible: true, baseLegsVisible: true },
    referenceVisibility = { airportsVisible: true, navaidsVisible: true },
  ) {
    const { width, height, project, projectReference } = projection.prepare(
      camera,
      location,
      elevationFeet,
    );
    context.clearRect(0, 0, width, height);
    drawRadarReferences(
      context,
      { airports, navaids, boundaries, ilsApproaches, procedures, airways },
      projectReference,
      ilsVisible,
      procedureVisibility,
      airwayVisibility,
      runwayVisibility,
      referenceVisibility,
      // The 3D shell supplies airspace geometry. Skip flat rings to prevent duplicate ground edges.
      false,
    );
    const items = projectAircraftDisplayItems(aircraft, trails, location, elevationFeet, project);
    drawAircraftDisplay(context, items, 18, width, height, connected);
    drawRadarScaleLegend(
      context,
      width,
      height,
      connected,
      ilsVisible,
      procedureVisibility,
      waterVisible,
      airwayVisibility,
      runwayVisibility,
      referenceVisibility,
    );
    drawRadarScale(context, range, Math.min(width, height) * RADAR_SCOPE_RADIUS_RATIO, height);
    drawCameraReadout(context, camera, location, elevationFeet, width);
  };
}
