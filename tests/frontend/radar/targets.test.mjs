import { expect, test } from "@jest/globals";
import { createRadarTargets } from "../../../src/frontend/radar/targets.mjs";

test("tracks target distances and drops targets after two minutes without updates", () => {
  let now = 1000;
  const targets = createRadarTargets({ clock: () => now, staleAfterMs: 120_000 });
  expect(targets.update({ icao: "A" }, 12)).toEqual([]);
  expect(targets.items()).toEqual(new Map([["A", { icao: "A", receivedAt: 1000 }]]));
  expect(targets.update({ icao: "B" }, 25)).toEqual([]);
  expect(targets.distances()).toEqual([12, 25]);
  now += 120_001;
  expect(targets.update({ icao: "C" }, 5)).toEqual(["A", "B"]);
  expect(targets.distances()).toEqual([5]);
});

test("keeps a target that updates within its live period", () => {
  let now = 1000;
  const targets = createRadarTargets({ clock: () => now, staleAfterMs: 100 });
  targets.update({ icao: "A" }, 12);
  now += 50;
  expect(targets.update({ icao: "A" }, 14)).toEqual([]);
  expect(targets.distances()).toEqual([14]);
});

test("starts with no tracked targets", () => {
  expect(createRadarTargets().distances()).toEqual([]);
});

test("uses the source observation time and removes missing remote-only tracks", () => {
  const targets = createRadarTargets({ clock: () => 10_000, staleAfterMs: 120_000 });
  targets.update({ icao: "REMOTE", remoteOnly: true, lastSeen: 8000 }, 10);
  targets.update({ icao: "LOCAL", remoteOnly: false }, 2);
  expect(targets.items().get("REMOTE").receivedAt).toBe(8000);
  expect(targets.distances()).toEqual([10, 2]);
  expect(targets.localDistances()).toEqual([2]);
  expect(targets.removeRemoteOnlyExcept([])).toEqual(["REMOTE"]);
  expect([...targets.items().keys()]).toEqual(["LOCAL"]);
});
