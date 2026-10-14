import { expect, jest, test } from "@jest/globals";

const calls = [];
const layer = (name) => jest.fn((...args) => calls.push([name, ...args]));
const drawAirportMarkers = layer("airport-markers");
const drawAirspaceRings = layer("airspace-rings");
const drawAirportRunways = layer("runways");
const drawNavaidMarkers = layer("navaids");
const drawArtccBoundaries = layer("boundaries");
const drawIlsApproaches = layer("ils");
const drawProcedures = layer("procedures");
jest.unstable_mockModule("../../src/frontend/draw-airport-markers.mjs", () => ({
  drawAirportMarkers,
}));
jest.unstable_mockModule("../../src/frontend/draw-airspace-rings.mjs", () => ({
  drawAirspaceRings,
}));
jest.unstable_mockModule("../../src/frontend/draw-airport-runways.mjs", () => ({
  drawAirportRunways,
}));
jest.unstable_mockModule("../../src/frontend/draw-navaid-markers.mjs", () => ({
  drawNavaidMarkers,
}));
jest.unstable_mockModule("../../src/frontend/draw-artcc-boundaries.mjs", () => ({
  drawArtccBoundaries,
}));
jest.unstable_mockModule("../../src/frontend/draw-ils-approaches.mjs", () => ({
  drawIlsApproaches,
}));
jest.unstable_mockModule("../../src/frontend/draw-procedures.mjs", () => ({ drawProcedures }));
const { drawRadarReferences } = await import("../../src/frontend/draw-radar-references.mjs");

test("routes each reference layer in draw order with visibility and scope", () => {
  const context = {};
  const project = jest.fn();
  const airports = new Map();
  const navaids = new Map();
  const boundaries = new Map();
  const ilsApproaches = new Map();
  const procedures = new Map();
  const scope = [{ x: 0, y: 0 }];
  const references = { airports, navaids, boundaries, ilsApproaches, procedures };

  drawRadarReferences(context, references, project, 20, false, false, scope);

  expect(calls.map(([name]) => name)).toEqual([
    "airspace-rings",
    "runways",
    "airport-markers",
    "navaids",
    "boundaries",
    "ils",
    "procedures",
  ]);
  expect(drawAirspaceRings).toHaveBeenCalledWith(context, airports, project, 20);
  expect(drawAirportRunways).toHaveBeenCalledWith(context, airports, project, 20);
  expect(drawAirportMarkers).toHaveBeenCalledWith(context, airports, project, 20);
  expect(drawNavaidMarkers).toHaveBeenCalledWith(context, navaids, project, 20);
  expect(drawArtccBoundaries).toHaveBeenCalledWith(context, boundaries, project);
  expect(drawIlsApproaches).toHaveBeenCalledWith(context, ilsApproaches, project, 20, false);
  expect(drawProcedures).toHaveBeenCalledWith(context, procedures, project, 20, false, scope);
});

test("uses empty layer maps when reference data is missing", () => {
  calls.length = 0;
  drawRadarReferences({}, {}, () => null, 10);
  expect(drawAirportMarkers.mock.calls.at(-1)[1]).toEqual(new Map());
  expect(drawNavaidMarkers.mock.calls.at(-1)[1]).toEqual(new Map());
  expect(drawArtccBoundaries.mock.calls.at(-1)[1]).toEqual(new Map());
  expect(drawIlsApproaches.mock.calls.at(-1)[1]).toEqual(new Map());
  expect(drawProcedures.mock.calls.at(-1)[1]).toEqual(new Map());
});
