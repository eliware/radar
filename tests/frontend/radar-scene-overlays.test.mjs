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
  const update = createRadarSceneOverlays(
    { Mesh, TorusGeometry, CylinderGeometry, MeshBasicMaterial },
    scene,
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
  update(300);
  expect(rings.filter((ring) => ring.visible)).toHaveLength(60);
});
