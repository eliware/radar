import { expect, jest, test } from "@jest/globals";
import { createRadarSceneOverlays } from "../../src/frontend/radar-scene-overlays.mjs";
import { RADAR_RING_LABEL_ANGLE } from "../../src/frontend/radar-range.mjs";

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
      this.rotation = { x: 0, y: 0, z: 0 };
      this.position = { set: jest.fn() };
      this.scale = { set: jest.fn() };
      this.userData = {};
    }
  }
  class TorusGeometry {
    constructor(...values) {
      this.values = values;
      this.rotateZ = jest.fn((angle) => {
        this.startAngle = angle;
      });
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
  const labels = scene.children.filter((item) => item instanceof Sprite);
  expect(rings).toHaveLength(68);
  expect(scene.children.filter((item) => item.geometry instanceof CylinderGeometry)).toHaveLength(
    2,
  );
  update(20);
  expect(labels[9].position.set).toHaveBeenCalledWith(-10 / Math.sqrt(2), 0.08, -10 / Math.sqrt(2));
  expect(labels[11].position.set).toHaveBeenCalledWith(
    -20 / Math.sqrt(2),
    0.08,
    -20 / Math.sqrt(2),
  );
  const labeledRing = rings.find((ring) => ring.geometry.values[0] === 10);
  expect(labeledRing.rotation.x).toBe(Math.PI / 2);
  expect(labeledRing.rotation.z).toBe(0);
  expect(labeledRing.geometry.values[4]).toBeLessThan(2 * Math.PI);
  expect(labeledRing.geometry.startAngle).toBeCloseTo(
    RADAR_RING_LABEL_ANGLE + (2 * Math.PI - labeledRing.geometry.values[4]) / 2,
  );
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
  update(300);
  expect(rings.filter((ring) => ring.visible)).toHaveLength(12);
  expect(rings.find((ring) => ring.geometry.values[0] === 50).geometry.values[1]).toBeCloseTo(
    0.825,
  );
  update.setConnected(true);
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
  }
  class Material {
    constructor() {
      this.color = { setHex: jest.fn() };
    }
  }

  const update = createRadarSceneOverlays(
    {
      Mesh,
      TorusGeometry: Geometry,
      CylinderGeometry: Geometry,
      MeshBasicMaterial: Material,
    },
    scene,
  );

  expect(scene.add).toHaveBeenCalledTimes(70);
  expect(() => update(20)).not.toThrow();
});
