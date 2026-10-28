import { expect, jest, test } from "@jest/globals";
import { drawCanvasRings } from "../../../../src/frontend/draw/canvas/rings.mjs";
import { getRadarLabelGapAngle } from "../../../../src/frontend/radar/label-gap-angle.mjs";
import { RADAR_RING_LABEL_ANGLE } from "../../../../src/frontend/radar/range.mjs";

test("draws range rings and the north-east axes", () => {
  const context = {
    beginPath: jest.fn(),
    arc: jest.fn(),
    stroke: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    fillText: jest.fn(),
    save: jest.fn(),
    translate: jest.fn(),
    rotate: jest.fn(),
    restore: jest.fn(),
  };
  drawCanvasRings(context, 0, 0, 100, 20, { major: "major", minor: "minor", bright: "bright" });
  expect(context.font).toBe('11px Consolas, "Courier New", monospace');
  expect(context.arc).toHaveBeenCalledTimes(4);
  expect(context.fillText).toHaveBeenCalledWith("20", expect.any(Number), expect.any(Number));
  expect(context.translate).toHaveBeenCalledWith(
    100 * Math.cos(RADAR_RING_LABEL_ANGLE),
    100 * Math.sin(RADAR_RING_LABEL_ANGLE),
  );
  expect(context.arc.mock.calls[1][3]).toBeCloseTo(
    RADAR_RING_LABEL_ANGLE + getRadarLabelGapAngle(50, 14) / 2,
  );
});

test("counter-rotates range labels so they stay upright", () => {
  const context = {
    beginPath: jest.fn(),
    arc: jest.fn(),
    stroke: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    fillText: jest.fn(),
    save: jest.fn(),
    translate: jest.fn(),
    rotate: jest.fn(),
    restore: jest.fn(),
  };
  const rotation = Math.PI / 4;
  drawCanvasRings(
    context,
    0,
    0,
    100,
    20,
    { major: "major", minor: "minor", bright: "bright" },
    rotation,
  );
  expect(context.rotate).toHaveBeenCalledWith(-rotation);
  expect(context.fillText).toHaveBeenCalledWith("20", 0, 0);
});
