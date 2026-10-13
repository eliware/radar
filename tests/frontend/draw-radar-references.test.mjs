import { expect, jest, test } from "@jest/globals";
import { drawRadarReferences } from "../../src/frontend/draw-radar-references.mjs";

test("draws airport, navaid, boundary, and ILS layers with one projector", () => {
  const context = {
    save: jest.fn(),
    restore: jest.fn(),
    setLineDash: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    fillText: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
  };
  const references = {
    airports: new Map(),
    navaids: new Map(),
    boundaries: new Map(),
    ilsApproaches: new Map(),
  };
  const project = jest.fn(() => ({ x: 0, y: 0 }));
  expect(() => drawRadarReferences(context, references, project, 20)).not.toThrow();
  expect(() => drawRadarReferences(context, {}, project, 20, false)).not.toThrow();
  expect(context.save).toHaveBeenCalled();
});
