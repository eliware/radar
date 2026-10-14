import { expect, jest, test } from "@jest/globals";
import { attachDashboardPagehide } from "../../src/frontend/attach-dashboard-pagehide.mjs";

test("runs cleanup once on page hide or an explicit close", () => {
  const handlers = new Map();
  const windowRef = {
    addEventListener: jest.fn((name, handler) => handlers.set(name, handler)),
    removeEventListener: jest.fn((name) => handlers.delete(name)),
  };
  const cleanup = jest.fn();
  const close = attachDashboardPagehide(windowRef, cleanup);

  expect(windowRef.addEventListener).toHaveBeenCalledWith("pagehide", expect.any(Function), {
    once: true,
  });
  handlers.get("pagehide")?.();
  close();

  expect(cleanup).toHaveBeenCalledTimes(1);
  expect(windowRef.removeEventListener).toHaveBeenCalledWith("pagehide", expect.any(Function));
});

test("closes without a window reference", () => {
  const cleanup = jest.fn();
  attachDashboardPagehide(null, cleanup)();
  expect(cleanup).toHaveBeenCalledTimes(1);
});
