import { drawAircraftDisplay } from "../draw/aircraft/display.mjs";
import { RADAR_SCOPE_RADIUS_RATIO } from "../radar/range.mjs";
import { drawRadarScaleLegend } from "../draw/radar/scale-legend.mjs";
import { drawRadarReferences } from "../draw/radar/references.mjs";
import { projectAircraftDisplayItems } from "../project/aircraft-display-items.mjs";
import { projectRadarReference } from "../project/radar-reference.mjs";
import { drawCameraReadout } from "../draw/camera-readout.mjs";
import { resizeOverlayCanvas } from "./resize-overlay-canvas.mjs";
import { createCameraProjector } from "../project/camera-position.mjs";

export function createOverlayDrawer({ THREE, container, windowRef, canvas, context }) {
  let projectorCamera, projectCameraPosition;
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
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    const ratio = Math.min(windowRef.devicePixelRatio || 1, 2);
    resizeOverlayCanvas(canvas, context, width, height, ratio);
    if (projectorCamera !== camera) {
      projectorCamera = camera;
      projectCameraPosition = createCameraProjector(THREE, camera);
    }
    context.clearRect(0, 0, width, height);
    drawRadarReferences(
      context,
      { airports, navaids, boundaries, ilsApproaches, procedures, airways },
      (point) => projectRadarReference(point, location, elevationFeet, project),
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
      range,
      Math.min(width, height) * RADAR_SCOPE_RADIUS_RATIO,
      connected,
      ilsVisible,
      procedureVisibility,
      waterVisible,
      airwayVisibility,
      runwayVisibility,
      referenceVisibility,
    );
    drawCameraReadout(context, camera, location, elevationFeet, width);

    function project(position) {
      return projectCameraPosition(position, width, height);
    }
  };
}
