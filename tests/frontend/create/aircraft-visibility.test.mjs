import { expect, jest, test } from "@jest/globals";
import { createAircraftVisibility } from "../../../src/frontend/create/aircraft-visibility.mjs";

test("L toggles and stores local-only state without changing the legend style", () => {
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const stored = new Map();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key) => stored.get(key) ?? null,
      setItem: (key, value) => stored.set(key, value),
    },
  });
  const listeners = new Set();
  const documentRef = {
    addEventListener: (_type, listener) => listeners.add(listener),
    removeEventListener: (_type, listener) => listeners.delete(listener),
  };
  const changed = jest.fn();
  const visibility = createAircraftVisibility(documentRef, changed);
  expect(visibility.isLocalOnly()).toBe(false);
  listeners.forEach((listener) => listener({ key: "l", preventDefault: jest.fn() }));
  expect(visibility.isLocalOnly()).toBe(true);
  expect(stored.get("radar.visibility.remote-aircraft")).toBe("false");
  expect(changed).toHaveBeenCalledWith({ localOnly: true });
  const restored = createAircraftVisibility(documentRef);
  expect(restored.isLocalOnly()).toBe(true);
  restored.destroy();
  listeners.forEach((listener) => listener({ key: "L", preventDefault: jest.fn() }));
  expect(visibility.isLocalOnly()).toBe(false);
  expect(stored.get("radar.visibility.remote-aircraft")).toBe("true");
  [
    { key: "x" },
    { key: "l", altKey: true },
    { key: "l", ctrlKey: true },
    { key: "l", metaKey: true },
    { key: "l", target: { tagName: "input" } },
    { key: "l", target: { tagName: "textarea" } },
    { key: "l", target: { tagName: "select" } },
    { key: "l", target: { isContentEditable: true } },
  ].forEach((event) => listeners.forEach((listener) => listener(event)));
  expect(visibility.isLocalOnly()).toBe(false);
  visibility.destroy();
  expect(listeners.size).toBe(0);
  if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
  else delete globalThis.localStorage;
});
