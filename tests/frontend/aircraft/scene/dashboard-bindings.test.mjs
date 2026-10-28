import { expect, jest, test } from "@jest/globals";

const references = { airports: new Map() };
const workflow = { update: jest.fn() };
const viewport = { visibleRadiusNm: jest.fn() };
const createAircraftSceneWorkflow = jest.fn(() => workflow);
const createRadarViewport = jest.fn(() => viewport);
const createRadarReferenceStore = jest.fn(() => references);
jest.unstable_mockModule("../../../../src/frontend/create/aircraft/scene-workflow.mjs", () => ({
  createAircraftSceneWorkflow,
}));
jest.unstable_mockModule("../../../../src/frontend/radar/viewport/radius.mjs", () => ({
  createRadarViewport,
}));
jest.unstable_mockModule("../../../../src/frontend/radar/reference/store.mjs", () => ({
  createRadarReferenceStore,
}));
const { createAircraftSceneDashboardBindings } =
  await import("../../../../src/frontend/aircraft/scene/dashboard-bindings.mjs");

test("binds scene workflow, references, and viewport for dashboard use", () => {
  const options = {
    THREE: {},
    camera: {},
    controls: {},
    container: {},
    elevationFeet: 300,
    targets: {},
    location: { latitude: 43, longitude: -70 },
  };
  expect(createAircraftSceneDashboardBindings(options)).toEqual({ references, workflow, viewport });
  expect(createAircraftSceneWorkflow).toHaveBeenCalledWith({ ...options, references });
  expect(createRadarViewport).toHaveBeenCalledWith(
    options.THREE,
    options.camera,
    options.controls,
    options.container,
    options.elevationFeet,
  );
});
