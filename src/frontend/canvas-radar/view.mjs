import { createCanvasRadarDraw } from "../create/canvas/radar/draw.mjs";
import { DEFAULT_RADAR_RANGE } from "../radar/range.mjs";
import { createCanvasRadarAircraftState } from "../create/canvas/radar/aircraft-state.mjs";
import { createCanvasRadarState } from "../create/canvas/radar/state.mjs";
import { createViewChangeListeners } from "../create/view-change-listeners.mjs";
import { createRadarReferenceStore } from "../radar/reference/store.mjs";
import { attachCanvasRadarEvents } from "../attach/canvas/radar-events.mjs";
import { createRadarLayerVisibility } from "../create/radar/layer/visibility.mjs";
import { createCanvasRadarWater } from "../create/canvas/radar/water.mjs";
import { syncCanvasRadarVisibility } from "../sync-canvas-radar-visibility.mjs";
import { createCanvasRadarViewState } from "../create/canvas/radar/view-state.mjs";
import { getRadarCanvasViewport } from "./viewport.mjs";
import { radarLegendTopInset } from "../draw/radar/legend/entries.mjs";
import { createCanvasRadarSurface } from "./surface.mjs";
export function createCanvasRadarView({
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
    legendTopInset,
  });
  draw = () => {
    drawRadar();
    waterLayer.update();
    viewChanges.emit(state.range);
  };
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
  );
  draw();
  const viewState = createCanvasRadarState(
    state,
    draw,
    () => targets.localDistances(),
    viewChanges,
  );
  return {
    mode: "2D",
    setConnected(connected) {
      state.connected = connected;
      draw();
    },
    update: aircraftState.update,
    updateSnapshot: aircraftState.updateSnapshot,
    updateRemote: aircraftState.updateRemote,
    isLocalOnly: layers.aircraft.isLocalOnly,
    ...references.updates(() => {}, draw),
    setIlsVisible: layers.ils.setVisible,
    ...viewState,
    getViewportBounds: () => getRadarCanvasViewport(canvas, state),
    visibleRadiusNm() {
      return this.getViewportBounds().visibleRadiusNm;
    },
    destroy() {
      detachEvents();
      layers.destroy();
      waterLayer.destroy();
      viewChanges.clear();
      surface.destroy();
    },
  };
}
