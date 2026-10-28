import { expect, jest, test } from "@jest/globals";
import { restoreLayerVisibility } from "../../../../../src/frontend/create/radar/layer/restore.mjs";

test("applies saved visibility settings to every controller", () => {
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
  const onReferenceChange = jest.fn();
  restoreLayerVisibility(
    controllers,
    {
      ils: false,
      sid: false,
      star: true,
      "airway-Q": true,
      "airway-J": false,
      "airway-V": true,
      runways: false,
      extensions: true,
      baseLegs: false,
      airports: false,
      navaids: true,
    },
    onReferenceChange,
  );
  expect(controllers.ils.setVisible).toHaveBeenCalledWith(false);
  expect(controllers.procedures.setSidVisible).toHaveBeenCalledWith(false);
  expect(controllers.procedures.setStarVisible).toHaveBeenCalledWith(true);
  expect(controllers.airways.setVisible).toHaveBeenNthCalledWith(1, "Q", true);
  expect(controllers.airways.setVisible).toHaveBeenNthCalledWith(2, "J", false);
  expect(controllers.airways.setVisible).toHaveBeenNthCalledWith(3, "V", true);
  expect(controllers.runways.setRunwaysVisible).toHaveBeenCalledWith(false);
  expect(controllers.runways.setExtensionsVisible).toHaveBeenCalledWith(true);
  expect(controllers.runways.setBaseLegsVisible).toHaveBeenCalledWith(false);
  expect(controllers.references.setAirportsVisible).toHaveBeenCalledWith(false);
  expect(controllers.references.setNavaidsVisible).toHaveBeenCalledWith(true);
  expect(onReferenceChange).toHaveBeenCalledWith({ airportsVisible: false, navaidsVisible: true });
});
test("supports restoration without a callback", () => {
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
  expect(() =>
    restoreLayerVisibility(controllers, {
      ils: true,
      sid: true,
      star: true,
      "airway-Q": true,
      "airway-J": true,
      "airway-V": true,
      runways: true,
      extensions: true,
      baseLegs: true,
      airports: true,
      navaids: true,
    }),
  ).not.toThrow();
});
