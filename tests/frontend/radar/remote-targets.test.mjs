import { expect, test } from "@jest/globals";
import { removeRadarRemoteTargetsExcept } from "../../../src/frontend/radar/remote-targets.mjs";

test("removes remote targets absent from the current snapshot and preserves local targets", () => {
  const targets = new Map([
    ["REMOTE_KEEP", { item: { remoteOnly: true } }],
    ["REMOTE_DROP", { item: { remoteOnly: true } }],
    ["LOCAL", { item: { remoteOnly: false } }],
  ]);
  expect(removeRadarRemoteTargetsExcept(targets, ["REMOTE_KEEP"])).toEqual(["REMOTE_DROP"]);
  expect([...targets.keys()]).toEqual(["REMOTE_KEEP", "LOCAL"]);
});
