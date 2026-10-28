import { expect, jest, test } from "@jest/globals";
import { fetchRadarReferenceLayers } from "../../../../src/frontend/radar/reference/layer-requests.mjs";

test("fetches each reference layer for the requested range", async () => {
  const fetchData = jest.fn(async (url) => ({
    ok: true,
    json: async () => url,
  }));

  const result = await fetchRadarReferenceLayers(fetchData, 25, 50);

  expect(fetchData.mock.calls.map(([url]) => url)).toEqual([
    "/api/airports?minRangeNm=25&maxRangeNm=50",
    "/api/navaids?minRangeNm=25&maxRangeNm=50",
    "/api/airspace-boundaries?minRangeNm=25&maxRangeNm=50",
    "/api/ils?minRangeNm=25&maxRangeNm=50",
    "/api/procedures?minRangeNm=25&maxRangeNm=50",
    "/api/airways?minRangeNm=25&maxRangeNm=50",
  ]);
  expect(result).toEqual(fetchData.mock.calls.map(([url]) => url));
});

test("rejects when a reference layer request fails", async () => {
  const fetchData = jest.fn(async (url) => ({
    ok: !url.includes("/api/ils?"),
    json: async () => [],
  }));

  await expect(fetchRadarReferenceLayers(fetchData, 0, 25)).rejects.toThrow("ils request failed.");
});
