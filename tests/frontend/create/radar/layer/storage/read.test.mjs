import { expect, jest, test } from "@jest/globals";
import { readAndRestoreLayerVisibility } from "../../../../../../src/frontend/create/radar/layer/storage/read.mjs";

test("restores saved visibility using the existing persistence readers", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: { getItem: (key) => (key === "radar.visibility.ils" ? "false" : null) },
  });
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
  try {
    readAndRestoreLayerVisibility(controllers);
    expect(controllers.ils.setVisible).toHaveBeenCalledWith(false);
    expect(controllers.references.setAirportsVisible).toHaveBeenCalledWith(true);
  } finally {
    if (original) Object.defineProperty(globalThis, "localStorage", original);
    else delete globalThis.localStorage;
  }
});
