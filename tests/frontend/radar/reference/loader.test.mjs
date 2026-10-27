import { afterEach, expect, jest, test } from "@jest/globals";
import { createRadarReferenceLoader } from "../../../../src/frontend/radar/reference/loader.mjs";

const response = (rows = []) => ({ ok: true, json: async () => rows });
const bounds = { minX: -20, maxX: 20, minZ: -20, maxZ: 20, minRangeNm: 0, maxRangeNm: 40 };
const location = { latitude: 43, longitude: -70 };

function scene() {
  return Object.fromEntries(
    ["Airports", "Navaids", "Boundaries", "Ils", "Procedures", "Airways"].map((name) => [
      `update${name}`,
      jest.fn(),
    ]),
  );
}

async function flush(milliseconds = 0) {
  await jest.advanceTimersByTimeAsync(milliseconds);
  for (let index = 0; index < 8; index += 1) await Promise.resolve();
}

afterEach(() => jest.useRealTimers());

test("loads a coarse range bucket and clips crossing geometry to the viewport", async () => {
  jest.useFakeTimers();
  const updates = scene();
  const fetchData = jest.fn((url) =>
    Promise.resolve(
      response(
        url.includes("/airways?")
          ? [
              {
                id: "crossing",
                points: [
                  { x: -50, z: 0 },
                  { x: 50, z: 0 },
                ],
              },
              {
                id: "outside",
                points: [
                  { x: 50, z: 50 },
                  { x: 60, z: 60 },
                ],
              },
            ]
          : [],
      ),
    ),
  );
  const loader = createRadarReferenceLoader(fetchData, updates, location);
  loader.load(bounds);
  await flush(80);
  loader.load(bounds);

  expect(fetchData).toHaveBeenCalledTimes(6);
  expect(fetchData).toHaveBeenCalledWith(expect.stringContaining("minRangeNm=0&maxRangeNm=50"));
  expect(updates.updateAirways).toHaveBeenCalledWith([
    {
      id: "crossing",
      points: [
        { x: -20, z: 0, viewportCut: true },
        { x: 20, z: 0, viewportCut: true },
      ],
    },
  ]);
});

test("reuses cached geometry while panning within the loaded range", async () => {
  jest.useFakeTimers();
  const updates = scene();
  const fetchData = jest.fn().mockResolvedValue(response());
  const loader = createRadarReferenceLoader(fetchData, updates, location);
  loader.load(bounds);
  await flush(80);
  loader.load({ ...bounds, maxX: 25, maxRangeNm: 45 });
  await flush(500);
  expect(fetchData).toHaveBeenCalledTimes(6);
  expect(updates.updateAirways).toHaveBeenCalledTimes(2);
});

test("fetches only the newly exposed range when zooming out", async () => {
  jest.useFakeTimers();
  const fetchData = jest.fn().mockResolvedValue(response());
  const loader = createRadarReferenceLoader(fetchData, scene(), location);
  loader.load(bounds);
  await flush(80);
  loader.load({ ...bounds, maxX: 30, maxRangeNm: 61 });
  await flush(180);
  expect(fetchData).toHaveBeenCalledTimes(12);
  expect(fetchData).toHaveBeenCalledWith(expect.stringContaining("minRangeNm=50&maxRangeNm=75"));
});

test("queues a larger range while the initial query batch is still running", async () => {
  jest.useFakeTimers();
  const resolvers = [];
  const fetchData = jest.fn(() => new Promise((resolve) => resolvers.push(resolve)));
  const loader = createRadarReferenceLoader(fetchData, scene(), location);
  loader.load(bounds);
  loader.load({ ...bounds, maxX: 30, maxRangeNm: 61 });
  expect(fetchData).toHaveBeenCalledTimes(6);
  resolvers.splice(0, 6).forEach((resolve) => resolve(response()));
  await flush();
  await flush(180);
  expect(fetchData).toHaveBeenCalledTimes(12);
  expect(fetchData).toHaveBeenCalledWith(expect.stringContaining("minRangeNm=50&maxRangeNm=75"));
  resolvers.splice(0).forEach((resolve) => resolve(response()));
  await flush();
});

test("does not fall back to loading all references when viewport bounds are unavailable", () => {
  const updates = scene();
  const fetchData = jest.fn();
  createRadarReferenceLoader(fetchData, updates, location).load(500);
  expect(fetchData).not.toHaveBeenCalled();
  Object.values(updates).forEach((update) => expect(update).toHaveBeenCalledWith([]));
});

test("clears references when viewport bounds omit the visible range", () => {
  const updates = scene();
  const fetchData = jest.fn();
  createRadarReferenceLoader(fetchData, updates, location).load({
    minX: -1,
    maxX: 1,
    minZ: -1,
    maxZ: 1,
  });
  expect(fetchData).not.toHaveBeenCalled();
  Object.values(updates).forEach((update) => expect(update).toHaveBeenCalledWith([]));
});

test("retries a failed range request while the viewport stays stationary", async () => {
  jest.useFakeTimers();
  const updates = scene();
  const fetchData = jest.fn().mockResolvedValueOnce({ ok: false }).mockResolvedValue(response());
  createRadarReferenceLoader(fetchData, updates, location).load(bounds);
  await flush();
  expect(fetchData).toHaveBeenCalledTimes(6);
  await flush(180);
  expect(fetchData).toHaveBeenCalledTimes(12);
  Object.values(updates).forEach((update) => expect(update).not.toHaveBeenCalled());
});

test("clears references outside the 300 nautical mile limit", () => {
  const updates = scene();
  const fetchData = jest.fn();
  createRadarReferenceLoader(fetchData, updates, location).load({
    ...bounds,
    minRangeNm: 320,
    maxRangeNm: 300,
  });
  expect(fetchData).not.toHaveBeenCalled();
  Object.values(updates).forEach((update) => expect(update).toHaveBeenCalledWith([]));
});
