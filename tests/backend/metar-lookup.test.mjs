import { expect, jest, test } from "@jest/globals";
import { createMetarLookup, parseMetarStations } from "../../src/backend/metar-lookup.mjs";

test("parses unique four-character station codes", () => {
  expect(parseMetarStations(" klew, KPWM,klew, bad, KBXM ")).toEqual(["KLEW", "KPWM", "KBXM"]);
});

test("ignores empty and invalid station codes", () => {
  expect(parseMetarStations()).toEqual(["KLEW", "KPWM", "KBXM"]);
  expect(parseMetarStations("")).toEqual([]);
  expect(parseMetarStations(",abcde, K-, ,")).toEqual([]);
});

test("returns no reports and makes no request when no stations are set", async () => {
  const fetchData = jest.fn();
  const lookup = createMetarLookup([], { fetchData });
  expect(lookup.stations).toEqual([]);
  expect(await lookup.get()).toEqual([]);
  expect(fetchData).not.toHaveBeenCalled();
});

test("uses the default request functions when no options are given", () => {
  expect(createMetarLookup(["KPWM"]).stations).toEqual(["KPWM"]);
});

test("fetches configured reports and caches them until expiry", async () => {
  let time = 100;
  const reports = [
    { id: "KLEW", metar: "METAR ONE" },
    { id: "KPWM", metar: "METAR TWO" },
    { id: "KXXX", metar: "OTHER" },
    { id: "KBXM", metar: null },
  ];
  const fetchData = jest.fn(async () => ({ ok: true, json: async () => reports }));
  const lookup = createMetarLookup(["KLEW", "KPWM", "KBXM"], {
    fetchData,
    now: () => time,
  });
  expect(await lookup.get()).toEqual(reports.slice(0, 2));
  expect(await lookup.get()).toEqual(reports.slice(0, 2));
  expect(fetchData).toHaveBeenCalledTimes(1);
  expect(fetchData).toHaveBeenCalledWith("https://metar.vatsim.net/KLEW,KPWM,KBXM?format=json");
  time += 300000;
  await lookup.get();
  expect(fetchData).toHaveBeenCalledTimes(2);
});

test("rejects failed HTTP responses and invalid response data", async () => {
  const failed = createMetarLookup(["KLEW"], {
    fetchData: async () => ({ ok: false, status: 503 }),
  });
  await expect(failed.get()).rejects.toThrow("request failed: 503");
  const invalid = createMetarLookup(["KLEW"], {
    fetchData: async () => ({ ok: true, json: async () => ({}) }),
  });
  await expect(invalid.get()).rejects.toThrow("response must be an array");
});
