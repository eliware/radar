import { expect, test } from "@jest/globals";
import { createMetarCache, METAR_CACHE_MS } from "../../../src/backend/metar/cache.mjs";

test("returns cached values until their lifetime expires", () => {
  let time = 100;
  const cache = createMetarCache({ now: () => time, lifetimeMs: 50 });
  const reports = [{ id: "KPWM", metar: "METAR" }];

  expect(cache.get()).toBeUndefined();
  cache.set(reports);
  expect(cache.get()).toBe(reports);
  time = 150;
  expect(cache.get()).toBeUndefined();
});

test("uses the five-minute default lifetime", () => {
  let time = 0;
  const cache = createMetarCache({ now: () => time });
  cache.set([]);
  time = METAR_CACHE_MS - 1;
  expect(cache.get()).toEqual([]);
  time = METAR_CACHE_MS;
  expect(cache.get()).toBeUndefined();
});

test("supports the default clock and lifetime options", () => {
  const cache = createMetarCache();
  cache.set("fresh");
  expect(cache.get()).toBe("fresh");
});
