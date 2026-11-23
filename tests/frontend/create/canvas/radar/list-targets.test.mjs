import { expect, test } from "@jest/globals";
import { default as listCanvasRadarTargets } from "../../../../../src/frontend/create/canvas/radar/list-targets.mjs";

test("returns aircraft targets with their received timestamps", () => {
  const items = new Map([["ABC123", { icao: "ABC123" }]]);
  const targets = { items: () => items };
  const receiveTimes = { withReceivedAt: (value) => new Map([...value, ["received", true]]) };
  expect(listCanvasRadarTargets(targets, receiveTimes).get("received")).toBe(true);
});
