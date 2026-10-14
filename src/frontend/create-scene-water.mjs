import { createWaterOutlineLoader } from "./water-outline-loader.mjs";
import { createWaterSceneLayer } from "./create-water-scene-layer.mjs";
import { createWaterVisibility } from "./create-water-visibility.mjs";
import { getWaterFetch } from "./get-water-fetch.mjs";
import { loadSceneWaterView } from "./load-scene-water-view.mjs";

export function createSceneWater(THREE, scene, location, elevationFeet, controls, windowRef) {
  const layer = createWaterSceneLayer(THREE, scene, location, elevationFeet);
  const loader = createWaterOutlineLoader(getWaterFetch(windowRef));
  const visibility = createWaterVisibility(windowRef.document, layer.setVisible);
  return {
    load(range) {
      loadSceneWaterView(loader, location, controls.target, range, layer.setPaths);
    },
    destroy() {
      loader.cancel();
      visibility.destroy();
      layer.dispose();
    },
  };
}
