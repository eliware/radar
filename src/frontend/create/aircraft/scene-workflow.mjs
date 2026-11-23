import { default as createAircraftSceneUpdater } from "../../update-aircraft-scene.mjs";
import { default as startAircraftSceneLoop } from "../../start/aircraft-scene-loop.mjs";

function createAircraftSceneWorkflow(options) {
  const update = createAircraftSceneUpdater(options);
  return {
    stop: startAircraftSceneLoop({ ...options, getTargetItems: update.items }),
    update,
    updateRemote: update.updateRemote,
    updateSnapshot: update.updateSnapshot,
  };
}
export default createAircraftSceneWorkflow;
