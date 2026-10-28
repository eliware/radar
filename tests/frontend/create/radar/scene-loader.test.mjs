import { expect, jest, test } from "@jest/globals";

const createAircraftScene = jest.fn();
jest.unstable_mockModule("../../../../src/frontend/aircraft/scene.mjs", () => ({
  createAircraftScene,
}));
const { loadAircraftScene } =
  await import("../../../../src/frontend/create/radar/scene-loader.mjs");

test("loads and creates the aircraft scene with the supplied options", async () => {
  const options = { container: {}, location: null };
  const view = {};
  createAircraftScene.mockReturnValueOnce(view);
  await expect(loadAircraftScene(options)).resolves.toBe(view);
  expect(createAircraftScene).toHaveBeenCalledWith(options);
});
