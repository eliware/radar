import { expect, jest, test } from "@jest/globals";
import { createRadarLayerVisibility } from "../../src/frontend/create-radar-layer-visibility.mjs";

test("creates visible layers and destroys all keyboard listeners", () => {
  const removed = [];
  const documentRef = {
    addEventListener: jest.fn(),
    removeEventListener: (_type, callback) => removed.push(callback),
  };
  const layers = createRadarLayerVisibility(documentRef, jest.fn());
  expect(layers.ils.isVisible()).toBe(true);
  expect(layers.procedures.isSidVisible()).toBe(true);
  expect(layers.procedures.isStarVisible()).toBe(true);
  expect(layers.airways.isVisible("Q")).toBe(true);
  expect(layers.airways.isVisible("J")).toBe(true);
  expect(layers.airways.isVisible("V")).toBe(true);
  expect(layers.runways.isRunwaysVisible()).toBe(true);
  expect(layers.runways.isExtensionsVisible()).toBe(true);
  expect(layers.references.isAirportsVisible()).toBe(true);
  expect(layers.references.isNavaidsVisible()).toBe(true);
  layers.destroy();
  expect(removed).toHaveLength(5);
});
