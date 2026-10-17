import { expect, jest, test } from "@jest/globals";
import { createRadarReferenceLoader } from "../../src/frontend/radar-reference-loader.mjs";

function response(rows = []) {
  return { ok: true, json: async () => rows };
}

test("loads reference data through the maximum radar range on first request", async () => {
  const fetchData = jest.fn().mockResolvedValue(response());
  const scene = {
    updateAirports: jest.fn(),
    updateNavaids: jest.fn(),
    updateBoundaries: jest.fn(),
    updateIls: jest.fn(),
    updateProcedures: jest.fn(),
    updateAirways: jest.fn(),
  };
  const loader = createRadarReferenceLoader(fetchData, scene);
  await loader.load(20);
  await loader.load(30);
  expect(fetchData.mock.calls.map(([url]) => url)).toEqual([
    "/api/airports?minRangeNm=0&maxRangeNm=300",
    "/api/navaids?minRangeNm=0&maxRangeNm=300",
    "/api/airspace-boundaries?minRangeNm=0&maxRangeNm=300",
    "/api/ils?minRangeNm=0&maxRangeNm=300",
    "/api/procedures?minRangeNm=0&maxRangeNm=300",
    "/api/airways?minRangeNm=0&maxRangeNm=300",
  ]);
  expect(scene.updateBoundaries).toHaveBeenCalledTimes(1);
  expect(loader.loadedThrough()).toBe(300);
});

test("ignores invalid ranges and caps requested data at the radar limit", async () => {
  const fetchData = jest.fn().mockResolvedValue(response());
  const scene = {
    updateAirports: jest.fn(),
    updateNavaids: jest.fn(),
    updateBoundaries: jest.fn(),
    updateIls: jest.fn(),
    updateProcedures: jest.fn(),
    updateAirways: jest.fn(),
  };
  const loader = createRadarReferenceLoader(fetchData, scene);

  await loader.load(Number.NaN);
  await loader.load(Number.POSITIVE_INFINITY);
  expect(fetchData).not.toHaveBeenCalled();
  await loader.load(500);
  await loader.load(400);

  expect(loader.loadedThrough()).toBe(300);
  expect(fetchData).toHaveBeenCalledTimes(6);
  expect(fetchData).toHaveBeenCalledWith(expect.stringContaining("maxRangeNm=300"));
});

test("retries loading the maximum range after a failed API response", async () => {
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
    updateAirways: jest.fn(),
  };
  const loader = createRadarReferenceLoader(fetchData, scene);

  await loader.load(10);
  expect(loader.loadedThrough()).toBe(0);
  await loader.load(10);

  expect(loader.loadedThrough()).toBe(300);
  expect(scene.updateAirports).toHaveBeenCalledWith(["loaded"]);
});

test("coalesces zoom changes while the maximum range is loading", async () => {
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
    updateAirways: jest.fn(),
  };
  const loader = createRadarReferenceLoader(fetchData, scene);
  const first = loader.load(10);
  const second = loader.load(20);
  expect(first).toBe(second);

  while (pending.length) pending.shift()();
  await first;

  expect(fetchData).toHaveBeenCalledTimes(6);
  expect(loader.loadedThrough()).toBe(300);
});

test("retries the fixed maximum range after an in-flight request fails", async () => {
  let failFirst;
  let shouldFail = true;
  const requests = [];
  const fetchData = jest.fn((url) => {
    requests.push(url);
    if (shouldFail && url.includes("/api/airports?") && url.endsWith("maxRangeNm=300")) {
      shouldFail = false;
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
    updateAirways: jest.fn(),
  };
  const loader = createRadarReferenceLoader(fetchData, scene);
  const pending = loader.load(10);
  loader.load(20);
  failFirst();
  await pending;
  expect(loader.loadedThrough()).toBe(0);
  await loader.load(20);
  expect(
    requests.filter((url) => url === "/api/airports?minRangeNm=0&maxRangeNm=300"),
  ).toHaveLength(2);
  expect(loader.loadedThrough()).toBe(300);
});
