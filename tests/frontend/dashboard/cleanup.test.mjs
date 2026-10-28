import { expect, jest, test } from "@jest/globals";
import { cleanupDashboardSetup } from "../../../src/frontend/dashboard/cleanup.mjs";

test("cleans resources allocated before dashboard setup failed", () => {
  const scene = { destroy: jest.fn() };
  const feed = { close: jest.fn() };
  const metarRefresh = { destroy: jest.fn() };
  const detachReferences = jest.fn();
  const resources = { scene, feed, metarRefresh, detachReferences };
  cleanupDashboardSetup(resources);
  expect(scene.destroy).toHaveBeenCalledTimes(1);
  expect(feed.close).toHaveBeenCalledTimes(1);
  expect(metarRefresh.destroy).toHaveBeenCalledTimes(1);
  expect(detachReferences).toHaveBeenCalledTimes(1);
});
