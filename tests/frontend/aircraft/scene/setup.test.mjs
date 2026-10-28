import { beforeEach, expect, jest, test } from "@jest/globals";
import { registerAircraftSceneMocks } from "../../../../test-fixtures/aircraft-scene-mocks.mjs";

const mocks = registerAircraftSceneMocks(jest, "../../../../src/frontend");
const { createAircraftSceneSetup } =
  await import("../../../../src/frontend/aircraft/scene/setup.mjs");

beforeEach(() => jest.clearAllMocks());

test("uses default range and rotation settings when no overrides are provided", () => {
  createAircraftSceneSetup({
    container: { replaceChildren: jest.fn() },
    location: { latitude: 43, longitude: -70 },
    elevationFeet: 300,
    windowRef: {},
  });
  expect(mocks.factories.createRadarCamera).toHaveBeenCalledWith(
    expect.objectContaining({ defaultRangeNm: 20 }),
  );
  expect(mocks.radarCamera.setRange).toHaveBeenCalledWith(20);
  expect(mocks.radarCamera.setRotation).toHaveBeenCalledWith(0);
});
