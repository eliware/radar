import { shiftWaterCenter } from "./shift-water-center.mjs";

export function loadSceneWaterView(loader, location, target, range, setPaths) {
  const center = shiftWaterCenter(location, target.x, -target.z);
  loader.load(center, range, setPaths);
}
