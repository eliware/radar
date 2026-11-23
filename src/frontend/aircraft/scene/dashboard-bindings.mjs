import { default as createAircraftSceneWorkflow } from "../../create/aircraft/scene-workflow.mjs";
import { default as createRadarViewport } from "../../radar/viewport/create/viewport.mjs";
import { default as createRadarReferenceStore } from "../../radar/reference/store.mjs";

function createAircraftSceneDashboardBindings(options) {
  const references = createRadarReferenceStore();
  const workflow = createAircraftSceneWorkflow({ ...options, references });
  const viewport = createRadarViewport(
    options.THREE,
    options.camera,
    options.controls,
    options.container,
    options.elevationFeet,
  );
  return { references, workflow, viewport };
}
export default createAircraftSceneDashboardBindings;
