import { expect, jest, test } from "@jest/globals";
import {
  createAircraftMarker,
  removeAircraftMarkers,
} from "../../src/frontend/aircraft-marker.mjs";

test("creates a yellow aircraft marker that points along its flight path", () => {
  const values = [];
  const THREE = {
    Mesh: class {
      constructor(geometry, material) {
        this.geometry = geometry;
        this.material = material;
        this.rotation = {};
      }
    },
    ConeGeometry: class {
      constructor(...args) {
        values.push(args);
      }
    },
    MeshBasicMaterial: class {
      constructor(options) {
        this.options = options;
      }
    },
  };
  const marker = createAircraftMarker(THREE);
  expect(values).toEqual([[0.16, 0.55, 4]]);
  expect(marker.material.options).toEqual({ color: 0xffc247 });
  expect(marker.rotation.x).toBe(Math.PI / 2);
  const scene = { remove: jest.fn() };
  const markers = new Map([["ABC123", marker]]);
  removeAircraftMarkers(scene, markers, ["ABC123"]);
  expect(scene.remove).toHaveBeenCalledWith(marker);
  expect(markers.size).toBe(0);
});
