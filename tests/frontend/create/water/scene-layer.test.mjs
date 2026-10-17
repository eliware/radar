import { expect, jest, test } from "@jest/globals";
import { createWaterSceneLayer } from "../../../../src/frontend/create/water/scene-layer.mjs";

test("creates and replaces geographic line geometry at ground elevation", () => {
  const scene = { add: jest.fn(), remove: jest.fn() };
  const THREE = fakeThree();
  const layer = createWaterSceneLayer(THREE, scene, { latitude: 43, longitude: -70 }, 300);
  layer.setVisible(false);
  layer.setPaths([
    [
      { latitude: 43, longitude: -70 },
      { latitude: 43.1, longitude: -70 },
    ],
  ]);
  const first = THREE.lines[0];
  expect(first.geometry.attributes.position.values).toHaveLength(6);
  layer.setVisible(false);
  expect(first.visible).toBe(false);
  layer.setPaths([]);
  expect(first.geometry.disposed).toBe(true);
  layer.setVisible(true);
  layer.setPaths([
    [
      { latitude: 43, longitude: -70 },
      { latitude: 43.1, longitude: -70 },
    ],
  ]);
  expect(THREE.lines[1].visible).toBe(true);
  layer.dispose();
  expect(THREE.material.disposed).toBe(true);
  const unused = createWaterSceneLayer(THREE, scene, null, 0);
  unused.dispose();
});

function fakeThree() {
  const state = { lines: [], material: null };
  class Material {
    constructor(options) {
      Object.assign(this, options);
      state.material = this;
    }
    dispose() {
      this.disposed = true;
    }
  }
  class Geometry {
    setAttribute(name, value) {
      this.attributes ??= {};
      this.attributes[name] = value;
    }
    dispose() {
      this.disposed = true;
    }
  }
  class Float32Attribute {
    constructor(values, size) {
      this.values = values;
      this.size = size;
    }
  }
  class LineSegments {
    constructor(geometry, material) {
      this.geometry = geometry;
      this.material = material;
      state.lines.push(this);
    }
  }
  return Object.assign(state, {
    LineBasicMaterial: Material,
    BufferGeometry: Geometry,
    Float32BufferAttribute: Float32Attribute,
    LineSegments,
  });
}
