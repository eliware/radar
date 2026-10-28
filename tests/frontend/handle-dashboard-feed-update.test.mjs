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

test("does not dispatch when the feed parser rejects a message", () => {
  const scene = { updateSnapshot: jest.fn() };
  const strips = { updateSnapshot: jest.fn() };
  handleDashboardFeedUpdate(scene, strips, "{}");
  expect(scene.updateSnapshot).not.toHaveBeenCalled();
  expect(strips.updateSnapshot).not.toHaveBeenCalled();
});
