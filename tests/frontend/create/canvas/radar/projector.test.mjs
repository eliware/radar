import { expect, test } from "@jest/globals";
import { createCanvasRadarProjector } from "../../../../../src/frontend/create/canvas/radar/projector.mjs";

test("projects radar coordinates around the canvas center and rotation", () => {
  const project = createCanvasRadarProjector(100, 100, 50, 10, 0);
  expect(project({ x: 10, z: -10 })).toEqual({ x: 150, y: 50 });
  const rotated = createCanvasRadarProjector(100, 100, 50, 10, Math.PI / 2);
  expect(rotated({ x: 10, z: 0 }).x).toBeCloseTo(100);
  expect(rotated({ x: 10, z: 0 }).y).toBeCloseTo(150);
});
