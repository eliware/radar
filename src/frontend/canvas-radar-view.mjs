import { createCanvasRadarDraw } from "./create-canvas-radar-draw.mjs";
import { DEFAULT_RADAR_RANGE } from "./radar-range.mjs";
import { createCanvasRadarAircraftState } from "./create-canvas-radar-aircraft-state.mjs";
import { createCanvasRadarState } from "./create-canvas-radar-state.mjs";
import { createViewChangeListeners } from "./create-view-change-listeners.mjs";
import { createRadarReferenceStore } from "./radar-reference-store.mjs";
import { attachCanvasRadarEvents } from "./attach-canvas-radar-events.mjs";
import { createRadarLayerVisibility } from "./create-radar-layer-visibility.mjs";
import { createCanvasRadarWater } from "./create-canvas-radar-water.mjs";
import { syncCanvasRadarVisibility } from "./sync-canvas-radar-visibility.mjs";
import { createCanvasRadarViewState } from "./create-canvas-radar-view-state.mjs";
export function createCanvasRadarView({
  container,
  location,
  elevationFeet = 0,
  defaultRangeNm = DEFAULT_RADAR_RANGE,
  defaultRotationDegrees = 0,
  windowRef = window,
  documentRef = document,
}) {
  const canvas = documentRef.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D is unavailable in this browser.");
  const defaultRotationRadians = (-defaultRotationDegrees * Math.PI) / 180 || 0;
  const references = createRadarReferenceStore();
  const state = createCanvasRadarViewState(defaultRangeNm, defaultRotationRadians);
  const viewChanges = createViewChangeListeners();
  canvas.setAttribute("aria-label", "Top-down 2D radar view");
  canvas.style.touchAction = "none";
  container.replaceChildren(canvas);
  let draw;
  const aircraftState = createCanvasRadarAircraftState(location, state, () => draw());
  const { targets, trails } = aircraftState;
  let drawRadar;
  const waterLayer = createCanvasRadarWater(
    documentRef,
    windowRef,
    location,
    canvas,
    state,
    () => drawRadar,
  );
  drawRadar = createCanvasRadarDraw({
    context,
    canvas,
    targets,
    location,
    elevationFeet,
    state,
    windowRef,
    trails,
    airports: references.airports,
    navaids: references.navaids,
    boundaries: references.boundaries,
    ilsApproaches: references.ilsApproaches,
    procedures: references.procedures,
    airways: references.airways,
    water: waterLayer.data,
  });
  draw = () => {
    syncCanvasRadarVisibility(state, layers);
    drawRadar();
    waterLayer.update();
    viewChanges.emit(state.range);
  };
  const layers = createRadarLayerVisibility(documentRef, draw);
  const detachEvents = attachCanvasRadarEvents(canvas, state, draw, targets, trails, windowRef);
  draw();
  const viewState = createCanvasRadarState(state, draw, () => targets.distances(), viewChanges);
  return {
    mode: "2D",
    setConnected(connected) {
      state.connected = connected;
      draw();
    },
    update: aircraftState.update,
    ...references.updates(() => {}, draw),
    setIlsVisible: layers.ils.setVisible,
    ...viewState,
    destroy() {
      detachEvents();
      layers.destroy();
      waterLayer.destroy();
      viewChanges.clear();
      container.replaceChildren();
    },
  };
}
