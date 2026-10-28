import { expect, jest, test } from "@jest/globals";
import { fetchMetarReports } from "../../../src/backend/metar/fetch.mjs";

test("fetches configured stations and filters unrelated or invalid reports", async () => {
  const reports = [
    { id: "KLEW", metar: "METAR ONE" },
    { id: "KPWM", metar: "METAR TWO" },
    { id: "KXXX", metar: "OTHER" },
    { id: "KBXM", metar: null },
  ];
  const fetchData = jest.fn(async () => ({ ok: true, json: async () => reports }));
  expect(await fetchMetarReports(["KLEW", "KPWM", "KBXM"], fetchData)).toEqual(reports.slice(0, 2));
  expect(fetchData).toHaveBeenCalledWith("https://metar.vatsim.net/KLEW,KPWM,KBXM?format=json");
});

test("rejects failed HTTP responses and invalid response data", async () => {
  await expect(
    fetchMetarReports(["KLEW"], async () => ({ ok: false, status: 503 })),
  ).rejects.toThrow("request failed: 503");
  await expect(
    fetchMetarReports(["KLEW"], async () => ({ ok: true, json: async () => ({}) })),
  ).rejects.toThrow("response must be an array");
});

test("uses the global fetch function by default", async () => {
  const originalFetch = globalThis.fetch;
  const fetchMock = jest.fn(async () => ({ ok: true, json: async () => [] }));
  globalThis.fetch = fetchMock;
  try {
    await fetchMetarReports(["KPWM"]);
    expect(fetchMock).toHaveBeenCalledWith("https://metar.vatsim.net/KPWM?format=json");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
