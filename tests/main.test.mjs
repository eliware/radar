import { afterEach, expect, jest, test } from "@jest/globals";
import { startWebApplication } from "../src/main.mjs";

afterEach(() => {
  delete process.env.PORT;
  delete process.env.LOG_LEVEL;
});

function dependencies() {
  const server = { listen: jest.fn(), close: jest.fn() };
  const log = { info: jest.fn() };
  const signals = {};
  return {
    server,
    log,
    signals,
    values: {
      loadEnvironment: jest.fn(),
      createLogger: jest.fn(() => log),
      registerHandlers: jest.fn(),
      registerSignals: jest.fn((value) => Object.assign(signals, value)),
      createServer: jest.fn(() => server),
      createRequestHandler: jest.fn(() => jest.fn()),
      resolve: jest.fn((path) => `/app/${path}`),
    },
  };
}

test.each([
  [undefined, 3000],
  ["8080", 8080],
])("starts on configured port %s", (configured, port) => {
  if (configured !== undefined) process.env.PORT = configured;
  const deps = dependencies();
  expect(startWebApplication(deps.values)).toBe(deps.server);
  expect(deps.server.listen).toHaveBeenCalledWith(port);
  expect(deps.signals.shutdownHook).toBeInstanceOf(Function);
  deps.signals.shutdownHook();
  deps.signals.shutdownHook();
  expect(deps.server.close).toHaveBeenCalledTimes(1);
});

test("uses the configured log level", () => {
  process.env.PORT = "8081";
  process.env.LOG_LEVEL = "debug";
  const deps = dependencies();
  startWebApplication(deps.values);
  expect(deps.values.createLogger).toHaveBeenCalledWith({ level: "debug" });
});

test.each(["NaN", "0", "65536", "1.5"])(
  "rejects invalid port %s before creating a server",
  (port) => {
    process.env.PORT = port;
    const deps = dependencies();
    expect(() => startWebApplication(deps.values)).toThrow(
      "PORT must be an integer from 1 through 65535",
    );
    expect(deps.values.createServer).not.toHaveBeenCalled();
  },
);
