import { expect, jest, test } from "@jest/globals";
import { createRadarSceneOverlays } from "../../src/frontend/radar-scene-overlays.mjs";

test("shows matching rings and center axes for the selected range", () => {
  const scene = {
    children: [],
    add(item) {
      this.children.push(item);
    },
  };
  class Mesh {
    constructor(geometry, material) {
      this.geometry = geometry;
      this.material = material;
      this.rotation = {};
      this.position = { set: jest.fn() };
      this.scale = { set: jest.fn() };
      this.userData = {};
    }
  }
  class TorusGeometry {
    constructor(...values) {
      this.values = values;
    }
  }
  class CylinderGeometry {
    constructor(...values) {
      this.values = values;
    }
  }
  class MeshBasicMaterial {
    constructor(options) {
      this.options = options;
    }
  }
  class Sprite {
    constructor(material) {
      this.material = material;
      this.position = { set: jest.fn() };
      this.scale = { set: jest.fn() };
      this.userData = {};
    }
  }
  class CanvasTexture {
    constructor() {
      this.dispose = jest.fn();
    }
  }
  class SpriteMaterial {
    constructor(options) {
      this.map = options.map;
      this.dispose = jest.fn();
    }
  }
  const documentRef = { createElement: () => ({ getContext: () => ({ fillText() {} }) }) };
  const update = createRadarSceneOverlays(
    {
      Mesh,
      TorusGeometry,
      CylinderGeometry,
      MeshBasicMaterial,
      Sprite,
      CanvasTexture,
      SpriteMaterial,
    },
    scene,
    documentRef,
  );
  const rings = scene.children.filter((item) => item.geometry instanceof TorusGeometry);
  expect(rings).toHaveLength(68);
  expect(scene.children.filter((item) => item.geometry instanceof CylinderGeometry)).toHaveLength(
    2,
  );
  update(20);
  expect(rings.filter((ring) => ring.visible).map((ring) => ring.geometry.values[0])).toEqual([
    5, 10, 15, 20,
  ]);
  update(3);
  expect(rings.filter((ring) => ring.visible).map((ring) => ring.geometry.values[0])).toEqual([
    1, 2, 3,
  ]);
  update(8);
  expect(rings.filter((ring) => ring.visible)).toHaveLength(8);
  update(300);
  expect(rings.filter((ring) => ring.visible)).toHaveLength(60);
  expect(rings.find((ring) => ring.geometry.values[0] === 10).geometry.values[1]).toBeCloseTo(
    0.825,
  );
});
