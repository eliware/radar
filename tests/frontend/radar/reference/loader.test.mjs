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

async function flush() {
  await jest.advanceTimersByTimeAsync(180);
  await Promise.resolve();
  await Promise.resolve();
}

afterEach(() => jest.useRealTimers());

test("loads only the viewport range and keeps intersecting geometry", async () => {
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
  await flush();

  expect(fetchData).toHaveBeenCalledTimes(6);
  expect(fetchData).toHaveBeenCalledWith(expect.stringContaining("minRangeNm=0&maxRangeNm=40"));
  expect(updates.updateAirways).toHaveBeenCalledWith([
    { id: "crossing", points: expect.any(Array) },
  ]);
});

test("coalesces frequent pan updates and ignores identical viewport requests", async () => {
  jest.useFakeTimers();
  const fetchData = jest.fn().mockResolvedValue(response());
  const loader = createRadarReferenceLoader(fetchData, scene(), location);
  loader.load(bounds);
  loader.load({ ...bounds, maxX: 25, maxRangeNm: 45 });
  loader.load({ ...bounds, maxX: 25, maxRangeNm: 45 });
  await flush();

  expect(fetchData).toHaveBeenCalledTimes(12);
  expect(fetchData).toHaveBeenCalledWith(expect.stringContaining("maxRangeNm=45"));
});

test("retains the 300 nautical mile maximum and supports non-2D scenes", async () => {
  jest.useFakeTimers();
  const fetchData = jest.fn().mockResolvedValue(response());
  const loader = createRadarReferenceLoader(fetchData, scene(), location);
  loader.load(500);
  await flush();
  expect(fetchData).toHaveBeenCalledWith(expect.stringContaining("minRangeNm=0&maxRangeNm=300"));
});

test("leaves the current references intact when an API layer fails", async () => {
  const updates = scene();
  const fetchData = jest.fn().mockResolvedValue({ ok: false });
  const loader = createRadarReferenceLoader(fetchData, updates, location);
  await loader.load(bounds);
  expect(fetchData).toHaveBeenCalledTimes(6);
  Object.values(updates).forEach((update) => expect(update).not.toHaveBeenCalled());
});

test("clears old geometry when the viewport moves beyond the 300 nautical mile limit", () => {
  const updates = scene();
  const fetchData = jest.fn();
  const loader = createRadarReferenceLoader(fetchData, updates, location);
  loader.load({ ...bounds, minRangeNm: 320, maxRangeNm: 300 });
  expect(fetchData).not.toHaveBeenCalled();
  Object.values(updates).forEach((update) => expect(update).toHaveBeenCalledWith([]));
});
