import { expect, jest, test } from "@jest/globals";
import { loadDashboardConfig } from "../../src/frontend/load-dashboard-config.mjs";

test("loads settings and bundled map outlines", async () => {
  const config = { location: { latitude: 43, longitude: -70 }, elevationFeet: 300 };
  const outlines = { coastline: [], lakes: [] };
  const fetchData = jest
    .fn()
    .mockResolvedValueOnce({ ok: true, json: async () => config })
    .mockResolvedValueOnce({ ok: true, json: async () => outlines });
  await expect(loadDashboardConfig(fetchData)).resolves.toEqual({ config, mapOutlines: outlines });
  expect(fetchData).toHaveBeenNthCalledWith(1, "/api/config");
  expect(fetchData).toHaveBeenNthCalledWith(2, "/api/map-outlines");
});

test("keeps map outline errors optional", async () => {
  const config = { location: null, elevationFeet: 300 };
  const fetchData = jest
    .fn()
    .mockResolvedValueOnce({ ok: true, json: async () => config })
    .mockRejectedValueOnce(new Error("Unavailable"));
  await expect(loadDashboardConfig(fetchData)).resolves.toEqual({ config, mapOutlines: null });
});

test("rejects when required configuration fails", async () => {
  const fetchData = jest.fn().mockResolvedValue({ ok: false });
  await expect(loadDashboardConfig(fetchData)).rejects.toThrow("Request failed: /api/config");
});
