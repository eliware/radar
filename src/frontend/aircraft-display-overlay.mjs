import { drawAircraftDisplay } from "./draw-aircraft-display.mjs";
import { RADAR_SCOPE_RADIUS_RATIO } from "./radar-range.mjs";
import { drawRadarScaleLegend } from "./draw-radar-scale-legend.mjs";
import { drawRadarReferences } from "./draw-radar-references.mjs";
import { createRadarScopePath } from "./create-radar-scope-path.mjs";
import { projectAircraftDisplayItems } from "./project-aircraft-display-items.mjs";
import { projectRadarReference } from "./project-radar-reference.mjs";

export function createAircraftDisplayOverlay({ THREE, container, windowRef, documentRef }) {
  const canvas = documentRef.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D is unavailable in this browser.");
  Object.assign(canvas.style, {
    position: "absolute",
    inset: "0",
    zIndex: "1",
    pointerEvents: "none",
  });
  container.appendChild(canvas);

  function draw(
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
    proceduresVisible = true,
    waterVisible = true,
  ) {
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    const ratio = Math.min(windowRef.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    drawRadarReferences(
      context,
      { airports, navaids, boundaries, ilsApproaches, procedures },
      (point) => projectRadarReference(point, location, elevationFeet, project),
      range,
      ilsVisible,
      proceduresVisible,
      createRadarScopePath(range, (position) => project(position)),
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
      proceduresVisible,
      waterVisible,
    );

    function project(position) {
      const point = new THREE.Vector3(position.x, position.y, position.z).project(camera);
      return { x: ((point.x + 1) * width) / 2, y: ((1 - point.y) * height) / 2 };
    }
  }

  return { canvas, draw, destroy: () => canvas.remove() };
}
