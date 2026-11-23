import { default as shiftWaterCenter } from "./shift-water-center.mjs";

function loadSceneWaterView(loader, location, target, range, setPaths) {
  const center = shiftWaterCenter(location, target.x, -target.z);
  loader.load(center, range, setPaths);
}
export default loadSceneWaterView;
