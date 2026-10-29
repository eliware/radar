import { expect, jest, test } from "@jest/globals";
import { measureAircraftTag } from "../../../../src/frontend/aircraft/tag/measure.mjs";

test("measures labels and creates viewport placement candidates", () => {
  const context = { measureText: jest.fn((text) => ({ width: text.length * 8 })) };
  const measured = measureAircraftTag(context, { x: 50, y: 60, lines: ["AB", "C"] }, 12);
  expect(context.font).toBe('12px Consolas, "Courier New", monospace');
  expect(measured.width).toBe(30);
  expect(measured.height).toBeCloseTo(35.6);
  expect(measured.width).toBe(30);
  expect(measured.height).toBeCloseTo(35.6);
});

test("includes emergency tag dimensions in the measured label", () => {
  const context = { measureText: (text) => ({ width: text.length * 8 }) };
  const { width } = measureAircraftTag(
    context,
    { x: 0, y: 0, lines: ["A"], emergencyTag: "SOS" },
    12,
  );
  expect(width).toBe(58);
});
