import { expect, jest, test } from "@jest/globals";
import { default as registerApplicationShutdown } from "../../../src/backend/lifecycle/shutdown.mjs";

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

test("memoizes shutdown and closes the app even when a resource close throws", async () => {
  const failure = new Error("resource close failed");
  const resource = {
    close: jest.fn(() => {
      throw failure;
    }),
  };
  const nextResource = { close: jest.fn() };
  const app = { close: jest.fn(async () => {}) };
  const shutdown = registerApplicationShutdown({
    app,
    resources: [resource, nextResource],
    log: { info: jest.fn() },
    registerSignals: jest.fn(),
  });
  const first = shutdown();
  expect(shutdown()).toBe(first);
  await expect(first).rejects.toBe(failure);
  expect(resource.close).toHaveBeenCalledTimes(1);
  expect(nextResource.close).toHaveBeenCalledTimes(1);
  expect(app.close).toHaveBeenCalledTimes(1);
});

test("propagates an app close failure after resources are closed", async () => {
  const failure = new Error("app close failed");
  const resource = { close: jest.fn() };
  const app = { close: jest.fn(async () => Promise.reject(failure)) };
  const shutdown = registerApplicationShutdown({
    app,
    resources: [resource],
    log: { info: jest.fn() },
    registerSignals: jest.fn(),
  });
  await expect(shutdown()).rejects.toBe(failure);
  expect(resource.close).toHaveBeenCalledTimes(1);
});
