import { expect, beforeEach, jest, test } from "@jest/globals";
import { registerAircraftSceneMocks } from "../../../../test-fixtures/aircraft-scene-mocks.mjs";

const mocks = registerAircraftSceneMocks(jest, "../../../../src/frontend");
const { createAircraftSceneResources } =
  await import("../../../../src/frontend/aircraft/scene/resources.mjs");
const { createAircraftVisibility } =
  await import("../../../../src/frontend/create/aircraft-visibility.mjs");

beforeEach(() => jest.clearAllMocks());

test("constructs renderer resources for dashboard composition", () => {
  const container = { replaceChildren: jest.fn() };
  const location = { latitude: 43, longitude: -70 };
  const resources = createAircraftSceneResources({
    container,
    location,
    elevationFeet: 300,
    windowRef: {},
  });
  expect(mocks.factories.createRadarStage).toHaveBeenCalledWith(expect.anything(), container, {});
  expect(resources.dashboardOptions).toEqual(
    expect.objectContaining({
      camera: mocks.camera,
      controls: mocks.controls,
      container,
      elevationFeet: 300,
      location,
      radarCamera: mocks.radarCamera,
      renderer: mocks.renderer,
    }),
  );
});

test("clears retained remote aircraft immediately when local-only mode is enabled", () => {
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: { getItem: () => null, setItem: jest.fn() },
  });
  const listeners = [];
  const documentRef = {
    addEventListener: (_type, listener) => listeners.push(listener),
    removeEventListener: jest.fn(),
  };
  mocks.targets.removeRemoteOnlyExcept.mockReturnValue(["remote"]);
  createAircraftSceneResources({
    container: { replaceChildren: jest.fn() },
    location: { latitude: 43, longitude: -70 },
    elevationFeet: 300,
    windowRef: { document: documentRef },
  });

  listeners.forEach((listener) => listener({ key: "l", preventDefault: jest.fn() }));
  listeners.forEach((listener) => listener({ key: "l", preventDefault: jest.fn() }));
  const visibilityListeners = [];
  createAircraftVisibility({
    addEventListener: (_type, listener) => visibilityListeners.push(listener),
  });
  visibilityListeners[0]({ key: "l", preventDefault: jest.fn() });

  expect(mocks.targets.removeRemoteOnlyExcept).toHaveBeenCalledTimes(1);
  expect(mocks.targets.removeRemoteOnlyExcept).toHaveBeenCalledWith([]);
  expect(mocks.trails.remove).toHaveBeenCalledWith(["remote"]);
  expect(mocks.receiveTimes.remove).toHaveBeenCalledWith(["remote"]);
  if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
  else delete globalThis.localStorage;
});
