import { expect, jest, test } from "@jest/globals";
import { createLayerVisibilityPersistence } from "../../../../../src/frontend/create/radar/layer/persistence.mjs";

function controllers() {
  return {
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
}

function withStorage(run) {
  const original = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const values = new Map();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    },
  });
  try {
    run(values);
  } finally {
    if (original) Object.defineProperty(globalThis, "localStorage", original);
    else delete globalThis.localStorage;
  }
}

test("restores controller values then persists each layer change", () => {
  withStorage((values) => {
    values.set("radar.visibility.ils", "false");
    const changed = jest.fn();
    const referencesChanged = jest.fn();
    const persistence = createLayerVisibilityPersistence(changed, referencesChanged);
    const controls = controllers();
    persistence.ils(true);
    persistence.restore(controls);
    expect(controls.ils.setVisible).toHaveBeenCalledWith(false);
    expect(controls.airways.setVisible).toHaveBeenCalledWith("Q", true);
    expect(referencesChanged).toHaveBeenCalledWith({ airportsVisible: true, navaidsVisible: true });

    persistence.ils(true);
    persistence.procedures({ sidVisible: false, starVisible: true });
    persistence.airways({ Q: true, J: false, V: true });
    persistence.runways({ runwaysVisible: false, extensionsVisible: true, baseLegsVisible: false });
    persistence.references({ airportsVisible: false, navaidsVisible: true });
    expect(values.get("radar.visibility.ils")).toBe("true");
    expect(values.get("radar.visibility.star")).toBe("true");
    expect(values.get("radar.visibility.airway-J")).toBe("false");
    expect(values.get("radar.visibility.baseLegs")).toBe("false");
    expect(values.get("radar.visibility.airports")).toBe("false");
    expect(changed).toHaveBeenCalledTimes(4);
    expect(referencesChanged).toHaveBeenLastCalledWith({
      airportsVisible: false,
      navaidsVisible: true,
    });
  });
});

test("falls back to the general callback for reference changes", () => {
  withStorage(() => {
    const changed = jest.fn();
    const persistence = createLayerVisibilityPersistence(changed);
    persistence.restore(controllers());
    const value = { airportsVisible: false, navaidsVisible: false };
    persistence.references(value);
    expect(changed).toHaveBeenLastCalledWith(value);
  });
});
