import { expect, jest, test } from "@jest/globals";
import { disposeAircraftSceneResources } from "../../../../src/frontend/aircraft/scene/dispose.mjs";

test("stops the workflow and releases every scene resource", () => {
  const resources = {
    workflow: { stop: jest.fn() },
    layers: { destroy: jest.fn() },
    water: { destroy: jest.fn() },
    airspace: { dispose: jest.fn() },
    overlay: { destroy: jest.fn() },
    radarCamera: { dispose: jest.fn() },
    controls: { dispose: jest.fn() },
    renderer: { dispose: jest.fn() },
    container: { replaceChildren: jest.fn() },
  };
  disposeAircraftSceneResources(resources);
  expect(resources.workflow.stop).toHaveBeenCalledTimes(1);
  expect(resources.layers.destroy).toHaveBeenCalledTimes(1);
  expect(resources.water.destroy).toHaveBeenCalledTimes(1);
  expect(resources.airspace.dispose).toHaveBeenCalledTimes(1);
  expect(resources.overlay.destroy).toHaveBeenCalledTimes(1);
  expect(resources.radarCamera.dispose).toHaveBeenCalledTimes(1);
  expect(resources.controls.dispose).toHaveBeenCalledTimes(1);
  expect(resources.renderer.dispose).toHaveBeenCalledTimes(1);
  expect(resources.container.replaceChildren).toHaveBeenCalledTimes(1);
});
