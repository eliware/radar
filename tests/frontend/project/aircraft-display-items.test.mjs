import { expect, test } from "@jest/globals";
import { projectAircraftDisplayItems } from "../../../src/frontend/project/aircraft-display-items.mjs";

test("projects aircraft labels, one-minute vectors, and history points", () => {
  const aircraft = new Map([
    [
      "A1",
      {
        icao: "A1",
        callsign: "RADAR1",
        latitude: 43.1,
        longitude: -70,
        altitudeFeet: 10000,
        verticalRateFeetPerMinute: 0,
        trackDegrees: 0,
        groundSpeedKnots: 120,
        receivedAt: 123,
        remoteOnly: true,
      },
    ],
    ["BAD", { icao: "BAD", latitude: Number.NaN, longitude: -70 }],
  ]);
  const trails = new Map([["A1", [{ x: 1, y: 2, z: 3 }]]]);
  const project = (point) => ({ x: point.x * 2, y: point.z * 2 });
  const result = projectAircraftDisplayItems(
    aircraft,
    trails,
    { latitude: 43, longitude: -70 },
    0,
    project,
  );

  expect(result).toHaveLength(1);
  expect(result[0]).toMatchObject({
    receivedAt: 123,
    remoteOnly: true,
    lines: ["RADAR1", "100C", "120"],
  });
  expect(result[0].futureX).toBe(0);
  expect(result[0].futureY).toBeCloseTo(result[0].y - 4, 0);
  expect(result[0].history).toEqual([{ x: 2, y: 6 }]);
});

test("returns an empty display when the home location is invalid", () => {
  const aircraft = new Map([["A1", { icao: "A1", latitude: 43, longitude: -70 }]]);
  expect(projectAircraftDisplayItems(aircraft, new Map(), null, 0, (point) => point)).toEqual([]);
});

test("drops aircraft, history, and vectors outside the camera depth", () => {
  const aircraft = new Map([
    ["A1", { icao: "A1", latitude: 43.1, longitude: -70, altitudeFeet: 10000 }],
  ]);
  const trails = new Map([["A1", [{ x: 1, y: 2, z: 3 }]]]);
  const result = projectAircraftDisplayItems(
    aircraft,
    trails,
    { latitude: 43, longitude: -70 },
    0,
    () => null,
  );
  expect(result).toEqual([]);
});

test("keeps visible aircraft when its predicted position and history are behind the camera", () => {
  const aircraft = new Map([
    [
      "A1",
      {
        icao: "A1",
        latitude: 43.1,
        longitude: -70,
        altitudeFeet: 10000,
        trackDegrees: 90,
        groundSpeedKnots: 120,
      },
    ],
    ["A2", { icao: "A2", latitude: 43.2, longitude: -70, altitudeFeet: 10000 }],
  ]);
  let calls = 0;
  const project = () => {
    calls += 1;
    if (calls === 1) return { x: 10, y: 20 };
    if (calls === 2) return { x: Number.NaN, y: Number.POSITIVE_INFINITY };
    if (calls === 3) return null;
    return { x: 30, y: 40 };
  };
  const result = projectAircraftDisplayItems(
    aircraft,
    new Map([["A1", [{ x: 1, y: 2, z: 3 }]]]),
    { latitude: 43, longitude: -70 },
    0,
    project,
  );

  expect(result).toHaveLength(2);
  expect(result[0]).toMatchObject({ x: 10, y: 20, futureX: null, futureY: null, history: [] });
  expect(result[1]).toMatchObject({ x: 30, y: 40, futureX: null, futureY: null, history: [] });
});
