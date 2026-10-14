import { createAircraftSceneUpdater } from "./update-aircraft-scene.mjs";
import { startAircraftSceneLoop } from "./start-aircraft-scene-loop.mjs";

export function createAircraftSceneWorkflow(options) {
  return {
    stop: startAircraftSceneLoop(options),
    update: createAircraftSceneUpdater(options),
  };
}
