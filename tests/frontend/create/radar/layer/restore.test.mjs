import { expect, jest, test } from "@jest/globals";
import { createLayerVisibilityRestore } from "../../../../../src/frontend/create/radar/layer/restore.mjs";

test("restores saved controller state and persists later changes", () => {
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const values = new Map([
    ["radar.visibility.ils", "false"],
    ["radar.visibility.airway-J", "false"],
  ]);
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    },
  });
  const changed = jest.fn();
  const referencesChanged = jest.fn();
  const policy = createLayerVisibilityRestore(changed, referencesChanged);
  const controllers = {
    ils: { setVisible: jest.fn() },
    procedures: { setSidVisible: jest.fn(), setStarVisible: jest.fn() },
    airways: { setVisible: jest.fn() },
    runways: {
      setRunwaysVisible: jest.fn(),
      setExtensionsVisible: jest.fn(),
      setBaseLegsVisible: jest.fn(),
    },
    references: { setAirportsVisible: jest.fn(), setNavaidsVisible: jest.fn() },
  };
  policy.restore(controllers);
  expect(controllers.ils.setVisible).toHaveBeenCalledWith(false);
  expect(controllers.airways.setVisible).toHaveBeenCalledWith("J", false);
  expect(changed).not.toHaveBeenCalled();
  expect(referencesChanged).toHaveBeenCalledWith({ airportsVisible: true, navaidsVisible: true });
  policy.ils(true);
  policy.procedures({ sidVisible: false, starVisible: true });
  policy.airways({ Q: true, J: false, V: true });
  policy.runways({ runwaysVisible: false, extensionsVisible: true, baseLegsVisible: false });
  policy.references({ airportsVisible: false, navaidsVisible: true });
  expect(values.get("radar.visibility.ils")).toBe("true");
  expect(values.get("radar.visibility.airway-J")).toBe("false");
  expect(values.get("radar.visibility.baseLegs")).toBe("false");
  expect(changed).toHaveBeenCalledTimes(4);
  expect(referencesChanged).toHaveBeenLastCalledWith({
    airportsVisible: false,
    navaidsVisible: true,
  });
  if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
  else delete globalThis.localStorage;
});

test("uses the general callback when a reference callback is absent", () => {
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: { getItem: () => null, setItem: jest.fn() },
  });
  const changed = jest.fn();
  const policy = createLayerVisibilityRestore(changed);
  policy.restore({
    ils: { setVisible: jest.fn() },
    procedures: { setSidVisible: jest.fn(), setStarVisible: jest.fn() },
    airways: { setVisible: jest.fn() },
    runways: {
      setRunwaysVisible: jest.fn(),
      setExtensionsVisible: jest.fn(),
      setBaseLegsVisible: jest.fn(),
    },
    references: { setAirportsVisible: jest.fn(), setNavaidsVisible: jest.fn() },
  });
  const value = { airportsVisible: false, navaidsVisible: false };
  policy.references(value);
  expect(changed).toHaveBeenLastCalledWith(value);
  if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
  else delete globalThis.localStorage;
});
