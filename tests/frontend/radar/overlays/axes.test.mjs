import { expect, jest, test } from "@jest/globals";
import { createRadarAxes } from "../../../../src/frontend/radar/overlays/axes.mjs";

test("creates, scales, and colors the two center axes", () => {
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
      this.position = { set: jest.fn() };
      this.scale = { set: jest.fn() };
      this.rotation = {};
    }
  }
  class CylinderGeometry {
    constructor(...values) {
      this.values = values;
    }
  }
  class MeshBasicMaterial {
    constructor(options) {
      this.color = { setHex: jest.fn() };
      this.options = options;
    }
  }
  const axes = createRadarAxes({ Mesh, CylinderGeometry, MeshBasicMaterial }, scene);
  expect(scene.children).toHaveLength(2);
  expect(scene.children.map((axis) => axis.rotation)).toEqual([
    { z: Math.PI / 2 },
    { x: Math.PI / 2 },
  ]);
  axes.updateRange(150);
  expect(scene.children[0].scale.set).toHaveBeenCalledWith(1, 0.5, 1);
  axes.setConnected(false);
  axes.setConnected(true);
  expect(scene.children[0].material.color.setHex).toHaveBeenNthCalledWith(1, 0x555555);
  expect(scene.children[0].material.color.setHex).toHaveBeenNthCalledWith(2, 0x00ff41);
});
