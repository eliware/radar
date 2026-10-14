import { expect, jest, test } from "@jest/globals";
import { handleDashboardFeedUpdate } from "../../src/frontend/handle-dashboard-feed-update.mjs";

test("updates the scene and strips from one aircraft message", () => {
  const scene = { update: jest.fn() };
  const strips = { update: jest.fn() };
  const aircraft = { icao: "ABC123" };
  handleDashboardFeedUpdate(scene, strips, JSON.stringify(aircraft));
  expect(scene.update).toHaveBeenCalledWith(aircraft);
  expect(strips.update).toHaveBeenCalledWith(aircraft);
});

test("ignores invalid JSON feed messages", () => {
  const scene = { update: jest.fn() };
  const strips = { update: jest.fn() };
  handleDashboardFeedUpdate(scene, strips, "not-json");
  expect(scene.update).not.toHaveBeenCalled();
  expect(strips.update).not.toHaveBeenCalled();
});
