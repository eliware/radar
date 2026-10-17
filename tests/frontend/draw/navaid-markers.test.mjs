import { expect, jest, test } from "@jest/globals";
import { drawNavaidMarkers } from "../../../src/frontend/draw/navaid-markers.mjs";

test("draws a blue identifier and symbol for in-range VORs", () => {
  const context = {
    save: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    stroke: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    fillText: jest.fn(),
  };
  drawNavaidMarkers(
    context,
    new Map([["ME:ENE", { identifier: "ENE", rangeNm: 4 }]]),
    () => ({ x: 10, y: 20 }),
    20,
  );
  expect(context.strokeStyle).toBe("#4da3ff");
  expect(context.fillStyle).toBe("#4da3ff");
  expect(context.fillText).toHaveBeenCalledWith("ENE", 17, 15);
});

test("skips distant and invalid navaid positions", () => {
  const context = {
    save: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    stroke: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    fillText: jest.fn(),
  };
  const navaids = new Map([
    ["FAR", { identifier: "FAR", rangeNm: 25 }],
    ["NO-PROJECTION", { identifier: "NONE", rangeNm: 1, bad: true }],
    ["BAD-X", { identifier: "BAD-X", rangeNm: 2, badX: true }],
    ["BAD-Y", { identifier: "BAD-Y", rangeNm: 3, badY: true }],
  ]);

  drawNavaidMarkers(
    context,
    navaids,
    (navaid) => {
      if (navaid.bad) return null;
      return { x: navaid.badX ? Number.NaN : 1, y: navaid.badY ? Number.NaN : 2 };
    },
    10,
  );

  expect(context.fillText).not.toHaveBeenCalled();
  expect(context.arc).not.toHaveBeenCalled();
  expect(context.restore).toHaveBeenCalledTimes(1);
});
