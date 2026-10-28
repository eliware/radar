import { afterEach, expect, test } from "@jest/globals";
import { getAdsbLolApiKey } from "../../../../src/backend/aircraft/adsblol-remote/api-key.mjs";

const originalApiKey = process.env.ADSBLOL_API_KEY;

afterEach(() => {
  if (originalApiKey === undefined) delete process.env.ADSBLOL_API_KEY;
  else process.env.ADSBLOL_API_KEY = originalApiKey;
});

test("reads the ADSB.lol API key from supplied environment settings", () => {
  expect(getAdsbLolApiKey({ ADSBLOL_API_KEY: "environment-key" })).toBe("environment-key");
  expect(getAdsbLolApiKey({})).toBeUndefined();
});

test("uses the process environment by default", () => {
  process.env.ADSBLOL_API_KEY = "process-key";
  expect(getAdsbLolApiKey()).toBe("process-key");
});
