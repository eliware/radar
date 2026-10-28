import { expect, test } from "@jest/globals";
import { writeToggleState } from "../../src/frontend/write-toggle-state.mjs";

test("stores radar toggle state", () => {
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const values = new Map();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: { setItem: (key, value) => values.set(key, value) },
  });
  writeToggleState("ils", false);
  expect(values.get("radar.visibility.ils")).toBe("false");
  if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
  else delete globalThis.localStorage;
});
