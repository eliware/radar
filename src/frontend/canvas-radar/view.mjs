import { default as createCanvasRadarDraw } from "../create/canvas/radar/draw.mjs";
import { DEFAULT_RADAR_RANGE } from "../radar/range.mjs";
import { default as createCanvasRadarAircraftState } from "../create/canvas/radar/aircraft-state.mjs";
import { default as createCanvasRadarState } from "../create/canvas/radar/state.mjs";
import { default as createViewChangeListeners } from "../create/view-change-listeners.mjs";
import { default as createRadarReferenceStore } from "../radar/reference/store.mjs";
import { default as attachCanvasRadarEvents } from "../attach/canvas/radar-events.mjs";
import { default as createRadarLayerVisibility } from "../create/radar/layer/visibility.mjs";
import { default as createCanvasRadarWater } from "../create/canvas/radar/water.mjs";
import { default as syncCanvasRadarVisibility } from "../sync-canvas-radar-visibility.mjs";
import { default as createCanvasRadarViewState } from "../create/canvas/radar/view-state.mjs";
import { default as radarLegendTopInset } from "../draw/radar/legend/top-inset.mjs";
import { default as createCanvasRadarSurface } from "./surface.mjs";
import { default as createCanvasRadarViewApi } from "./view/api.mjs";
import { default as createCanvasRadarViewDraw } from "./view/draw.mjs";
function createCanvasRadarView({
  container,
  location,
  elevationFeet = 0,
  defaultRangeNm = DEFAULT_RADAR_RANGE,
  defaultRotationDegrees = 0,
  windowRef = window,
  documentRef = document,
}) {
  const surface = createCanvasRadarSurface(container, documentRef);
  const { canvas, context } = surface;
  const defaultRotationRadians = (-defaultRotationDegrees * Math.PI) / 180 || 0;
  const references = createRadarReferenceStore();
  const legendTopInset = radarLegendTopInset(windowRef);
  const state = createCanvasRadarViewState(defaultRangeNm, defaultRotationRadians);
  const viewChanges = createViewChangeListeners();
  let draw;
  const aircraftState = createCanvasRadarAircraftState(location, state, () => draw());
  const { targets, trails, receiveTimes } = aircraftState;
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
    getTargetItems: aircraftState.items,
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
    legendTopInset,
  });
  draw = createCanvasRadarViewDraw({ drawRadar, waterLayer, state, viewChanges });
  const layers = createRadarLayerVisibility(documentRef, () => {
    syncCanvasRadarVisibility(state, layers);
    draw();
  });
  syncCanvasRadarVisibility(state, layers);
  const detachEvents = attachCanvasRadarEvents(
    canvas,
    state,
    draw,
    targets,
    trails,
    windowRef,
    legendTopInset,
    receiveTimes,
  );
  draw();
  const viewState = createCanvasRadarState(
    state,
    draw,
    () => targets.localDistances(),
    viewChanges,
  );
  return createCanvasRadarViewApi({
    state,
    aircraftState,
    layers,
    references,
    viewState,
    canvas,
    draw,
    detachEvents,
    waterLayer,
    viewChanges,
    surface,
  });
}
export default createCanvasRadarView;
