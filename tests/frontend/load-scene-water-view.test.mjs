import { expect, jest, test } from "@jest/globals";
import { loadSceneWaterView } from "../../src/frontend/load-scene-water-view.mjs";

test("requests scene water around the camera target", () => {
  const loader = { load: jest.fn() };
  const setPaths = jest.fn();
  const location = { latitude: 43, longitude: -70 };
  const target = { x: 4, z: -2 };

  loadSceneWaterView(loader, location, target, 20, setPaths);

  const [center, range, callback] = loader.load.mock.calls[0];
  expect(center.latitude).toBeCloseTo(43 + 2 / 60);
  expect(center.longitude).toBeCloseTo(-70 + 4 / (60 * Math.cos((43 * Math.PI) / 180)));
  expect(range).toBe(20);
  expect(callback).toBe(setPaths);
});
