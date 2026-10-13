import { expect, jest, test } from "@jest/globals";

const layerMocks = {
  createAircraftDisplayOverlay: jest.fn(() => "overlay"),
  createAirspaceVolumes: jest.fn(() => "airspace"),
  createMapOutlineLayer: jest.fn(() => "map"),
  createRadarHome: jest.fn(() => "home"),
  createRadarLayerVisibility: jest.fn(() => "layers"),
  createRadarSceneOverlays: jest.fn(() => "rings"),
};
jest.unstable_mockModule("../../src/frontend/aircraft-display-overlay.mjs", () => ({
  createAircraftDisplayOverlay: layerMocks.createAircraftDisplayOverlay,
}));
jest.unstable_mockModule("../../src/frontend/create-airspace-volumes.mjs", () => ({
  createAirspaceVolumes: layerMocks.createAirspaceVolumes,
}));
jest.unstable_mockModule("../../src/frontend/create-map-outline-layer.mjs", () => ({
  createMapOutlineLayer: layerMocks.createMapOutlineLayer,
}));
jest.unstable_mockModule("../../src/frontend/create-radar-home.mjs", () => ({
  createRadarHome: layerMocks.createRadarHome,
}));
jest.unstable_mockModule("../../src/frontend/create-radar-layer-visibility.mjs", () => ({
  createRadarLayerVisibility: layerMocks.createRadarLayerVisibility,
}));
jest.unstable_mockModule("../../src/frontend/radar-scene-overlays.mjs", () => ({
  createRadarSceneOverlays: layerMocks.createRadarSceneOverlays,
}));
const { createRadarSceneLayers } = await import("../../src/frontend/create-radar-scene-layers.mjs");

test("creates and returns the scene display layers", () => {
  const THREE = {};
  const scene = {};
  const container = {};
  const location = {};
  const windowRef = { document: {} };
  const mapOutlines = {};
  expect(
    createRadarSceneLayers({
      THREE,
      scene,
      container,
      location,
      elevationFeet: 300,
      windowRef,
      mapOutlines,
    }),
  ).toEqual({
    updateRings: "rings",
    airspace: "airspace",
    setConnected: "home",
    layers: "layers",
    overlay: "overlay",
    map: "map",
  });
  expect(layerMocks.createMapOutlineLayer).toHaveBeenCalledWith(
    THREE,
    scene,
    mapOutlines,
    location,
    300,
  );
  expect(layerMocks.createRadarHome).toHaveBeenCalledWith(THREE, scene, "rings");
  expect(layerMocks.createAircraftDisplayOverlay).toHaveBeenCalledWith({
    THREE,
    container,
    windowRef,
    documentRef: windowRef.document,
  });
});

test("uses the global document when the window has no document", () => {
  const previousDocument = globalThis.document;
  globalThis.document = {};
  try {
    createRadarSceneLayers({ THREE: {}, scene: {}, container: {}, windowRef: {} });
    expect(layerMocks.createRadarLayerVisibility).toHaveBeenCalledWith(globalThis.document);
  } finally {
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  }
});
