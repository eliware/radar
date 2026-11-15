import { expect, jest, test } from "@jest/globals";
import { disposeRadarLayerVisibility } from "../../../../../src/frontend/create/radar/layer/dispose.mjs";

test("disposes layer controllers and attached shortcuts", () => {
  const ils = { destroy: jest.fn() };
  const procedures = { destroy: jest.fn() };
  const aircraft = { destroy: jest.fn() };
  const detachShortcuts = jest.fn();
  disposeRadarLayerVisibility({ ils, procedures, aircraft, detachShortcuts });
  expect(ils.destroy).toHaveBeenCalledTimes(1);
  expect(procedures.destroy).toHaveBeenCalledTimes(1);
  expect(detachShortcuts).toHaveBeenCalledTimes(1);
  expect(aircraft.destroy).toHaveBeenCalledTimes(1);
});
