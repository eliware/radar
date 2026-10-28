import { beforeEach, expect, jest, test } from "@jest/globals";
import { registerAircraftSceneMocks } from "../../../../test-fixtures/aircraft-scene-mocks.mjs";

const mocks = registerAircraftSceneMocks(jest, "../../../../src/frontend");
const { createAircraftSceneSetup } =
  await import("../../../../src/frontend/aircraft/scene/setup.mjs");

beforeEach(() => jest.clearAllMocks());

test("binds default view settings and scene lifecycle", () => {
  const setup = createAircraftSceneSetup({
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
  mocks.factories.createRadarCamera.mock.calls[0][0].onRangeChange(30);
  expect(mocks.updateRings).toHaveBeenCalledWith(30);
  setup.updateAirspace([]);
  expect(mocks.airspace.update).toHaveBeenCalledWith([]);
  setup.destroy();
  expect(mocks.stopRadarLoops).toHaveBeenCalledTimes(1);
});
