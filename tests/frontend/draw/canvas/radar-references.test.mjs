import { expect, jest, test } from "@jest/globals";

const drawRadarReferences = jest.fn();
jest.unstable_mockModule("../../../../src/frontend/draw/radar/references.mjs", () => ({
  drawRadarReferences,
}));
const { drawCanvasRadarReferences } =
  await import("../../../../src/frontend/draw/canvas/radar-references.mjs");

test("renders reference layers with shared visibility and without a scope clip", () => {
  const options = {
    ctx: {},
    location: { latitude: 43, longitude: -70 },
    range: 20,
    radius: 200,
    centerX: 300,
    centerY: 200,
    project: jest.fn(),
    airports: new Map(),
    navaids: new Map(),
    boundaries: new Map(),
    ilsApproaches: new Map(),
    procedures: new Map(),
    airways: new Map(),
    ilsVisible: true,
    procedureVisibility: { sidVisible: true, starVisible: true },
    airwayVisibility: { Q: true },
    runwayVisibility: { runwaysVisible: false, extensionsVisible: true, baseLegsVisible: false },
    referenceVisibility: { airportsVisible: false, navaidsVisible: true },
  };
  drawCanvasRadarReferences(options);
  expect(drawRadarReferences).toHaveBeenCalledWith(
    options.ctx,
    expect.objectContaining({ airports: options.airports, airways: options.airways }),
    expect.any(Function),
    true,
    options.procedureVisibility,
    options.airwayVisibility,
    options.runwayVisibility,
    options.referenceVisibility,
  );
  drawRadarReferences.mock.calls[0][2]({ latitude: 43, longitude: -70 });
  expect(options.project).toHaveBeenCalledWith(expect.objectContaining({ x: expect.any(Number) }));
});
