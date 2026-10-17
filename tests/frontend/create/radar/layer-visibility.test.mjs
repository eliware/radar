import { expect, jest, test } from "@jest/globals";
import { createRadarLayerVisibility } from "../../../../src/frontend/create/radar/layer-visibility.mjs";

test("creates visible layers and destroys all keyboard listeners", () => {
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const stored = new Map([
    ["radar.visibility.ils", "false"],
    ["radar.visibility.airway-J", "false"],
  ]);
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key) => stored.get(key) ?? null,
      setItem: (key, value) => stored.set(key, value),
    },
  });
  const removed = [];
  const listeners = [];
  const documentRef = {
    addEventListener: (_type, listener) => listeners.push(listener),
    removeEventListener: (_type, callback) => removed.push(callback),
  };
  const layers = createRadarLayerVisibility(documentRef, jest.fn());
  expect(layers.ils.isVisible()).toBe(false);
  expect(layers.procedures.isSidVisible()).toBe(true);
  expect(layers.procedures.isStarVisible()).toBe(true);
  expect(layers.airways.isVisible("Q")).toBe(true);
  expect(layers.airways.isVisible("J")).toBe(false);
  expect(layers.airways.isVisible("V")).toBe(true);
  expect(layers.runways.isRunwaysVisible()).toBe(true);
  expect(layers.runways.isExtensionsVisible()).toBe(true);
  expect(layers.references.isAirportsVisible()).toBe(true);
  expect(layers.references.isNavaidsVisible()).toBe(true);
  ["i", "d", "s", "q", "j", "v", "r", "e", "a", "n"].forEach((key) =>
    listeners.forEach((listener) => listener({ key, preventDefault: jest.fn() })),
  );
  expect(layers.ils.isVisible()).toBe(true);
  expect(layers.procedures.isSidVisible()).toBe(false);
  expect(layers.procedures.isStarVisible()).toBe(false);
  expect(layers.airways.isVisible("J")).toBe(true);
  expect(layers.runways.isRunwaysVisible()).toBe(false);
  expect(layers.references.isAirportsVisible()).toBe(false);
  expect(layers.references.isNavaidsVisible()).toBe(false);
  expect(stored.get("radar.visibility.ils")).toBe("true");
  layers.destroy();
  expect(removed).toHaveLength(5);
  if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
  else delete globalThis.localStorage;
});
