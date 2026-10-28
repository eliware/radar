import { createAircraftSceneUpdater } from "../../update-aircraft-scene.mjs";
import { startAircraftSceneLoop } from "../../start/aircraft-scene-loop.mjs";

export function createAircraftSceneWorkflow(options) {
  const update = createAircraftSceneUpdater(options);
  return {
    stop: startAircraftSceneLoop({ ...options, getTargetItems: update.items }),
    update,
    updateRemote: update.updateRemote,
    updateSnapshot: update.updateSnapshot,
  };
}
