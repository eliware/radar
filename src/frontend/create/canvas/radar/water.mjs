import { default as createCanvasWater } from "../water.mjs";

function createCanvasRadarWater(documentRef, windowRef, location, canvas, state, getDrawRadar) {
  const data = { paths: [], visible: true, isVisible: () => data.visible };
  const water = createCanvasWater(documentRef, windowRef, location, canvas, state, data, () =>
    getDrawRadar()(),
  );
  return { data, update: water.update, destroy: water.destroy };
}
export default createCanvasRadarWater;
