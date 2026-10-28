import { expect, test } from "@jest/globals";
import { selectCanvasLabelSize } from "../../../src/frontend/draw/label-size.mjs";

test("reduces canvas labels on narrow screens without enlarging smaller labels", () => {
  const context = { canvas: { clientWidth: 600 } };
  expect(selectCanvasLabelSize(context, 12)).toBe(9);
  expect(selectCanvasLabelSize(context, 8)).toBe(8);
});

test("keeps the regular label size on wider or unavailable canvases", () => {
  expect(selectCanvasLabelSize({ canvas: { clientWidth: 601 } }, 12)).toBe(12);
  expect(selectCanvasLabelSize({}, 10)).toBe(10);
});
