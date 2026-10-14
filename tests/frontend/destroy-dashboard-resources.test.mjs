import { expect, jest, test } from "@jest/globals";
import { destroyDashboardResources } from "../../src/frontend/destroy-dashboard-resources.mjs";

test("destroys resources that exist after partial dashboard setup", () => {
  const resources = {
    windowRef: { clearInterval: jest.fn() },
    metarTimer: 17,
    detachCompass: jest.fn(),
    detachReferences: jest.fn(),
    reset: { removeEventListener: jest.fn() },
    resetView: jest.fn(),
    feed: { close: jest.fn() },
    flightStrips: { destroy: jest.fn() },
    scene: { destroy: jest.fn() },
  };
  destroyDashboardResources(resources);
  expect(resources.detachCompass).toHaveBeenCalled();
  expect(resources.detachReferences).toHaveBeenCalled();
  expect(resources.reset.removeEventListener).toHaveBeenCalledWith("click", resources.resetView);
  expect(resources.windowRef.clearInterval).toHaveBeenCalledWith(17);
  expect(resources.feed.close).toHaveBeenCalled();
  expect(resources.flightStrips.destroy).toHaveBeenCalled();
  expect(resources.scene.destroy).toHaveBeenCalled();
});
