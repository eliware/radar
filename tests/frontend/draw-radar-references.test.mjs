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
const drawAirways = layer("airways");
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
jest.unstable_mockModule("../../src/frontend/draw-airways.mjs", () => ({ drawAirways }));
const { drawRadarReferences } = await import("../../src/frontend/draw-radar-references.mjs");

test("routes each reference layer in draw order with visibility and scope", () => {
  const context = {};
  const project = jest.fn();
  const airports = new Map();
  const navaids = new Map();
  const boundaries = new Map();
  const ilsApproaches = new Map();
  const procedures = new Map();
  const airways = new Map();
  const scope = [{ x: 0, y: 0 }];
  const references = { airports, navaids, boundaries, ilsApproaches, procedures, airways };

  drawRadarReferences(context, references, project, 20, false, false, scope);

  expect(calls.map(([name]) => name)).toEqual([
    "airspace-rings",
    "runways",
    "airport-markers",
    "navaids",
    "boundaries",
    "ils",
    "procedures",
    "airways",
  ]);
  expect(drawAirspaceRings).toHaveBeenCalledWith(context, airports, project, 20);
  expect(drawAirportRunways).toHaveBeenCalledWith(context, airports, project, 20, true, true);
  expect(drawAirportMarkers).toHaveBeenCalledWith(context, airports, project, 20);
  expect(drawNavaidMarkers).toHaveBeenCalledWith(context, navaids, project, 20);
  expect(drawArtccBoundaries).toHaveBeenCalledWith(context, boundaries, project);
  expect(drawIlsApproaches).toHaveBeenCalledWith(context, ilsApproaches, project, 20, false);
  expect(drawProcedures).toHaveBeenCalledWith(
    context,
    procedures,
    project,
    20,
    { sidVisible: false, starVisible: false },
    scope,
  );
  expect(drawAirways).toHaveBeenCalledWith(
    context,
    airways,
    project,
    20,
    { Q: true, J: true, V: true },
    scope,
  );
});

test("uses empty layer maps when reference data is missing", () => {
  calls.length = 0;
  drawRadarReferences({}, {}, () => null, 10);
  expect(drawAirportMarkers.mock.calls.at(-1)[1]).toEqual(new Map());
  expect(drawNavaidMarkers.mock.calls.at(-1)[1]).toEqual(new Map());
  expect(drawArtccBoundaries.mock.calls.at(-1)[1]).toEqual(new Map());
  expect(drawIlsApproaches.mock.calls.at(-1)[1]).toEqual(new Map());
  expect(drawProcedures.mock.calls.at(-1)[1]).toEqual(new Map());
  expect(drawAirways.mock.calls.at(-1)[1]).toEqual(new Map());
});

test("hides airport, airspace, VOR and runway layers with airport and VOR switches", () => {
  calls.length = 0;
  drawAirspaceRings.mockClear();
  drawAirportMarkers.mockClear();
  drawNavaidMarkers.mockClear();
  drawAirportRunways.mockClear();
  drawRadarReferences(
    {},
    {},
    () => null,
    10,
    true,
    { sidVisible: true, starVisible: true },
    null,
    { Q: true, J: true, V: true },
    { runwaysVisible: true, extensionsVisible: true },
    { airportsVisible: false, navaidsVisible: false },
  );
  expect(drawAirspaceRings).not.toHaveBeenCalled();
  expect(drawAirportMarkers).not.toHaveBeenCalled();
  expect(drawNavaidMarkers).not.toHaveBeenCalled();
  expect(drawAirportRunways).toHaveBeenLastCalledWith(
    expect.anything(),
    expect.anything(),
    expect.anything(),
    10,
    false,
    false,
  );
});
