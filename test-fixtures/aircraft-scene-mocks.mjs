import { registerThreeSceneMocks } from "./three-scene-mocks.mjs";

export function registerAircraftSceneMocks(jest) {
  registerThreeSceneMocks(jest);
  const scene = { rotation: {} };
  const camera = {
    position: { x: 0, y: 0, z: 0 },
    up: {
      x: 0,
      y: 0,
      z: -1,
      set(x, y, z) {
        Object.assign(this, { x, y, z });
      },
    },
    lookAt: jest.fn(),
  };
  const renderer = { domElement: {}, dispose: jest.fn() };
  const controlsDispose = jest.fn();
  const controls = {
    target: {
      x: 0,
      y: 0,
      z: 0,
      set(x, y, z) {
        Object.assign(this, { x, y, z });
      },
    },
    update: jest.fn(),
    dispose: controlsDispose,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
  const homeConnected = jest.fn();
  const updateRings = jest.fn();
  const airspace = { update: jest.fn(), dispose: jest.fn() };
  const targets = {
    update: jest.fn(() => []),
    distances: jest.fn(() => []),
    items: jest.fn(() => []),
  };
  const trails = { add: jest.fn(), remove: jest.fn() };
  const overlay = { draw: jest.fn(), destroy: jest.fn() };
  const stopRadarLoops = jest.fn();
  const radarCamera = {
    currentRange: 20,
    setRange: jest.fn(function (range) {
      this.currentRange = range;
    }),
    setRotation: jest.fn(),
    range: jest.fn(function () {
      return this.currentRange;
    }),
    dispose: jest.fn(),
  };
  const referenceUpdates = {
    updateAirports: jest.fn(),
    updateNavaids: jest.fn(),
    updateBoundaries: jest.fn(),
  };
  const references = {
    airports: new Map(),
    navaids: new Map(),
    boundaries: new Map(),
    updates: jest.fn((onAirports) => ({
      ...referenceUpdates,
      updateAirports: jest.fn((items) => {
        referenceUpdates.updateAirports(items);
        onAirports(items);
      }),
    })),
  };
  const projectAircraftPosition = jest.fn((aircraft) =>
    Number.isFinite(aircraft.latitude) && Number.isFinite(aircraft.longitude)
      ? { x: aircraft.latitude, z: aircraft.longitude }
      : null,
  );
  const selectDefaultRadarRange = jest.fn((distances) =>
    Math.max(20, ...distances.filter(Number.isFinite).map((distance) => distance + 5)),
  );
  const updateAircraft = jest.fn();
  const createAircraftSceneUpdater = jest.fn(() => updateAircraft);
  const orbitState = {
    northAngle: jest.fn(() => 0),
    onViewChange: jest.fn(() => jest.fn()),
    range: jest.fn(() => radarCamera.range()),
  };
  const factories = {
    createRadarStage: jest.fn(() => ({ scene, camera, renderer })),
    createRadarSceneOverlays: jest.fn(() => updateRings),
    createAirspaceVolumes: jest.fn(() => airspace),
    createRadarHome: jest.fn(() => homeConnected),
    createRadarCamera: jest.fn(() => radarCamera),
    createRadarTargets: jest.fn(() => targets),
    createAircraftTrails: jest.fn(() => trails),
    createAircraftDisplayOverlay: jest.fn(() => overlay),
    createAircraftRadarLoop: jest.fn(() => stopRadarLoops),
    createRadarReferenceStore: jest.fn(() => references),
    createAircraftSceneUpdater,
  };
  const modules = {
    createRadarStage: "create/radar/stage",
    createRadarSceneOverlays: "radar/scene-overlays",
    createAirspaceVolumes: "create/airspace-volumes",
    createRadarHome: "create/radar/home",
    createRadarCamera: "radar/camera",
    createRadarTargets: "radar/targets",
    createAircraftTrails: "aircraft/trails",
    createAircraftDisplayOverlay: "aircraft/display-overlay",
    createAircraftRadarLoop: "create/aircraft/radar/loop",
    createRadarReferenceStore: "radar/reference/store",
    createAircraftSceneUpdater: "update-aircraft-scene",
  };
  for (const [name, factory] of Object.entries(factories)) {
    const path = modules[name];
    jest.unstable_mockModule(`../../../src/frontend/${path}.mjs`, () => ({
      [name]: factory,
    }));
  }
  jest.unstable_mockModule("../../../src/frontend/aircraft/space-position.mjs", () => ({
    projectAircraftPosition,
  }));
  jest.unstable_mockModule("../../../src/frontend/radar/range.mjs", () => ({
    DEFAULT_RADAR_RANGE: 20,
    MAX_RADAR_RANGE: 300,
    selectDefaultRadarRange,
  }));
  jest.unstable_mockModule("../../../src/frontend/create/orbit-radar-state.mjs", () => ({
    createOrbitRadarState: jest.fn(() => orbitState),
  }));
  jest.unstable_mockModule("three/addons/controls/OrbitControls.js", () => ({
    OrbitControls: class {
      constructor() {
        return controls;
      }
    },
  }));
  return {
    scene,
    camera,
    renderer,
    controls,
    controlsDispose,
    homeConnected,
    updateRings,
    airspace,
    targets,
    trails,
    overlay,
    stopRadarLoops,
    radarCamera,
    references,
    referenceUpdates,
    factories,
    projectAircraftPosition,
    selectDefaultRadarRange,
    updateAircraft,
    orbitState,
  };
}
