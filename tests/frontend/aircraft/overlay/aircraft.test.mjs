import { expect, jest, test } from "@jest/globals";
import { drawAircraftOverlayTargets } from "../../../../src/frontend/aircraft/overlay/aircraft.mjs";

test("projects and draws aircraft display items", () => {
  const context = Object.fromEntries(
    ["beginPath", "moveTo", "lineTo", "stroke", "closePath", "fillText"].map((name) => [
      name,
      jest.fn(),
    ]),
  );
  context.globalAlpha = 1;
  context.measureText = () => ({ width: 8 });
  drawAircraftOverlayTargets(
    context,
    new Map([["ABC123", { icao: "ABC123", latitude: 43.1, longitude: -70, callsign: "TEST" }]]),
    new Map(),
    { latitude: 43, longitude: -70 },
    0,
    () => ({ x: 20, y: 30 }),
    true,
    800,
    600,
  );
  expect(context.stroke).toHaveBeenCalled();
});
