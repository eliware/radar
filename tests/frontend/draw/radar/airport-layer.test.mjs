import { expect, jest, test } from "@jest/globals";

const drawAirportMarkers = jest.fn();
const drawAirspaceRings = jest.fn();
const drawAirportRunways = jest.fn();
jest.unstable_mockModule("../../../../src/frontend/draw/airport/markers.mjs", () => ({
  drawAirportMarkers,
}));
jest.unstable_mockModule("../../../../src/frontend/draw/airspace-rings.mjs", () => ({
  drawAirspaceRings,
}));
jest.unstable_mockModule("../../../../src/frontend/draw/airport/runways.mjs", () => ({
  drawAirportRunways,
}));
const { drawAirportLayer } = await import("../../../../src/frontend/draw/radar/airport-layer.mjs");

test("draws airport layers using their visibility settings", () => {
  drawAirportLayer(
    {},
    new Map(),
    () => null,
    { runwaysVisible: true, extensionsVisible: false, baseLegsVisible: true },
    { airportsVisible: true },
    true,
  );
  expect(drawAirspaceRings).toHaveBeenCalledTimes(1);
  expect(drawAirportRunways).toHaveBeenCalledWith(
    expect.anything(),
    expect.anything(),
    expect.anything(),
    true,
    false,
    true,
  );
  expect(drawAirportMarkers).toHaveBeenCalledTimes(1);
});

test("hides airport details and can omit airspace rings independently", () => {
  drawAirspaceRings.mockClear();
  drawAirportRunways.mockClear();
  drawAirportMarkers.mockClear();
  drawAirportLayer(
    {},
    new Map(),
    () => null,
    { runwaysVisible: true, extensionsVisible: true, baseLegsVisible: true },
    { airportsVisible: false },
    true,
  );
  expect(drawAirspaceRings).not.toHaveBeenCalled();
  expect(drawAirportRunways).toHaveBeenCalledWith(
    expect.anything(),
    expect.anything(),
    expect.anything(),
    false,
    false,
    false,
  );
  expect(drawAirportMarkers).not.toHaveBeenCalled();
  drawAirportLayer(
    {},
    new Map(),
    () => null,
    { runwaysVisible: false, extensionsVisible: false, baseLegsVisible: false },
    { airportsVisible: true },
    false,
  );
  expect(drawAirspaceRings).not.toHaveBeenCalled();
  expect(drawAirportRunways).toHaveBeenLastCalledWith(
    expect.anything(),
    expect.anything(),
    expect.anything(),
    false,
    false,
    false,
  );
  expect(drawAirportMarkers).toHaveBeenCalledTimes(1);
});
