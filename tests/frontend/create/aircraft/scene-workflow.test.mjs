import { expect, jest, test } from "@jest/globals";

const startLoop = jest.fn();
const createUpdater = jest.fn();
jest.unstable_mockModule("../../../../src/frontend/start/aircraft-scene-loop.mjs", () => ({
  startAircraftSceneLoop: startLoop,
}));
jest.unstable_mockModule("../../../../src/frontend/update-aircraft-scene.mjs", () => ({
  createAircraftSceneUpdater: createUpdater,
}));
const { createAircraftSceneWorkflow } =
  await import("../../../../src/frontend/create/aircraft/scene-workflow.mjs");

test("starts the scene loop and creates the aircraft updater", () => {
  const options = { defaultRangeNm: 25 };
  const stop = jest.fn();
  const update = jest.fn();
  startLoop.mockReturnValueOnce(stop);
  createUpdater.mockReturnValueOnce(update);
  expect(createAircraftSceneWorkflow(options)).toEqual({ stop, update });
  expect(startLoop).toHaveBeenCalledWith(options);
  expect(createUpdater).toHaveBeenCalledWith(options);
});
