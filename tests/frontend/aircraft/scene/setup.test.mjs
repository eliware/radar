import { beforeEach, expect, jest, test } from "@jest/globals";
import { registerAircraftSceneMocks } from "../../../../test-fixtures/aircraft-scene-mocks.mjs";

const mocks = registerAircraftSceneMocks(jest, "../../../../src/frontend");
const { createAircraftSceneSetup } =
  await import("../../../../src/frontend/aircraft/scene/setup.mjs");

beforeEach(() => jest.clearAllMocks());

test("constructs scene services and returns the resources for view composition", () => {
  const setup = createAircraftSceneSetup({
    container: { replaceChildren: jest.fn() },
    location: { latitude: 43, longitude: -70 },
    elevationFeet: 300,
    windowRef: {},
  });
  expect(mocks.factories.createRadarStage).toHaveBeenCalledTimes(1);
  expect(setup).toEqual(
    expect.objectContaining({
      connection: expect.any(Object),
      workflow: expect.any(Object),
      layers: expect.any(Object),
      references: expect.any(Object),
      destroy: expect.any(Function),
    }),
  );
});
