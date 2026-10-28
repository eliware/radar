import { expect, test } from "@jest/globals";
import { listCanvasRadarTargets } from "../../../../../src/frontend/create/canvas/radar/list-targets.mjs";

test("returns aircraft targets with their received timestamps", () => {
  const items = new Map([["ABC123", { icao: "ABC123" }]]);
  const targets = { items: () => items };
  const trails = { withReceivedAt: (value) => new Map([...value, ["received", true]]) };
  expect(listCanvasRadarTargets(targets, trails).get("received")).toBe(true);
});
