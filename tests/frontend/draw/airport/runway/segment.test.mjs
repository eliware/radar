import { expect, test } from "@jest/globals";
import { drawRunwaySegment } from "../../../../../src/frontend/draw/airport/runway/segment.mjs";

const runway = [
  { latitude: 43, longitude: -70, elevationFeet: 50 },
  { latitude: 43.01, longitude: -70, elevationFeet: 60 },
];

test("projects runway ends and fills missing elevation", () => {
  const projected = [];
  const ends = drawRunwaySegment(
    [runway[0], { ...runway[1], elevationFeet: undefined }],
    { elevationFeet: 300 },
    (point) => {
      projected.push(point);
      return { x: point.longitude, y: point.latitude };
    },
  );
  expect(projected[1].elevationFeet).toBe(300);
  expect(ends.ends[0].elevationFeet).toBe(50);
  expect(ends.points).toEqual([
    { x: -70, y: 43 },
    { x: -70, y: 43.01 },
  ]);
});

test("skips invalid projections", () => {
  expect(drawRunwaySegment(runway, {}, () => null)).toBeNull();
});
