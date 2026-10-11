import { expect, jest, test } from "@jest/globals";
import { drawCanvasRadar } from "../../src/frontend/draw-canvas-radar.mjs";

test("draws north-up range rings, home, and valid aircraft", () => {
  const context = Object.fromEntries(
    [
      "setTransform",
      "measureText",
      "clearRect",
      "fillRect",
      "beginPath",
      "arc",
      "stroke",
      "fillText",
      "moveTo",
      "lineTo",
      "fill",
      "save",
      "translate",
      "rotate",
      "closePath",
      "restore",
    ].map((name) => [name, jest.fn()]),
  );
  const measuredFonts = [];
  context.measureText = jest.fn((text) => {
    measuredFonts.push(context.font);
    return { width: text.length * 8 };
  });
  const canvas = { clientWidth: 0, clientHeight: 0, width: 0, height: 0 };
  const aircraft = new Map([
    ["A", { icao: "A", latitude: 43.1, longitude: -70, callsign: "NORTH", trackDegrees: 0 }],
    ["B", { icao: "B", latitude: Number.NaN, longitude: -70 }],
    ["C", { icao: "C", latitude: 43.1, longitude: -70 }],
  ]);
  drawCanvasRadar(context, canvas, aircraft, { latitude: 43, longitude: -70 }, 60, 0, 0, {
    devicePixelRatio: 0,
  });
  expect(canvas.width).toBe(1);
  expect(canvas.height).toBe(1);
  expect(context.arc).toHaveBeenCalledTimes(14);
  expect(context.rotate).toHaveBeenCalledWith(0);
  expect(context.fillText).toHaveBeenCalledWith("NORTH", expect.any(Number), expect.any(Number));
  expect(measuredFonts).toContain("9px monospace");
});

test("draws close range rings below five nautical miles", () => {
  const context = Object.fromEntries(
    [
      "setTransform",
      "clearRect",
      "fillRect",
      "beginPath",
      "arc",
      "stroke",
      "fillText",
      "moveTo",
      "lineTo",
      "fill",
      "save",
      "translate",
      "rotate",
      "closePath",
      "restore",
    ].map((name) => [name, jest.fn()]),
  );
  context.measureText = jest.fn((text) => ({ width: text.length * 8 }));
  const canvas = { clientWidth: 100, clientHeight: 100 };
  drawCanvasRadar(context, canvas, new Map(), null, 3, 0, 0, { devicePixelRatio: 1 });
  expect(context.arc).toHaveBeenCalledTimes(5);
  expect(context.fillText).toHaveBeenCalledWith("3", expect.any(Number), expect.any(Number));
});
