import { expect, test } from "@jest/globals";
import { readAdsbEnvironment } from "../../../src/cli/adsb/environment.mjs";

test("uses the local RTL1090 feed by default", () => {
  expect(readAdsbEnvironment({})).toEqual({ host: "127.0.0.1", port: 30003 });
});

test("reads feed host and port from the environment", () => {
  expect(readAdsbEnvironment({ ADSB_HOST: "receiver.local", ADSB_PORT: "31003" })).toEqual({
    host: "receiver.local",
    port: 31003,
  });
});

test("converts a nonnumeric port for validation by the CLI parser", () => {
  expect(readAdsbEnvironment({ ADSB_PORT: "invalid" }).port).toBeNaN();
});
