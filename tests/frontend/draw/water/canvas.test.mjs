import { expect, jest, test } from "@jest/globals";
import { drawCanvasRadarWater } from "../../../../src/frontend/draw/water/canvas.mjs";

test("draws water outlines only when the water layer is visible", () => {
  const context = Object.fromEntries(
    ["save", "restore", "beginPath", "moveTo", "lineTo", "stroke"].map((key) => [key, jest.fn()]),
  );
  const paths = [
    [
      { latitude: 43, longitude: -70 },
      { latitude: 43.1, longitude: -69.9 },
    ],
  ];
  const project = (point) => ({ x: point.x * 100, y: point.z * 100 });
  const location = { latitude: 43, longitude: -70 };

  drawCanvasRadarWater(context, true, paths, project, location, 800, 600);
  expect(context.stroke).toHaveBeenCalledTimes(1);

  context.stroke.mockClear();
  drawCanvasRadarWater(context, false, paths, project, location, 800, 600);
  expect(context.stroke).not.toHaveBeenCalled();
});
