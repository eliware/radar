import { expect, test } from "@jest/globals";
import { createLookupCacheEntries } from "../../../src/backend/lookup-cache/entries.mjs";

test("stores and removes cache entries", () => {
  const entries = createLookupCacheEntries(2);
  entries.set("A", { value: "one" });
  expect(entries.get("A")).toEqual({ value: "one" });
  expect(entries.delete("A")).toBe(true);
  expect(entries.get("A")).toBeUndefined();
});

test("evicts the oldest entry when the cache exceeds its size limit", () => {
  const entries = createLookupCacheEntries(2);
  entries.set("A", { value: "one" });
  entries.set("B", { value: "two" });
  entries.set("C", { value: "three" });
  expect(entries.get("A")).toBeUndefined();
  expect(entries.get("B")).toEqual({ value: "two" });
  expect(entries.get("C")).toEqual({ value: "three" });
});
