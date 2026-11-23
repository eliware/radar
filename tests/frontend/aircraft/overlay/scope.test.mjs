import { expect, jest, test } from "@jest/globals";
import { default as drawAircraftOverlayScope } from "../../../../src/frontend/aircraft/overlay/scope.mjs";

test("draws the scale, layer legend, and readout group for the overlay", () => {
  const context = Object.fromEntries(
    [
      "beginPath",
      "moveTo",
      "lineTo",
      "stroke",
      "closePath",
      "fillText",
      "setLineDash",
      "arc",
      "fill",
    ].map((name) => [name, jest.fn()]),
  );
  context.measureText = () => ({ width: 8 });
  drawAircraftOverlayScope(context, null, { latitude: 43, longitude: -70 }, 0, 20, 800, 600, true, {
    ilsVisible: true,
    procedureVisibility: { sidVisible: true, starVisible: true },
    waterVisible: true,
    airwayVisibility: { Q: true, J: true, V: true },
    runwayVisibility: { runwaysVisible: true, extensionsVisible: true, baseLegsVisible: true },
    referenceVisibility: { airportsVisible: true, navaidsVisible: true },
  });
  expect(context.fillText.mock.calls.some(([label]) => /\d+ NM/.test(label))).toBe(true);
  expect(context.fillText).toHaveBeenCalledWith("AIRCRAFT", expect.any(Number), expect.any(Number));
});
