import { expect, jest, test } from "@jest/globals";
import { drawCanvasBackground } from "../../../../src/frontend/draw/canvas/background.mjs";

test("paints the radar canvas black at its layout size", () => {
  const context = { fillRect: jest.fn() };
  drawCanvasBackground(context, 500, 300);
  expect(context.fillStyle).toBe("#000");
  expect(context.fillRect).toHaveBeenCalledWith(0, 0, 500, 300);
});
