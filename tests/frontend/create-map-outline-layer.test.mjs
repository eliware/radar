import { expect, jest, test } from "@jest/globals";
import { createMapOutlineLayer } from "../../src/frontend/create-map-outline-layer.mjs";

function three() {
  return {
    BufferGeometry: class {
      setAttribute(name, attribute) {
        this.attribute = { name, attribute };
      }
      dispose = jest.fn();
    },
    Float32BufferAttribute: class {
      constructor(values, size) {
        this.values = values;
        this.size = size;
      }
    },
    LineBasicMaterial: class {
      constructor(options) {
        this.options = options;
      }
      dispose = jest.fn();
    },
    LineSegments: class {
      constructor(geometry, material) {
        this.geometry = geometry;
        this.material = material;
      }
    },
  };
}

test("builds a gray, ground-level line layer and releases it", () => {
  const scene = { add: jest.fn(), remove: jest.fn() };
  const dispose = createMapOutlineLayer(
    three(),
    scene,
    {
      coastline: [
        [
          [-70, 43],
          [-69.9, 43.1],
          [Number.NaN, 43],
        ],
      ],
      lakes: [],
    },
    { latitude: 43, longitude: -70 },
    300,
  );
  const lines = scene.add.mock.calls[0][0];
  expect(lines.geometry.attribute.attribute.values).toHaveLength(6);
  expect(lines.material.options).toEqual({ color: 0x383838, depthTest: true });
  dispose.setRange(1);
  expect(lines.geometry.attribute.attribute.values).toHaveLength(6);
  dispose();
  expect(scene.remove).toHaveBeenCalledWith(lines);
  expect(lines.geometry.dispose).toHaveBeenCalledTimes(1);
  expect(lines.material.dispose).toHaveBeenCalledTimes(1);
});

test("skips invalid coordinates and world-spanning segments", () => {
  const scene = { add: jest.fn(), remove: jest.fn() };
  createMapOutlineLayer(
    three(),
    scene,
    {
      coastline: [
        [
          [0, 0],
          [Number.NaN, 1],
          [170, 1],
          [-170, 1],
        ],
        [
          [2, 0],
          [3, 0],
        ],
      ],
      lakes: undefined,
    },
    { latitude: 0, longitude: 0 },
    0,
  ).setRange(1);
  expect(scene.add.mock.calls[0][0].geometry.attribute.attribute.values).toEqual([]);
});

test.each([
  [null, { coastline: [] }],
  [{ latitude: 0, longitude: 0 }, null],
])("does nothing without map data or home coordinates", (location, outlines) => {
  const scene = { add: jest.fn() };
  const dispose = createMapOutlineLayer(three(), scene, outlines, location, 0);
  expect(dispose).toEqual(expect.any(Function));
  expect(dispose.setRange).toEqual(expect.any(Function));
  dispose.setRange(20);
  dispose();
  expect(scene.add).not.toHaveBeenCalled();
});
