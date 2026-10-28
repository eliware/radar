import { expect, jest, test } from "@jest/globals";
import { removeRadarLabel } from "../../../src/frontend/radar/remove-label.mjs";

test("removes a radar label and disposes of its resources", () => {
  const label = { material: { map: { dispose: jest.fn() }, dispose: jest.fn() } };
  const scene = { remove: jest.fn() };
  removeRadarLabel(scene, label);
  expect(scene.remove).toHaveBeenCalledWith(label);
  expect(label.material.map.dispose).toHaveBeenCalled();
  expect(label.material.dispose).toHaveBeenCalled();
  removeRadarLabel(scene, null);
});
