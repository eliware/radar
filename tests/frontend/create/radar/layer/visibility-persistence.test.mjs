import { expect, test } from "@jest/globals";
import { readSavedLayerVisibility } from "../../../../../src/frontend/create/radar/layer/visibility-persistence.mjs";

test("reads saved layer visibility", () => {
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
  if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
  else delete globalThis.localStorage;
});
