import { expect, jest, test } from "@jest/globals";

const calls = [];
const layer = (name) => jest.fn((...args) => calls.push([name, ...args]));
const drawAirportLayer = layer("airport-layer");
const drawNavaidMarkers = layer("navaids");
const drawArtccBoundaries = layer("boundaries");
const drawIlsApproaches = layer("ils");
const drawProcedures = layer("procedures");
const drawAirways = layer("airways");
jest.unstable_mockModule("../../../../src/frontend/draw/radar/airport-layer.mjs", () => ({
  drawAirportLayer,
}));
jest.unstable_mockModule("../../../../src/frontend/draw/navaid-markers.mjs", () => ({
  drawNavaidMarkers,
}));
jest.unstable_mockModule("../../../../src/frontend/draw/artcc-boundaries.mjs", () => ({
  drawArtccBoundaries,
}));
jest.unstable_mockModule("../../../../src/frontend/draw/ils-approaches.mjs", () => ({
  drawIlsApproaches,
}));
jest.unstable_mockModule("../../../../src/frontend/draw/procedures.mjs", () => ({
  drawProcedures,
}));
jest.unstable_mockModule("../../../../src/frontend/draw/airways.mjs", () => ({ drawAirways }));
const { drawRadarReferences } = await import("../../../../src/frontend/draw/radar/references.mjs");

const runwayVisibility = { runwaysVisible: true, extensionsVisible: true, baseLegsVisible: true };
const referenceVisibility = { airportsVisible: true, navaidsVisible: true };
const airwayVisibility = { Q: true, J: true, V: true };

function resetCalls() {
  calls.length = 0;
  [
    drawAirportLayer,
    drawNavaidMarkers,
    drawArtccBoundaries,
    drawIlsApproaches,
    drawProcedures,
    drawAirways,
  ].forEach((draw) => draw.mockClear());
}

test("routes each reference layer in draw order with visibility", () => {
  resetCalls();
  const context = {};
  const project = jest.fn();
  const airports = new Map();
  const navaids = new Map();
  const boundaries = new Map();
  const ilsApproaches = new Map();
  const procedures = new Map();
  const airways = new Map();
  const references = { airports, navaids, boundaries, ilsApproaches, procedures, airways };

  drawRadarReferences(context, references, project, false, false);

  expect(calls.map(([name]) => name)).toEqual([
    "airport-layer",
    "navaids",
    "boundaries",
    "ils",
    "procedures",
    "airways",
  ]);
  expect(drawAirportLayer).toHaveBeenCalledWith(
    context,
    airports,
    project,
    runwayVisibility,
    referenceVisibility,
    true,
  );
  expect(drawNavaidMarkers).toHaveBeenCalledWith(context, navaids, project);
  expect(drawArtccBoundaries).toHaveBeenCalledWith(context, boundaries, project);
  expect(drawIlsApproaches).toHaveBeenCalledWith(context, ilsApproaches, project, false);
  expect(drawProcedures).toHaveBeenCalledWith(context, procedures, project, {
    sidVisible: false,
    starVisible: false,
  });
  expect(drawAirways).toHaveBeenCalledWith(context, airways, project, airwayVisibility);
});

test("uses empty layer maps when reference data is missing", () => {
  resetCalls();
  drawRadarReferences({}, {}, () => null);
  expect(drawAirportLayer.mock.calls.at(-1)[1]).toEqual(new Map());
  expect(drawNavaidMarkers.mock.calls.at(-1)[1]).toEqual(new Map());
  expect(drawArtccBoundaries.mock.calls.at(-1)[1]).toEqual(new Map());
  expect(drawIlsApproaches.mock.calls.at(-1)[1]).toEqual(new Map());
  expect(drawProcedures.mock.calls.at(-1)[1]).toEqual(new Map());
  expect(drawAirways.mock.calls.at(-1)[1]).toEqual(new Map());
});

test("passes airport and VOR visibility to their layer coordinators", () => {
  resetCalls();
  const visibility = { airportsVisible: false, navaidsVisible: false };
  drawRadarReferences(
    {},
    {},
    () => null,
    true,
    { sidVisible: true, starVisible: true },
    airwayVisibility,
    runwayVisibility,
    visibility,
  );
  expect(drawAirportLayer).toHaveBeenLastCalledWith(
    expect.anything(),
    expect.anything(),
    expect.anything(),
    runwayVisibility,
    visibility,
    true,
  );
  expect(drawNavaidMarkers).not.toHaveBeenCalled();
});

test("passes the flat-airspace ring choice to the airport layer", () => {
  resetCalls();
  drawRadarReferences(
    {},
    { airports: new Map() },
    () => null,
    true,
    undefined,
    undefined,
    undefined,
    undefined,
    false,
  );
  expect(drawAirportLayer.mock.calls.at(-1)[5]).toBe(false);
});
