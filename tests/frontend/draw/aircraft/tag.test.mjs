import { expect, test } from "@jest/globals";
import { drawAircraftTag } from "../../../../src/frontend/draw/aircraft/tag.mjs";

test("applies aircraft color and age fade before drawing its tag", () => {
  const context = {
    beginPath() {},
    moveTo() {},
    lineTo() {},
    stroke() {},
    fillText() {},
    measureText: (text) => ({ width: text.length * 8 }),
  };
  const tag = {
    x: 20,
    y: 30,
    width: 80,
    height: 40,
    item: { x: 50, y: 50, lines: ["ABC", "120", "400"], receivedAt: 500 },
  };
  drawAircraftTag(context, tag, 12, "#00ff41", 0.5, 60_500);
  expect(context.fillStyle).toBe("#00ff41");
  expect(context.strokeStyle).toBe("#00ff41");
  expect(context.globalAlpha).toBe(0.25);
});
