import { expect, test } from "@jest/globals";
import { reconcileAircraftSource } from "../../../../../src/backend/aircraft/merged/aircraft/reconcile.mjs";

test("replaces one source while retaining other sources and pruning stale entries", () => {
  const entries = new Map([
    ["ABC123", { local: { icao: "ABC123" }, remote: { icao: "ABC123" } }],
    ["REMOTE1", { remote: { icao: "REMOTE1" } }],
  ]);
  const setSourceItem = (source, item) => {
    const icao = item.icao.trim().toUpperCase();
    const entry = entries.get(icao) ?? {};
    entry[source] = item;
    entries.set(icao, entry);
    return icao;
  };
  reconcileAircraftSource(
    entries,
    "remote",
    [{ icao: " abc123 " }, { icao: "new123" }],
    setSourceItem,
  );
  expect(entries.get("ABC123")).toEqual({
    local: { icao: "ABC123" },
    remote: { icao: " abc123 " },
  });
  expect(entries.has("REMOTE1")).toBe(false);
  expect(entries.has("NEW123")).toBe(true);
});

test("removes all stale entries when a source is replaced with an empty list", () => {
  const entries = new Map([["ABC123", { remote: { icao: "ABC123" } }]]);
  reconcileAircraftSource(entries, "remote", [], () => undefined);
  expect(entries.size).toBe(0);
});
