import { getRadarCanvasViewport } from "../viewport.mjs";

export function createCanvasRadarViewApi({
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
}) {
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
