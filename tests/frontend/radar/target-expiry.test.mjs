import { expect, test } from "@jest/globals";
import { pruneExpiredRadarTargets } from "../../../src/frontend/radar/target-expiry.mjs";

test("removes only targets older than their stale interval", () => {
  const targets = new Map([
    ["EXPIRED", { lastSeen: 10 }],
    ["CURRENT", { lastSeen: 20 }],
  ]);
  expect(pruneExpiredRadarTargets(targets, 120, 100)).toEqual(["EXPIRED"]);
  expect([...targets.keys()]).toEqual(["CURRENT"]);
});
