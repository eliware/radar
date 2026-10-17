import { expect, jest, test } from "@jest/globals";
import { createRadarServer } from "../../src/backend/server.mjs";

function createApp() {
  const hooks = [];
  return {
    close: async () => Promise.all(hooks.map((hook) => hook())),
    get: jest.fn(),
    post: jest.fn(),
    hooks,
    register: jest.fn(async () => undefined),
    addHook: jest.fn((_name, hook) => hooks.push(hook)),
  };
}

test("registers API and static routes with defaults", async () => {
  const app = createApp();
  const fastifyFactory = jest.fn(() => app);
  const feed = { list: jest.fn(() => []) };
  const read = jest.fn();
  const publicRoot = "public-root";
  const buildRoot = "build-root";

  const server = await createRadarServer({ feed, fastifyFactory, publicRoot, buildRoot, read });

  expect(server).toBe(app);
  expect(fastifyFactory).toHaveBeenCalledWith({ logger: false });
  expect(app.register).toHaveBeenCalledTimes(1);
  expect(app.addHook).not.toHaveBeenCalled();
  expect(app.get.mock.calls.map(([route]) => route)).toEqual([
    "/health",
    "/ready",
    "/api/config",
    "/api/aircraft",
    "/api/airports",
    "/api/navaids",
    "/api/airspace-boundaries",
    "/api/ils",
    "/api/procedures",
    "/api/airways",
    "/ws",
    "/",
    "/style.css",
    "/client.js",
    "/chunks/:filename",
  ]);
});

test("closes the airport database when the server closes", async () => {
  const app = createApp();
  const airportDatabase = { close: jest.fn() };

  await createRadarServer({
    feed: { list: () => [] },
    airportDatabase,
    fastifyFactory: () => app,
  });

  expect(app.addHook).toHaveBeenCalledWith("onClose", expect.any(Function));
  await app.close();
  expect(airportDatabase.close).toHaveBeenCalledTimes(1);
});

test("registers the METAR API when a lookup is available", async () => {
  const app = createApp();
  await createRadarServer({
    feed: { list: () => [] },
    metarLookup: { stations: ["KPWM"], get: async () => [] },
    fastifyFactory: () => app,
  });
  expect(app.get.mock.calls.map(([route]) => route)).toContain("/api/metar");
});

test("uses the default Fastify factory", async () => {
  const server = await createRadarServer({ feed: { list: () => [] } });

  expect(typeof server.inject).toBe("function");
  await server.close();
});
