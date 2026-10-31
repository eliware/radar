import { expect, test } from "@jest/globals";
import { parseAdsbLolRemoteEnabled } from "../../../../src/backend/config/adsblol/remote-enabled.mjs";

test.each([undefined, "", " "])("enables ADSB.lol remote by default for %s", (value) => {
  expect(parseAdsbLolRemoteEnabled(value)).toBe(true);
});

test.each(["true", "TRUE", " true "])("accepts %s as enabled", (value) => {
  expect(parseAdsbLolRemoteEnabled(value)).toBe(true);
});

test.each(["false", "FALSE", " false "])("accepts %s as disabled", (value) => {
  expect(parseAdsbLolRemoteEnabled(value)).toBe(false);
});

test("rejects unsupported ADSBLOL_REMOTE values", () => {
  expect(() => parseAdsbLolRemoteEnabled("off")).toThrow(
    'ADSBLOL_REMOTE must be "true" or "false"',
  );
});
