import { expect, jest, test } from "@jest/globals";
import { handleDashboardFeedUpdate } from "../../src/frontend/handle-dashboard-feed-update.mjs";

test("replaces scene and strip aircraft from a snapshot", () => {
  const scene = { updateSnapshot: jest.fn() };
  const strips = { updateSnapshot: jest.fn() };
  const aircraft = [{ icao: "ABC123" }];
  handleDashboardFeedUpdate(
    scene,
    strips,
    JSON.stringify({
      event: "aircraft-snapshot",
      aircraft,
      localFurthestDistanceNm: 12,
    }),
  );
  expect(scene.updateSnapshot).toHaveBeenCalledWith(aircraft, 12);
  expect(strips.updateSnapshot).toHaveBeenCalledWith(aircraft);
});

test("ignores invalid JSON feed messages", () => {
  const scene = { update: jest.fn() };
  const strips = { update: jest.fn() };
  handleDashboardFeedUpdate(scene, strips, "not-json");
  expect(scene.update).not.toHaveBeenCalled();
  expect(strips.update).not.toHaveBeenCalled();
});

test("ignores obsolete non-snapshot feed messages", () => {
  const scene = { updateSnapshot: jest.fn() };
  const strips = { updateSnapshot: jest.fn() };
  handleDashboardFeedUpdate(scene, strips, JSON.stringify({ icao: "ABC123" }));
  expect(scene.updateSnapshot).not.toHaveBeenCalled();
});
