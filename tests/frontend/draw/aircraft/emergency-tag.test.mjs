import { expect, jest, test } from "@jest/globals";
import { drawAircraftEmergencyTag } from "../../../../src/frontend/draw/aircraft/emergency-tag.mjs";

test("places emergency status beside the three primary aircraft label lines", () => {
  const context = { fillText: jest.fn(), measureText: (text) => ({ width: text.length * 8 }) };
  const tag = {
    x: 20,
    y: 30,
    item: { lines: ["ABC123", "120", "400 B738"], emergencyTag: "HIJACK" },
  };

  drawAircraftEmergencyTag(context, tag, 12);

  expect(context.fillText).toHaveBeenCalledWith("HIJACK", 20 + 64 + 12 + 7, 42);
});

test("does not draw when the aircraft has no emergency status", () => {
  const context = { fillText: jest.fn(), measureText: jest.fn() };
  drawAircraftEmergencyTag(context, { x: 0, y: 0, item: { lines: ["ABC", "120", "400"] } }, 12);
  expect(context.fillText).not.toHaveBeenCalled();
  expect(context.measureText).not.toHaveBeenCalled();
});
