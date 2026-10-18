import { expect, jest, test } from "@jest/globals";
import { createSceneWater } from "../../../src/frontend/create/scene-water.mjs";

test("loads map outlines around the current camera target and cleans up", async () => {
  const listeners = new Map();
  const fetchRef = jest.fn(async () => ({ ok: true, json: async () => ({ tiles: [] }) }));
  const controls = { target: { x: 4, z: -2 } };
  const scene = { add: jest.fn(), remove: jest.fn() };
  const water = createSceneWater(
    fakeThree(),
    scene,
    { latitude: 43, longitude: -70 },
    300,
    controls,
    {
      fetch: fetchRef,
      document: {
        addEventListener: jest.fn((_name, callback) => listeners.set("keydown", callback)),
        removeEventListener: jest.fn(),
      },
    },
  );
  expect(water.isVisible()).toBe(true);
  water.load(20);
  for (let turn = 0; turn < 20; turn += 1) await Promise.resolve();
  expect(fetchRef).toHaveBeenCalledTimes(1);
  listeners.get("keydown")({ key: "w", preventDefault: jest.fn() });
  expect(water.isVisible()).toBe(false);
  water.destroy();
});

function fakeThree() {
  class Material {
    dispose() {}
  }
  class Geometry {
    setAttribute() {}
    dispose() {}
  }
  class Attribute {
    constructor() {}
  }
  class Lines {
    constructor(geometry) {
      this.geometry = geometry;
    }
  }
  return {
    LineBasicMaterial: Material,
    BufferGeometry: Geometry,
    Float32BufferAttribute: Attribute,
    LineSegments: Lines,
  };
}
