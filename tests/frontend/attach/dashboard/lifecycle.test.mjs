import { expect, jest, test } from "@jest/globals";
import { attachDashboardLifecycle } from "../../../../src/frontend/attach/dashboard/lifecycle.mjs";

test("closes dashboard resources on pagehide and explicit destroy", () => {
  const listeners = new Map();
  const windowRef = {
    addEventListener: jest.fn((name, callback) => listeners.set(name, callback)),
    removeEventListener: jest.fn((name) => listeners.delete(name)),
  };
  const scene = { destroy: jest.fn() };
  const destroy = attachDashboardLifecycle(windowRef, { scene });

  expect(windowRef.addEventListener).toHaveBeenCalledWith("pagehide", expect.any(Function), {
    once: true,
  });
  listeners.get("pagehide")();
  destroy();

  expect(windowRef.removeEventListener).toHaveBeenCalledTimes(1);
  expect(scene.destroy).toHaveBeenCalledTimes(1);
});

test("supports lifecycle attachment without a browser window", () => {
  const scene = { destroy: jest.fn() };
  const destroy = attachDashboardLifecycle(undefined, { scene });
  destroy();
  expect(scene.destroy).toHaveBeenCalledTimes(1);
});
