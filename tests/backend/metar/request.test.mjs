import { expect, jest, test } from "@jest/globals";
import { createMetarRequest } from "../../../src/backend/metar/request.mjs";

test("fetches configured reports and caches filtered reports until expiry", async () => {
  let time = 100;
  const reports = [
    { id: "KLEW", metar: "METAR ONE" },
    { id: "KPWM", metar: "METAR TWO" },
    { id: "KXXX", metar: "OTHER" },
    { id: "KBXM", metar: null },
  ];
  const fetchData = jest.fn(async () => ({ ok: true, json: async () => reports }));
  const request = createMetarRequest(["KLEW", "KPWM", "KBXM"], {
    fetchData,
    now: () => time,
  });

  expect(await request()).toEqual(reports.slice(0, 2));
  expect(await request()).toEqual(reports.slice(0, 2));
  expect(fetchData).toHaveBeenCalledTimes(1);
  expect(fetchData).toHaveBeenCalledWith("https://metar.vatsim.net/KLEW,KPWM,KBXM?format=json");
  time += 300000;
  await request();
  expect(fetchData).toHaveBeenCalledTimes(2);
});

test("rejects failed HTTP responses and invalid response data", async () => {
  const failed = createMetarRequest(["KLEW"], {
    fetchData: async () => ({ ok: false, status: 503 }),
  });
  await expect(failed()).rejects.toThrow("request failed: 503");
  const invalid = createMetarRequest(["KLEW"], {
    fetchData: async () => ({ ok: true, json: async () => ({}) }),
  });
  await expect(invalid()).rejects.toThrow("response must be an array");
});

test("uses the global fetch function by default", async () => {
  const originalFetch = globalThis.fetch;
  const fetchMock = jest.fn(async () => ({ ok: true, json: async () => [] }));
  globalThis.fetch = fetchMock;
  try {
    await createMetarRequest(["KPWM"])();
    expect(fetchMock).toHaveBeenCalledWith("https://metar.vatsim.net/KPWM?format=json");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
