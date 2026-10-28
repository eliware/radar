import { expect, jest, test } from "@jest/globals";
import { createMetarRequest } from "../../../src/backend/metar/request.mjs";

test("caches fetched reports until expiry", async () => {
  let time = 100;
  const reports = [{ id: "KLEW", metar: "METAR ONE" }];
  const fetchData = jest.fn(async () => ({ ok: true, json: async () => reports }));
  const request = createMetarRequest(["KLEW", "KPWM", "KBXM"], {
    fetchData,
    now: () => time,
  });

  expect(await request()).toEqual(reports);
  expect(await request()).toEqual(reports);
  expect(fetchData).toHaveBeenCalledTimes(1);
  time += 300000;
  await request();
  expect(fetchData).toHaveBeenCalledTimes(2);
});

test("uses the global fetch function when no fetch dependency is provided", async () => {
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
