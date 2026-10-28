import { expect, jest, test } from "@jest/globals";
import { createLookupCache } from "../../src/backend/lookup-cache.mjs";

const ttls = { successTtlMs: 10, missingTtlMs: 3, failureTtlMs: 2 };

test("deduplicates active lookups and reuses successful values", async () => {
  let finish;
  const load = jest.fn(() => new Promise((resolve) => (finish = resolve)));
  const cache = createLookupCache();
  const first = cache.lookup("A", load, ttls);
  const second = cache.lookup("A", load, ttls);
  expect(second).toBe(first);
  await Promise.resolve();
  finish({ value: 1 });
  await expect(first).resolves.toEqual({ value: 1 });
  await expect(cache.lookup("A", load, ttls)).resolves.toEqual({ value: 1 });
  expect(load).toHaveBeenCalledTimes(1);
});

test("expires successful values and retries the load", async () => {
  let now = 0;
  const load = jest.fn().mockResolvedValueOnce("old").mockResolvedValueOnce("new");
  const cache = createLookupCache({ clock: () => now });
  await expect(cache.lookup("A", load, ttls)).resolves.toBe("old");
  now = 10;
  await expect(cache.lookup("A", load, ttls)).resolves.toBe("new");
  expect(load).toHaveBeenCalledTimes(2);
});

test("uses the missing TTL for null results", async () => {
  let now = 0;
  const load = jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce("found");
  const cache = createLookupCache({ clock: () => now });
  await expect(cache.lookup("A", load, ttls)).resolves.toBeNull();
  now = 2;
  await expect(cache.lookup("A", load, ttls)).resolves.toBeNull();
  now = 3;
  await expect(cache.lookup("A", load, ttls)).resolves.toBe("found");
  expect(load).toHaveBeenCalledTimes(2);
});

test("caches failures briefly and retries after expiry", async () => {
  let now = 0;
  const load = jest.fn().mockRejectedValueOnce(new Error("offline")).mockResolvedValue("ok");
  const cache = createLookupCache({ clock: () => now });
  await expect(cache.lookup("A", load, ttls)).resolves.toBeNull();
  now = 1;
  await expect(cache.lookup("A", load, ttls)).resolves.toBeNull();
  now = 2;
  await expect(cache.lookup("A", load, ttls)).resolves.toBe("ok");
  expect(load).toHaveBeenCalledTimes(2);
});
