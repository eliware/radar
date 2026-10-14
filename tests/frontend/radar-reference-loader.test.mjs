import { expect, jest, test } from "@jest/globals";
import { createRadarReferenceLoader } from "../../src/frontend/radar-reference-loader.mjs";

function response(rows = []) {
  return { ok: true, json: async () => rows };
}

test("requests all reference data by new range band only", async () => {
  const fetchData = jest.fn().mockResolvedValue(response());
  const scene = {
    updateAirports: jest.fn(),
    updateNavaids: jest.fn(),
    updateBoundaries: jest.fn(),
    updateIls: jest.fn(),
    updateProcedures: jest.fn(),
  };
  const loader = createRadarReferenceLoader(fetchData, scene);
  await loader.load(20);
  await loader.load(30);
  expect(fetchData.mock.calls.map(([url]) => url)).toEqual([
    "/api/airports?minRangeNm=0&maxRangeNm=20",
    "/api/navaids?minRangeNm=0&maxRangeNm=20",
    "/api/airspace-boundaries?minRangeNm=0&maxRangeNm=20",
    "/api/ils?minRangeNm=0&maxRangeNm=20",
    "/api/procedures?minRangeNm=0&maxRangeNm=20",
    "/api/airports?minRangeNm=20&maxRangeNm=30",
    "/api/navaids?minRangeNm=20&maxRangeNm=30",
    "/api/airspace-boundaries?minRangeNm=20&maxRangeNm=30",
    "/api/ils?minRangeNm=20&maxRangeNm=30",
    "/api/procedures?minRangeNm=20&maxRangeNm=30",
  ]);
  expect(scene.updateBoundaries).toHaveBeenCalledTimes(2);
  expect(loader.loadedThrough()).toBe(30);
});

test("ignores invalid ranges and caps requested data at the radar limit", async () => {
  const fetchData = jest.fn().mockResolvedValue(response());
  const scene = {
    updateAirports: jest.fn(),
    updateNavaids: jest.fn(),
    updateBoundaries: jest.fn(),
    updateIls: jest.fn(),
    updateProcedures: jest.fn(),
  };
  const loader = createRadarReferenceLoader(fetchData, scene);

  await loader.load(Number.NaN);
  await loader.load(Number.POSITIVE_INFINITY);
  expect(fetchData).not.toHaveBeenCalled();
  await loader.load(500);
  await loader.load(400);

  expect(loader.loadedThrough()).toBe(300);
  expect(fetchData).toHaveBeenCalledTimes(5);
  expect(fetchData).toHaveBeenCalledWith(expect.stringContaining("maxRangeNm=300"));
});

test("resets the requested range after a failed API response so callers can retry", async () => {
  const fetchData = jest
    .fn()
    .mockResolvedValueOnce({ ok: false })
    .mockResolvedValue(response(["loaded"]));
  const scene = {
    updateAirports: jest.fn(),
    updateNavaids: jest.fn(),
    updateBoundaries: jest.fn(),
    updateIls: jest.fn(),
    updateProcedures: jest.fn(),
  };
  const loader = createRadarReferenceLoader(fetchData, scene);

  await loader.load(10);
  expect(loader.loadedThrough()).toBe(0);
  await loader.load(10);

  expect(loader.loadedThrough()).toBe(10);
  expect(scene.updateAirports).toHaveBeenCalledWith(["loaded"]);
});

test("extends the requested band while the previous band is still loading", async () => {
  const pending = [];
  const fetchData = jest.fn(
    () => new Promise((resolve) => pending.push(() => resolve(response()))),
  );
  const scene = {
    updateAirports: jest.fn(),
    updateNavaids: jest.fn(),
    updateBoundaries: jest.fn(),
    updateIls: jest.fn(),
    updateProcedures: jest.fn(),
  };
  const loader = createRadarReferenceLoader(fetchData, scene);
  const first = loader.load(10);
  const second = loader.load(20);
  expect(first).toBe(second);

  while (pending.length || loader.loadedThrough() < 20) {
    while (pending.length) pending.shift()();
    await Promise.resolve();
  }
  await first;

  expect(fetchData).toHaveBeenCalledTimes(10);
  expect(loader.loadedThrough()).toBe(20);
});

test("keeps a newer range request when the in-flight band fails", async () => {
  let failFirst;
  const requests = [];
  const fetchData = jest.fn((url) => {
    requests.push(url);
    if (url.includes("/api/airports?") && url.endsWith("maxRangeNm=10")) {
      return new Promise((resolve) => (failFirst = () => resolve({ ok: false })));
    }
    return Promise.resolve(response());
  });
  const scene = {
    updateAirports: jest.fn(),
    updateNavaids: jest.fn(),
    updateBoundaries: jest.fn(),
    updateIls: jest.fn(),
    updateProcedures: jest.fn(),
  };
  const loader = createRadarReferenceLoader(fetchData, scene);
  const pending = loader.load(10);
  loader.load(20);
  failFirst();
  await pending;
  expect(requests).toContain("/api/airports?minRangeNm=0&maxRangeNm=20");
  expect(loader.loadedThrough()).toBe(20);
});
