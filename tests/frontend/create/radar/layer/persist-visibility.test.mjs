import { expect, test } from "@jest/globals";
import { persistLayerVisibility } from "../../../../../src/frontend/create/radar/layer/persist-visibility.mjs";

test("persists a radar layer visibility setting", () => {
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const values = new Map();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: { setItem: (key, value) => values.set(key, value) },
  });
  persistLayerVisibility("airports", false);
  expect(values.get("radar.visibility.airports")).toBe("false");
  if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
  else delete globalThis.localStorage;
});
