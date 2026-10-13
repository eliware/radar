import { expect, jest, test } from "@jest/globals";
import { createRadarLayerVisibility } from "../../src/frontend/create-radar-layer-visibility.mjs";

test("creates both visible layers and destroys both key listeners", () => {
  const removed = [];
  const documentRef = {
    addEventListener: jest.fn(),
    removeEventListener: (_type, callback) => removed.push(callback),
  };
  const layers = createRadarLayerVisibility(documentRef, jest.fn());
  expect(layers.ils.isVisible()).toBe(true);
  expect(layers.procedures.isVisible()).toBe(true);
  layers.destroy();
  expect(removed).toHaveLength(2);
});
