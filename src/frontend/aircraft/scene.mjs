import { createAircraftSceneSetup } from "./scene/setup.mjs";
import { createAircraftSceneView } from "./scene/view.mjs";

export function createAircraftScene(options) {
  const setup = createAircraftSceneSetup(options);
  return createAircraftSceneView(setup);
}
