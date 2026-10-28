export function createCanvasRadarViewDraw({ drawRadar, waterLayer, state, viewChanges }) {
  return () => {
    drawRadar();
    waterLayer.update();
    viewChanges.emit(state.range);
  };
}
