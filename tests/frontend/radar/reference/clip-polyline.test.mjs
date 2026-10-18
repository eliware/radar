import { expect, test } from "@jest/globals";
import { clipPolylineToViewport } from "../../../../src/frontend/radar/reference/clip-polyline.mjs";

const box = { minX: -10, maxX: 10, minZ: -10, maxZ: 10 };
const home = { latitude: 43, longitude: -70 };

test("clips a crossing segment to the visible rectangle", () => {
  const [visible] = clipPolylineToViewport(
    {
      id: "Q1",
      points: [
        { x: -20, z: 0 },
        { x: 20, z: 0 },
      ],
    },
    box,
    home,
  );
  expect(visible.points).toEqual([
    { x: -10, z: 0, viewportCut: true },
    { x: 10, z: 0, viewportCut: true },
  ]);
});

test("keeps separate visible runs disconnected", () => {
  const visible = clipPolylineToViewport(
    {
      id: "boundary",
      points: [
        { x: -20, z: 0 },
        { x: 20, z: 0 },
        { x: 20, z: 20 },
        { x: 0, z: 0 },
      ],
    },
    box,
    home,
  );
  expect(visible).toHaveLength(2);
  expect(visible[0].id).toBe("boundary:visible:0");
  expect(visible[1].id).toBe("boundary:visible:1");
});

test("clips geographic paths and preserves original fix metadata", () => {
  const west = { latitude: 43, longitude: -70.2, fix: "WEST", label: true };
  const east = { latitude: 43, longitude: -69.8, fix: "EAST", label: true };
  const [visible] = clipPolylineToViewport(
    { id: "Q2", points: [west, east] },
    { minX: -5, maxX: 5, minZ: -5, maxZ: 5 },
    home,
  );
  expect(visible.points[0].fix).toBe("");
  expect(visible.points[1].fix).toBe("");
  expect(visible.points.every((point) => point.label === false)).toBe(true);
  expect(visible.points.every((point) => point.viewportCut)).toBe(true);
});

test("drops geometry outside the viewport and retains visible single points", () => {
  expect(
    clipPolylineToViewport(
      {
        id: "far",
        points: [
          { x: 20, z: 20 },
          { x: 30, z: 30 },
        ],
      },
      box,
      home,
    ),
  ).toEqual([]);
  expect(clipPolylineToViewport({ id: "near", points: [{ x: 0, z: 0 }] }, box, home)).toHaveLength(
    1,
  );
  expect(
    clipPolylineToViewport({ id: "single-far", points: [{ x: 20, z: 20 }] }, box, home),
  ).toEqual([]);
});

test("handles invalid, empty, tangent, and fully visible paths", () => {
  expect(clipPolylineToViewport({ id: "invalid", points: null }, box, home)).toEqual([]);
  expect(clipPolylineToViewport({ id: "empty", points: [] }, box, home)).toEqual([]);
  expect(
    clipPolylineToViewport(
      {
        id: "tangent",
        points: [
          { x: -20, z: 0 },
          { x: 0, z: 20 },
        ],
      },
      box,
      home,
    ),
  ).toEqual([]);
  const [visible] = clipPolylineToViewport(
    {
      id: "inside",
      points: [
        { x: 0, z: 0 },
        { x: 2, z: 0 },
        { x: 3, z: 0 },
      ],
    },
    box,
    home,
  );
  expect(visible.points).toEqual([
    { x: 0, z: 0 },
    { x: 2, z: 0 },
    { x: 3, z: 0 },
  ]);
  expect(
    clipPolylineToViewport(
      {
        id: "invalid-coordinate",
        points: [
          { x: Number.NaN, z: 0 },
          { x: 1, z: 0 },
        ],
      },
      box,
      home,
    ),
  ).toEqual([]);
});

test("rejects a horizontal segment beyond a box edge", () => {
  expect(
    clipPolylineToViewport(
      {
        id: "outside",
        points: [
          { x: 20, z: 20 },
          { x: 30, z: 20 },
        ],
      },
      box,
      home,
    ),
  ).toEqual([]);
});
