import { expect, test } from "@jest/globals";
import { persistLayerVisibilityChanges } from "../../../../../../src/frontend/create/radar/layer/storage/write.mjs";

test("persists each requested visibility change through the existing writer", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const values = new Map();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: { setItem: (key, value) => values.set(key, value) },
  });
  try {
    persistLayerVisibilityChanges({ ils: false, "airway-Q": true });
    expect(values).toEqual(
      new Map([
        ["radar.visibility.ils", "false"],
        ["radar.visibility.airway-Q", "true"],
      ]),
    );
  } finally {
    if (original) Object.defineProperty(globalThis, "localStorage", original);
    else delete globalThis.localStorage;
  }
});
