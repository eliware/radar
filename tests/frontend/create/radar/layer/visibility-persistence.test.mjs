import { expect, test } from "@jest/globals";
import {
  persistLayerVisibility,
  readSavedLayerVisibility,
} from "../../../../../src/frontend/create/radar/layer/visibility-persistence.mjs";

test("reads saved layer visibility and persists updates", () => {
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const values = new Map([["radar.visibility.ils", "false"]]);
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    },
  });
  expect(readSavedLayerVisibility()).toMatchObject({ ils: false, sid: true, airports: true });
  persistLayerVisibility("airports", false);
  expect(values.get("radar.visibility.airports")).toBe("false");
  if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
  else delete globalThis.localStorage;
});
