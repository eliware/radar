import { expect, jest, test } from "@jest/globals";
import { createRadarRings } from "../../../../src/frontend/radar/overlays/rings.mjs";
import { RADAR_RING_LABEL_ANGLE } from "../../../../src/frontend/radar/range.mjs";

test("shows and updates rings and their labels for the selected range", () => {
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
      this.rotation = { x: 0, y: 0, z: 0 };
      this.position = { set: jest.fn() };
      this.scale = { set: jest.fn() };
      this.userData = {};
    }
  }
  class TorusGeometry {
    constructor(...values) {
      this.values = values;
      this.transforms = [];
      this.rotateZ = jest.fn((angle) => {
        this.startAngle = angle;
        this.transforms.push(["z", angle]);
      });
      this.rotateX = jest.fn((angle) => {
        this.transforms.push(["x", angle]);
      });
    }
  }
  class MeshBasicMaterial {
    constructor(options) {
      this.options = options;
      this.color = { setHex: jest.fn() };
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
  const documentRef = {
    createElement: () => ({ getContext: () => ({ clearRect() {}, fillText() {} }) }),
  };
  const ringsView = createRadarRings(
    {
      Mesh,
      TorusGeometry,
      MeshBasicMaterial,
      Sprite,
      CanvasTexture,
      SpriteMaterial,
    },
    scene,
    documentRef,
  );
  const rings = scene.children.filter((item) => item.geometry instanceof TorusGeometry);
  const labels = scene.children.filter((item) => item instanceof Sprite);
  expect(rings).toHaveLength(68);
  ringsView.updateRange(20);
  expect(labels[9].position.set).toHaveBeenCalledWith(-10 / Math.sqrt(2), 0.08, -10 / Math.sqrt(2));
  expect(labels[11].position.set).toHaveBeenCalledWith(
    -20 / Math.sqrt(2),
    0.08,
    -20 / Math.sqrt(2),
  );
  const labeledRing = rings.find((ring) => ring.geometry.values[0] === 10);
  expect(labeledRing.rotation.x).toBe(0);
  expect(labeledRing.rotation.z).toBe(0);
  expect(labeledRing.geometry.values[4]).toBeLessThan(2 * Math.PI);
  expect(labeledRing.geometry.startAngle).toBeCloseTo(
    RADAR_RING_LABEL_ANGLE + (2 * Math.PI - labeledRing.geometry.values[4]) / 2,
  );
  expect(labeledRing.geometry.transforms.at(-1)).toEqual(["x", Math.PI / 2]);
  expect(rings.filter((ring) => ring.visible).map((ring) => ring.geometry.values[0])).toEqual([
    5, 10, 15, 20,
  ]);
  ringsView.updateRange(3);
  expect(rings.filter((ring) => ring.visible).map((ring) => ring.geometry.values[0])).toEqual([
    1, 2, 3,
  ]);
  ringsView.updateRange(8);
  expect(rings.filter((ring) => ring.visible)).toHaveLength(8);
  ringsView.updateRange(300);
  ringsView.updateRange(300);
  expect(rings.filter((ring) => ring.visible)).toHaveLength(12);
  expect(rings.find((ring) => ring.geometry.values[0] === 50).geometry.values[1]).toBeCloseTo(
    0.825,
  );
  ringsView.setConnected(true);
  expect(rings[0].material.color.setHex).toHaveBeenCalled();
});

test("draws rings when the browser cannot create text labels", () => {
  const scene = { add: jest.fn() };
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
  class Geometry {
    constructor(...values) {
      this.values = values;
    }

    rotateZ() {}

    rotateX() {}
  }
  class Material {
    constructor() {
      this.color = { setHex: jest.fn() };
    }
  }

  const ringsView = createRadarRings(
    {
      Mesh,
      TorusGeometry: Geometry,
      MeshBasicMaterial: Material,
    },
    scene,
  );

  expect(scene.add).toHaveBeenCalledTimes(68);
  expect(() => ringsView.updateRange(20)).not.toThrow();
});
