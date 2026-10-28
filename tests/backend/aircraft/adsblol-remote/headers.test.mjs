import { afterEach, expect, test } from "@jest/globals";
import { createAdsbLolHeaders } from "../../../../src/backend/aircraft/adsblol-remote/headers.mjs";

const originalApiKey = process.env.ADSBLOL_API_KEY;

afterEach(() => {
  if (originalApiKey === undefined) delete process.env.ADSBLOL_API_KEY;
  else process.env.ADSBLOL_API_KEY = originalApiKey;
});

test("includes Radar contact details without an API key", () => {
  expect(createAdsbLolHeaders("")).toEqual({
    "user-agent": "EliwareRadar/15.0.1 (+https://radar.purinton.us; contact: radar@eliware.org)",
  });
});

test("adds an explicit API key header", () => {
  expect(createAdsbLolHeaders("test-api-key")).toEqual({
    "user-agent": "EliwareRadar/15.0.1 (+https://radar.purinton.us; contact: radar@eliware.org)",
    "x-api-key": "test-api-key",
  });
});

test("defaults to the configured API key", () => {
  process.env.ADSBLOL_API_KEY = "environment-key";
  expect(createAdsbLolHeaders()["x-api-key"]).toBe("environment-key");
});
