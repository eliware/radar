import { expect, test } from "@jest/globals";
import { createClippedPointOperations } from "../../../../src/frontend/radar/reference/clipped-point.mjs";

const { interpolate, same } = createClippedPointOperations();

test("interpolates numeric metadata and clears point labels at viewport cuts", () => {
  const point = interpolate(
    { x: 0, z: 0, latitude: 10, fix: "A", label: true },
    { x: 10, z: 20, latitude: 20, fix: "B", label: true },
    0.25,
  );
  expect(point).toEqual({
    x: 2.5,
    z: 5,
    latitude: 12.5,
    fix: "",
    label: false,
    viewportCut: true,
  });
  expect(interpolate(point, { x: 3, z: 5 }, 0)).toBe(point);
  const end = { x: 3, z: 5 };
  expect(interpolate(point, end, 1)).toBe(end);
});

test("compares clipped coordinates with a small tolerance", () => {
  expect(same({ x: 1, z: 2 }, { x: 1 + 1e-9, z: 2 })).toBe(true);
  expect(same({ x: 1, z: 2 }, { x: 1.1, z: 2 })).toBe(false);
});
