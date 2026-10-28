import { expect, jest, test } from "@jest/globals";
import { registerApplicationShutdown } from "../../../src/backend/lifecycle/shutdown.mjs";

test("registers an idempotent shutdown that closes resources before the app", async () => {
  const order = [];
  const resources = [
    { close: jest.fn(() => order.push("merged")) },
    { close: jest.fn(() => order.push("feed")) },
    undefined,
  ];
  const app = { close: jest.fn(async () => order.push("app")) };
  const log = { info: jest.fn() };
  let registered;
  const shutdown = registerApplicationShutdown({
    app,
    resources,
    log,
    registerSignals: jest.fn((handlers) => (registered = handlers)),
  });

  expect(registered.shutdownHook).toBe(shutdown);
  const first = shutdown();
  const second = shutdown();
  expect(first).toBe(second);
  await first;
  expect(order).toEqual(["merged", "feed", "app"]);
  expect(resources[0].close).toHaveBeenCalledTimes(1);
  expect(app.close).toHaveBeenCalledTimes(1);
  expect(log.info).toHaveBeenCalledWith("Web application stopped");
});
