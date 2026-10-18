import { expect, jest, test } from "@jest/globals";
import { createRadarReferenceCache } from "../../../../src/frontend/radar/reference/cache.mjs";

const location = { latitude: 43, longitude: -70 };
const collections = (airways = []) => [[], [], [], [], [], airways];

test("merges range batches and applies only visible clipped geometry once", () => {
  const cache = createRadarReferenceCache();
  const scene = { updateAll: jest.fn() };
  cache.add([
    [
      { faaId: "IN", latitude: 43, longitude: -70 },
      { faaId: "OUT", latitude: 44, longitude: -70 },
    ],
    [{ state: "ME", identifier: "ENE", latitude: 43, longitude: -70 }],
    [
      {
        id: "B",
        points: [
          { latitude: 43, longitude: -70 },
          { latitude: 43, longitude: -69.9 },
        ],
      },
    ],
    [{ faaId: "PWM", runwayEnd: "11", latitude: 43, longitude: -70 }],
    [
      {
        id: "P",
        points: [
          { latitude: 43, longitude: -70 },
          { latitude: 43, longitude: -69.9 },
        ],
      },
    ],
    [
      {
        id: "one",
        points: [
          { x: -20, z: 0 },
          { x: 20, z: 0 },
        ],
      },
    ],
  ]);
  cache.add(
    collections([
      {
        id: "two",
        points: [
          { x: 30, z: 30 },
          { x: 40, z: 40 },
        ],
      },
    ]),
  );
  cache.apply(scene, { minX: -10, maxX: 10, minZ: -10, maxZ: 10 }, location);
  expect(scene.updateAll).toHaveBeenCalledTimes(1);
  expect(scene.updateAll.mock.calls[0][0][5]).toEqual([
    {
      id: "one",
      points: [
        { x: -10, z: 0, viewportCut: true },
        { x: 10, z: 0, viewportCut: true },
      ],
    },
  ]);
  expect(scene.updateAll.mock.calls[0][0].slice(0, 5).map((items) => items.length)).toEqual([
    1, 1, 1, 1, 1,
  ]);
});

test("falls back to individual scene updates", () => {
  const cache = createRadarReferenceCache();
  const scene = Object.fromEntries(
    ["Airports", "Navaids", "Boundaries", "Ils", "Procedures", "Airways"].map((name) => [
      `update${name}`,
      jest.fn(),
    ]),
  );
  cache.add(collections([{ id: "Q1", points: [{ x: 0, z: 0 }] }]));
  cache.apply(scene, null, location);
  expect(scene.updateAirways).toHaveBeenCalledWith([{ id: "Q1", points: [{ x: 0, z: 0 }] }]);
});

test("clears all scene reference layers together when batched updates are available", () => {
  const scene = { updateAll: jest.fn() };
  createRadarReferenceCache().clear(scene);
  expect(scene.updateAll).toHaveBeenCalledWith([[], [], [], [], [], []]);
});
