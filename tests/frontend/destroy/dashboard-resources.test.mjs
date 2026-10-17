import { expect, jest, test } from "@jest/globals";
import { destroyDashboardResources } from "../../../src/frontend/destroy/dashboard-resources.mjs";

test("destroys resources that exist after partial dashboard setup", () => {
  const resources = {
    windowRef: { clearInterval: jest.fn() },
    metarRefresh: { destroy: jest.fn() },
    detachCompass: jest.fn(),
    detachReset: jest.fn(),
    detachArrowControls: jest.fn(),
    detachReferences: jest.fn(),
    feed: { close: jest.fn() },
    flightStrips: { destroy: jest.fn() },
    scene: { destroy: jest.fn() },
  };
  destroyDashboardResources(resources);
  expect(resources.detachCompass).toHaveBeenCalled();
  expect(resources.detachReset).toHaveBeenCalled();
  expect(resources.detachArrowControls).toHaveBeenCalled();
  expect(resources.detachReferences).toHaveBeenCalled();
  expect(resources.metarRefresh.destroy).toHaveBeenCalled();
  expect(resources.feed.close).toHaveBeenCalled();
  expect(resources.flightStrips.destroy).toHaveBeenCalled();
  expect(resources.scene.destroy).toHaveBeenCalled();
});
