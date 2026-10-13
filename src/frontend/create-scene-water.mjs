import { createWaterOutlineLoader } from "./water-outline-loader.mjs";
import { createWaterSceneLayer } from "./create-water-scene-layer.mjs";
import { createWaterLayerControl } from "./create-water-layer-control.mjs";
import { shiftWaterCenter } from "./shift-water-center.mjs";
import { getWaterFetch } from "./get-water-fetch.mjs";

export function createSceneWater(THREE, scene, location, elevationFeet, controls, windowRef) {
  const layer = createWaterSceneLayer(THREE, scene, location, elevationFeet);
  const loader = createWaterOutlineLoader(getWaterFetch(windowRef));
  const control = createWaterLayerControl(windowRef.document, layer.setVisible);
  return {
    load(range) {
      const center = shiftWaterCenter(location, controls.target.x, -controls.target.z);
      loader.load(center, range, layer.setPaths);
    },
    destroy() {
      loader.cancel();
      control.destroy();
      layer.dispose();
    },
  };
}
