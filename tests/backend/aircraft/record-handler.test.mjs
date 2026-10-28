import { expect, jest, test } from "@jest/globals";
import { handleAircraftRecord } from "../../../src/backend/aircraft/record-handler.mjs";

function setup({ message = { icao: "ABC123" }, range = null } = {}) {
  const aircraft = { icao: "ABC123", latitude: 43, longitude: -70 };
  const aircraftList = { update: jest.fn(() => aircraft) };
  const onAircraft = jest.fn();
  const dependencies = {
    parseSbsMessage: jest.fn(() => message),
    aircraftList,
    location: { latitude: 43, longitude: -70 },
    calculateAircraftRange: jest.fn(() => range),
    onAircraft,
  };
  return { dependencies, aircraft, onAircraft };
}

test("ignores messages without an ICAO address", () => {
  const state = setup({ message: null });
  handleAircraftRecord("invalid", state.dependencies);
  expect(state.dependencies.aircraftList.update).not.toHaveBeenCalled();
  expect(state.onAircraft).not.toHaveBeenCalled();
});

test("updates aircraft, adds range when available, and publishes the result", () => {
  const range = { distanceNauticalMiles: 1, bearingDegrees: 2 };
  const state = setup({ range });
  handleAircraftRecord("record", state.dependencies);
  expect(state.dependencies.aircraftList.update).toHaveBeenNthCalledWith(1, { icao: "ABC123" });
  expect(state.dependencies.aircraftList.update).toHaveBeenNthCalledWith(2, {
    icao: "ABC123",
    ...range,
  });
  expect(state.onAircraft).toHaveBeenCalledWith(state.aircraft);
});

test("publishes the aircraft without a range update", () => {
  const state = setup();
  handleAircraftRecord("record", state.dependencies);
  expect(state.dependencies.aircraftList.update).toHaveBeenCalledTimes(1);
  expect(state.onAircraft).toHaveBeenCalledWith(state.aircraft);
});
