import { projectAircraftPosition } from "./aircraft-space-position.mjs";
import { createCanvasRadarDraw } from "./create-canvas-radar-draw.mjs";
import { DEFAULT_RADAR_RANGE, selectDefaultRadarRange } from "./radar-range.mjs";
import { createRadarTargets } from "./radar-targets.mjs";
import { createAircraftTrails } from "./aircraft-trails.mjs";
import { createCanvasRadarState } from "./create-canvas-radar-state.mjs";
import { createViewChangeListeners } from "./create-view-change-listeners.mjs";
import { createRadarReferenceStore } from "./radar-reference-store.mjs";
import { attachCanvasRadarEvents } from "./attach-canvas-radar-events.mjs";
import { createIlsVisibility } from "./create-ils-visibility.mjs";
export function createCanvasRadarView({
  container,
  location,
  windowRef = window,
  documentRef = document,
}) {
  const canvas = documentRef.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D is unavailable in this browser.");
  const targets = createRadarTargets();
  const trails = createAircraftTrails();
  const references = createRadarReferenceStore();
  const state = {
    range: DEFAULT_RADAR_RANGE,
    autoZoom: true,
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
    connected: false,
    ilsVisible: true,
  };
  const viewChanges = createViewChangeListeners();
  canvas.setAttribute("aria-label", "Top-down 2D radar view");
  canvas.style.touchAction = "none";
  container.replaceChildren(canvas);
  const drawRadar = createCanvasRadarDraw({
    context,
    canvas,
    targets,
    location,
    state,
    windowRef,
    trails,
    airports: references.airports,
    navaids: references.navaids,
    boundaries: references.boundaries,
    ilsApproaches: references.ilsApproaches,
  });
  const draw = () => {
    state.ilsVisible = ils.isVisible();
    drawRadar();
    viewChanges.emit(state.range);
  };
  const ils = createIlsVisibility(documentRef, draw);
  const detachEvents = attachCanvasRadarEvents(canvas, state, draw, targets, trails, windowRef);
  draw();
  const viewState = createCanvasRadarState(state, draw, () => targets.distances(), viewChanges);
  return {
    mode: "2D",
    setConnected(connected) {
      state.connected = connected;
      draw();
    },
    update(item) {
      const position = projectAircraftPosition(item, location, 0);
      if (!position) return;
      const expired = targets.update(item, Math.hypot(position.x, position.z));
      trails.remove(expired);
      trails.add(item.icao, position);
      if (state.autoZoom) state.range = selectDefaultRadarRange(targets.distances());
      draw();
    },
    ...references.updates(() => {}, draw),
    setIlsVisible: ils.setVisible,
    ...viewState,
    destroy() {
      detachEvents();
      ils.destroy();
      viewChanges.clear();
      container.replaceChildren();
    },
  };
}
