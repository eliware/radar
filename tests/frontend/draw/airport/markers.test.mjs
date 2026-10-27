import { expect, jest, test } from "@jest/globals";
import { drawAirportMarkers } from "../../../../src/frontend/draw/airport/markers.mjs";

test("draws a gray identifier for airports inside the current range", () => {
  const context = {
    save: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    fillText: jest.fn(),
    setLineDash: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
  };
  const airports = new Map([
    ["PWM", { faaId: "PWM", icao: "KPWM", rangeNm: 10 }],
    ["BGR-FALLBACK", { faaId: "BGR", rangeNm: 5 }],
    ["FAR", { faaId: "FAR", icao: "KFAR", rangeNm: 301 }],
  ]);
  drawAirportMarkers(context, airports, () => ({ x: 20, y: 30 }));
  expect(context.fillStyle).toBe("#b8b8b8");
  expect(context.textAlign).toBe("center");
  expect(context.font).toBe('12px Consolas, "Courier New", monospace');
  expect(context.fillText).toHaveBeenCalledWith("KPWM", 20, 20);
  expect(context.fillText).toHaveBeenCalledWith("BGR", 20, 20);
  expect(context.fillText).toHaveBeenCalledTimes(2);
});

test("uses smaller airport labels on narrow 2D canvases", () => {
  const context = {
    canvas: { clientWidth: 390 },
    save: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    fillText: jest.fn(),
  };

  drawAirportMarkers(
    context,
    new Map([["PWM", { faaId: "PWM", icao: "KPWM", rangeNm: 5 }]]),
    () => ({ x: 20, y: 30 }),
  );

  expect(context.font).toBe('9px Consolas, "Courier New", monospace');
  expect(context.fillText).toHaveBeenCalledWith("KPWM", 20, 20);
});

test("skips airport markers with invalid projected coordinates", () => {
  const context = {
    save: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    fillText: jest.fn(),
    setLineDash: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
  };
  const airports = new Map([["BAD", { faaId: "BAD", icao: "KBAD", rangeNm: 4 }]]);

  drawAirportMarkers(context, airports, () => ({ x: 1, y: Number.NaN }));

  expect(context.fillText).not.toHaveBeenCalled();
  expect(context.arc).not.toHaveBeenCalled();
  expect(context.restore).toHaveBeenCalledTimes(1);
});
