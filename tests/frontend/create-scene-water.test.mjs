import { expect, jest, test } from "@jest/globals";
import { createSceneWater } from "../../src/frontend/create-scene-water.mjs";

test("loads map outlines around the current camera target and cleans up", async () => {
  const button = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    setAttribute: jest.fn(),
  };
  const fetchRef = jest.fn(async () => ({ ok: true, json: async () => ({ tiles: [] }) }));
  const controls = { target: { x: 4, z: -2 } };
  const scene = { add: jest.fn(), remove: jest.fn() };
  const water = createSceneWater(
    fakeThree(),
    scene,
    { latitude: 43, longitude: -70 },
    300,
    controls,
    { fetch: fetchRef, document: { querySelector: () => button } },
  );
  water.load(20);
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(fetchRef).toHaveBeenCalledTimes(1);
  water.destroy();
  expect(button.removeEventListener).toHaveBeenCalled();
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
