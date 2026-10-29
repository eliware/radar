import { expect, beforeEach, jest, test } from "@jest/globals";
import { registerAircraftSceneMocks } from "../../../../test-fixtures/aircraft-scene-mocks.mjs";

const mocks = registerAircraftSceneMocks(jest, "../../../../src/frontend");
const { createAircraftSceneResources } =
  await import("../../../../src/frontend/aircraft/scene/resources.mjs");

beforeEach(() => jest.clearAllMocks());

test("constructs renderer resources for dashboard composition", () => {
  const container = { replaceChildren: jest.fn() };
  const location = { latitude: 43, longitude: -70 };
  const resources = createAircraftSceneResources({
    container,
    location,
    elevationFeet: 300,
    windowRef: {},
  });
  expect(mocks.factories.createRadarStage).toHaveBeenCalledWith(expect.anything(), container, {});
  expect(resources.dashboardOptions).toEqual(
    expect.objectContaining({
      camera: mocks.camera,
      controls: mocks.controls,
      container,
      elevationFeet: 300,
      location,
      radarCamera: mocks.radarCamera,
      renderer: mocks.renderer,
    }),
  );
});
