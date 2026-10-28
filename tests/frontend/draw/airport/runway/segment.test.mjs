import { expect, jest, test } from "@jest/globals";
import { drawRunwaySegment } from "../../../../../src/frontend/draw/airport/runway/segment.mjs";

const runway = [
  { latitude: 43, longitude: -70, elevationFeet: 50 },
  { latitude: 43.01, longitude: -70, elevationFeet: 60 },
];

test("projects runway ends, fills missing elevation, and draws the segment", () => {
  const context = { beginPath: jest.fn(), moveTo: jest.fn(), lineTo: jest.fn(), stroke: jest.fn() };
  const projected = [];
  const ends = drawRunwaySegment(
    context,
    [runway[0], { ...runway[1], elevationFeet: undefined }],
    { elevationFeet: 300 },
    (point) => {
      projected.push(point);
      return { x: point.longitude, y: point.latitude };
    },
  );
  expect(projected[1].elevationFeet).toBe(300);
  expect(ends[0].elevationFeet).toBe(50);
  expect(context.moveTo).toHaveBeenCalledWith(-70, 43);
  expect(context.lineTo).toHaveBeenCalledWith(-70, 43.01);
  expect(context.stroke).toHaveBeenCalledTimes(1);
});

test("skips invalid projections and honors hidden runway segments", () => {
  const context = { beginPath: jest.fn(), moveTo: jest.fn(), lineTo: jest.fn(), stroke: jest.fn() };
  expect(drawRunwaySegment(context, runway, {}, () => null)).toBeNull();
  expect(
    drawRunwaySegment(
      context,
      runway,
      {},
      (point) => ({ x: point.longitude, y: point.latitude }),
      false,
    ),
  ).toHaveLength(2);
  expect(context.stroke).not.toHaveBeenCalled();
});
