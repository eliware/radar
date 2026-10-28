import { expect, jest, test } from "@jest/globals";
import { attachAirportRunways } from "../../../../src/backend/airport/runway/attach.mjs";

test("loads runway ends for selected airports and attaches grouped results", () => {
  const airports = [{ faaId: "PWM" }, { faaId: "BID" }];
  const ends = [
    { airportId: "PWM", runwayId: "09/27", latitude: 43, longitude: -70, alignmentDegrees: 90 },
    { airportId: "PWM", runwayId: "09/27", latitude: 43.1, longitude: -70, alignmentDegrees: 270 },
  ];
  const runwayStatement = { all: jest.fn(() => ends) };
  expect(attachAirportRunways(airports, runwayStatement)).toEqual([
    { ...airports[0], runways: [ends] },
    { ...airports[1], runways: [] },
  ]);
  expect(runwayStatement.all).toHaveBeenCalledWith('["PWM","BID"]');
});

test("does not query runway ends when no airports were selected", () => {
  const runwayStatement = { all: jest.fn() };
  expect(attachAirportRunways([], runwayStatement)).toEqual([]);
  expect(runwayStatement.all).not.toHaveBeenCalled();
});
