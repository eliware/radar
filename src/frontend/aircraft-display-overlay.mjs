import { projectAircraftPosition } from "./aircraft-space-position.mjs";
import { formatAircraftTag } from "./aircraft-tag-data.mjs";
import { drawAircraftDisplay } from "./draw-aircraft-display.mjs";
import { predictAircraftPosition } from "./predict-aircraft-position.mjs";
import { RADAR_SCOPE_RADIUS_RATIO } from "./radar-range.mjs";
import { drawRadarScaleLegend } from "./draw-radar-scale-legend.mjs";

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

  function draw(aircraft, trails, location, elevationFeet, camera, range) {
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    const ratio = Math.min(windowRef.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    const items = [];
    for (const item of aircraft.values()) items.push(projectItem(item));
    drawAircraftDisplay(context, items.filter(Boolean), 18, width, height);
    drawRadarScaleLegend(
      context,
      width,
      height,
      range,
      Math.min(width, height) * RADAR_SCOPE_RADIUS_RATIO,
    );

    function projectItem(item) {
      const position = projectAircraftPosition(item, location, elevationFeet);
      if (!position) return null;
      const marker = project(position);
      const prediction = predictAircraftPosition(position, item);
      const future = prediction ? project(prediction) : null;
      const history = trails.get(item.icao).map(project);
      return {
        ...marker,
        futureX: future?.x,
        futureY: future?.y,
        lines: formatAircraftTag(item),
        history,
      };
    }

    function project(position) {
      const point = new THREE.Vector3(position.x, position.y, position.z).project(camera);
      return { x: ((point.x + 1) * width) / 2, y: ((1 - point.y) * height) / 2 };
    }
  }

  return { canvas, draw, destroy: () => canvas.remove() };
}
