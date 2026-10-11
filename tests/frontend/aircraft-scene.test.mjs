import { expect, jest, test } from "@jest/globals";

class Vector {
  set(...values) {
    this.values = values;
  }
}

class Scene {
  constructor() {
    this.children = [];
    this.rotation = {};
    Scene.instance = this;
  }
  add(item) {
    this.children.push(item);
  }
  remove(item) {
    this.children = this.children.filter((child) => child !== item);
  }
}

class Camera {
  constructor() {
    this.position = new Vector();
    this.up = new Vector();
    Camera.instance = this;
  }
  updateProjectionMatrix() {}
}

class Renderer {
  constructor() {
    this.domElement = { addEventListener() {}, removeEventListener() {} };
    this.render = jest.fn();
    this.setSize = jest.fn();
    this.setPixelRatio = jest.fn();
    this.dispose = jest.fn();
  }
  setPixelRatio() {}
}

class Mesh {
  constructor(geometry, material) {
    this.geometry = geometry;
    this.material = material;
    this.position = new Vector();
    this.scale = new Vector();
    this.rotation = {};
  }
}

class TorusGeometry {
  constructor(...values) {
    this.values = values;
  }
}

class CylinderGeometry {}
class ConeGeometry {}

class Material {
  constructor(options) {
    this.options = options;
  }
}

class Controls {
  constructor() {
    this.target = new Vector();
    this.update = jest.fn();
    this.dispose = jest.fn();
    this.listeners = new Map();
    this.addEventListener = (name, callback) => this.listeners.set(name, callback);
    this.removeEventListener = jest.fn();
    Controls.instance = this;
  }
}

jest.unstable_mockModule("three", () => ({
  Scene,
  Color: class {},
  PerspectiveCamera: Camera,
  WebGLRenderer: Renderer,
  SphereGeometry: class {},
  TorusGeometry,
  CylinderGeometry,
  ConeGeometry,
  MeshBasicMaterial: Material,
  Mesh,
}));
jest.unstable_mockModule("three/addons/controls/OrbitControls.js", () => ({
  OrbitControls: Controls,
}));
const { createAircraftScene } = await import("../../src/frontend/aircraft-scene.mjs");
const { rangeToCameraDistance } = await import("../../src/frontend/radar-range.mjs");

test("draws live aircraft, resizes, resets, and releases the scene", () => {
  let now = Date.now();
  const dateNow = jest.spyOn(Date, "now").mockImplementation(() => now);
  const callbacks = new Map();
  const intervals = new Map();
  const windowRef = {
    devicePixelRatio: 0,
    requestAnimationFrame: jest.fn((callback) => {
      callbacks.set(callbacks.size + 1, callback);
      return callbacks.size;
    }),
    cancelAnimationFrame: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    setInterval: jest.fn((callback) => {
      intervals.set(intervals.size + 1, callback);
      return intervals.size;
    }),
    clearInterval: jest.fn(),
  };
  globalThis.window = windowRef;
  const container = {
    clientWidth: 0,
    clientHeight: 0,
    appendChild: jest.fn(),
    replaceChildren: jest.fn(),
  };
  const view = createAircraftScene({
    container,
    location: { latitude: 43, longitude: -70 },
    elevationFeet: 300,
  });
  expect(Camera.instance.position.values).toEqual([0, rangeToCameraDistance(20), 0]);
  expect(Camera.instance.up.values).toEqual([0, 0, -1]);
  expect(Controls.instance.target.values).toEqual([0, 0, 0]);
  const rings = Scene.instance.children.filter((item) => item.geometry instanceof TorusGeometry);
  expect(rings).toHaveLength(68);
  expect(rings.filter((ring) => ring.visible).map((ring) => ring.geometry.values[0])).toEqual([
    5, 10, 15, 20,
  ]);
  expect(rings.find((ring) => ring.geometry.values[0] === 1).geometry.values[1]).toBe(0.025);
  expect(rings.find((ring) => ring.geometry.values[0] === 10).geometry.values[1]).toBe(0.055);
  expect(windowRef.devicePixelRatio).toBe(0);
  const resize = windowRef.addEventListener.mock.calls[0][1];
  resize();
  container.clientWidth = 800;
  container.clientHeight = 0;
  resize();
  container.clientHeight = 600;
  resize();
  const renderFrame = [...callbacks.values()][0];
  renderFrame();
  view.update({
    icao: "ABC123",
    latitude: 43,
    longitude: -70,
    altitudeFeet: 6376,
    trackDegrees: 90,
  });
  view.update({ icao: "DEF456", latitude: 43, longitude: -70, altitudeFeet: 6376 });
  view.update({
    icao: "ABC123",
    latitude: 43,
    longitude: -70,
    altitudeFeet: 6376,
    trackDegrees: 90,
  });
  expect(view.update({ icao: "BAD000", latitude: undefined, longitude: 0 })).toBeUndefined();
  view.update({
    icao: "FAR123",
    latitude: 43.5,
    longitude: -70,
    altitudeFeet: 6376,
  });
  expect(Camera.instance.position.values[1]).toBeCloseTo(rangeToCameraDistance(35.02), 2);
  now += 120_001;
  intervals.get(1)();
  expect(Camera.instance.position.values).toEqual([0, rangeToCameraDistance(20), 0]);
  view.update({ icao: "FAR456", latitude: 43.6, longitude: -70 });
  expect(Camera.instance.position.values[1]).toBeCloseTo(rangeToCameraDistance(41.0243), 2);
  Controls.instance.listeners.get("start")();
  view.update({ icao: "FAR789", latitude: 43.7, longitude: -70 });
  expect(Camera.instance.position.values[1]).toBeCloseTo(rangeToCameraDistance(41.0243), 2);
  now += 120_001;
  intervals.get(1)();
  view.update({ icao: "NEW123", latitude: 43, longitude: -70 });
  expect(
    Scene.instance.children.filter((item) => item.geometry instanceof ConeGeometry),
  ).toHaveLength(1);
  view.reset();
  expect(Camera.instance.position.values).toEqual([0, rangeToCameraDistance(20), 0]);
  view.destroy();
  expect(windowRef.cancelAnimationFrame).toHaveBeenCalledTimes(1);
  expect(windowRef.removeEventListener).toHaveBeenCalledWith("resize", resize);
  expect(windowRef.clearInterval).toHaveBeenCalledWith(1);
  expect(container.replaceChildren).toHaveBeenCalledTimes(1);
  windowRef.devicePixelRatio = 2;
  const defaultView = createAircraftScene({ container, location: null, elevationFeet: 300 });
  defaultView.destroy();
  dateNow.mockRestore();
});
