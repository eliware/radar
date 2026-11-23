import { default as createWaterOutlineLoader } from "../water/outline-loader.mjs";
import { default as createWaterSceneLayer } from "./water/scene-layer.mjs";
import { default as createWaterVisibility } from "./water/visibility.mjs";
import { default as getWaterFetch } from "../get-water-fetch.mjs";
import { default as loadSceneWaterView } from "../load-scene-water-view.mjs";

function createSceneWater(THREE, scene, location, elevationFeet, controls, windowRef) {
  const layer = createWaterSceneLayer(THREE, scene, location, elevationFeet);
  const loader = createWaterOutlineLoader(getWaterFetch(windowRef));
  const visibility = createWaterVisibility(windowRef.document, layer.setVisible);
  layer.setVisible(visibility.isVisible());
  return {
    isVisible: visibility.isVisible,
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
export default createSceneWater;
