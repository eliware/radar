import { expect, jest, test } from "@jest/globals";

class Vector {
  set(...values) {
    this.values = values;
  }
}

class Scene {
  constructor() {
    this.children = [];
    Scene.instance = this;
  }
  add(item) {
    this.children.push(item);
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
    this.domElement = {};
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
    this.rotation = {};
  }
}

class TorusGeometry {
  constructor(...values) {
    this.values = values;
  }
}

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
  ConeGeometry: class {},
  MeshBasicMaterial: Material,
  Mesh,
}));
jest.unstable_mockModule("three/addons/controls/OrbitControls.js", () => ({
  OrbitControls: Controls,
}));
const { createAircraftScene } = await import("../../src/frontend/aircraft-scene.mjs");

test("draws live aircraft, resizes, resets, and releases the scene", () => {
  const callbacks = new Map();
  const windowRef = {
    devicePixelRatio: 0,
    requestAnimationFrame: jest.fn((callback) => {
      callbacks.set(callbacks.size + 1, callback);
      return callbacks.size;
    }),
    cancelAnimationFrame: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
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
  expect(container.appendChild).toHaveBeenCalledTimes(1);
  expect(Camera.instance.position.values).toEqual([0, 25, 0]);
  expect(Camera.instance.up.values).toEqual([0, 0, -1]);
  expect(Controls.instance.target.values).toEqual([0, 0, 0]);
  const rings = Scene.instance.children.filter((item) => item.geometry instanceof TorusGeometry);
  expect(rings.map((ring) => ring.geometry.values[0])).toEqual([
    5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60,
  ]);
  expect(rings[0].geometry.values[1]).toBe(0.025);
  expect(rings[1].geometry.values[1]).toBe(0.055);
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
  const childCount = callbacks.size;
  view.update({
    icao: "ABC123",
    latitude: 43,
    longitude: -70,
    altitudeFeet: 6376,
    trackDegrees: 90,
  });
  expect(view.update({ icao: "BAD000", latitude: undefined, longitude: 0 })).toBeUndefined();
  expect(callbacks.size).toBe(childCount);
  view.reset();
  expect(Camera.instance.position.values).toEqual([0, 25, 0]);
  expect(Controls.instance.target.values).toEqual([0, 0, 0]);
  view.destroy();
  expect(windowRef.cancelAnimationFrame).toHaveBeenCalledTimes(1);
  expect(windowRef.removeEventListener).toHaveBeenCalledWith("resize", resize);
  expect(container.replaceChildren).toHaveBeenCalledTimes(1);
});

test("uses the browser pixel ratio when it exists", () => {
  const windowRef = {
    devicePixelRatio: 2,
    requestAnimationFrame: () => 1,
    cancelAnimationFrame: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
  globalThis.window = windowRef;
  const container = {
    clientWidth: 0,
    clientHeight: 0,
    appendChild: jest.fn(),
    replaceChildren: jest.fn(),
  };
  const scene = createAircraftScene({ container, location: null, elevationFeet: 300 });
  scene.destroy();
});
