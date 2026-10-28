import { createAircraftSceneWorkflow } from "../../create/aircraft/scene-workflow.mjs";
import { createRadarViewport } from "../../radar/viewport/radius.mjs";
import { createRadarReferenceStore } from "../../radar/reference/store.mjs";

export function createAircraftSceneDashboardBindings(options) {
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
