import { default as createAircraftSceneSetup } from "./scene/setup.mjs";
import { default as createAircraftSceneView } from "./scene/view.mjs";

function createAircraftScene(options) {
  const setup = createAircraftSceneSetup(options);
  return createAircraftSceneView(setup);
}
export default createAircraftScene;
