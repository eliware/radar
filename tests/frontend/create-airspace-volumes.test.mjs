import { expect, jest, test } from "@jest/globals";
import { createAirspaceVolumes } from "../../src/frontend/create-airspace-volumes.mjs";

test("adds a bounded airspace shell once and disposes it", () => {
  class Geometry {
    setAttribute = jest.fn();
    dispose = jest.fn();
  }
  class Lines {
    constructor(geometry) {
      this.geometry = geometry;
    }
  }
  class Material {
    dispose = jest.fn();
  }
  const THREE = {
    BufferGeometry: Geometry,
    Float32BufferAttribute: class {
      constructor(values, size) {
        this.values = values;
        this.size = size;
      }
    },
    LineSegments: Lines,
    LineBasicMaterial: Material,
  };
  const scene = { add: jest.fn(), remove: jest.fn() };
  const volumes = createAirspaceVolumes(THREE, scene, { latitude: 43, longitude: -70 }, 300);
  const airport = { faaId: "PWM", latitude: 43, longitude: -70, classC: "Y", elevationFeet: 76 };
  volumes.update([airport, airport]);
  expect(scene.add).toHaveBeenCalledTimes(1);
  volumes.dispose();
  expect(scene.remove).toHaveBeenCalledTimes(1);
});

test("skips airports without airspace flags or usable positions", () => {
  class Geometry {
    setAttribute = jest.fn();
  }
  class Material {}
  const THREE = {
    BufferGeometry: Geometry,
    Float32BufferAttribute: class {},
    LineSegments: class {},
    LineBasicMaterial: Material,
  };
  const scene = { add: jest.fn(), remove: jest.fn() };
  const volumes = createAirspaceVolumes(THREE, scene, { latitude: 43, longitude: -70 }, 300);

  volumes.update([
    { faaId: "NONE", latitude: 43, longitude: -70 },
    { faaId: "INVALID", latitude: Number.NaN, longitude: -70, classD: "Y" },
  ]);
  volumes.dispose();

  expect(scene.add).not.toHaveBeenCalled();
  expect(scene.remove).not.toHaveBeenCalled();
});
