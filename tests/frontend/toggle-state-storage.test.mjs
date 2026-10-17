import { expect, test } from "@jest/globals";
import { readToggleState, writeToggleState } from "../../src/frontend/toggle-state-storage.mjs";

test("stores and restores radar toggle state with visible defaults", () => {
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const values = new Map();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    },
  });
  expect(readToggleState("ils")).toBe(true);
  writeToggleState("ils", false);
  expect(readToggleState("ils")).toBe(false);
  if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
  else delete globalThis.localStorage;
});
