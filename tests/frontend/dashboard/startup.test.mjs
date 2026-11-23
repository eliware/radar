import { expect, jest, test } from "@jest/globals";
import { default as runDashboardStartup } from "../../../src/frontend/dashboard/startup.mjs";

test("returns the completed dashboard startup result", async () => {
  const result = { scene: {} };
  await expect(runDashboardStartup({}, async () => result)).resolves.toBe(result);
});

test("cleans up partial resources when startup fails", async () => {
  const resources = {
    scene: { destroy: jest.fn() },
    feed: { close: jest.fn() },
  };
  await expect(
    runDashboardStartup(resources, async () => {
      throw new Error("startup failed");
    }),
  ).resolves.toBe(null);
  expect(resources.feed.close).toHaveBeenCalledTimes(1);
  expect(resources.scene.destroy).toHaveBeenCalledTimes(1);
});
