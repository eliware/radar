import { expect, jest, test } from "@jest/globals";
import { createCanvasRadarGestures } from "../../src/frontend/create-canvas-radar-gestures.mjs";

test("zooms and rotates the Canvas view after direct gestures", () => {
  const state = { autoZoom: true, range: 20, rotation: 0 };
  const draw = jest.fn();
  const gestures = createCanvasRadarGestures(state, draw);
  gestures.onZoom(0.5);
  gestures.onRotate(Math.PI / 2);
  expect(state).toMatchObject({ autoZoom: false, range: 10, rotation: Math.PI / 2 });
  expect(draw).toHaveBeenCalledTimes(2);
});
