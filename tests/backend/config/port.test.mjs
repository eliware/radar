import { expect, test } from "@jest/globals";
import { parsePort } from "../../../src/backend/config/port.mjs";

test.each(["1", "30004", "65535"])("parses valid port %s", (value) => {
  expect(parsePort(value, "PORT")).toBe(Number(value));
});

test.each(["bad", "0", "65536", "1.5"])("rejects invalid port %s", (value) => {
  expect(() => parsePort(value, "ADSB_PORT")).toThrow(
    "ADSB_PORT must be an integer from 1 through 65535",
  );
});
