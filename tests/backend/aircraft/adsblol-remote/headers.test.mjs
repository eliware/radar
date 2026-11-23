import { expect, test } from "@jest/globals";
import { default as createAdsbLolHeaders } from "../../../../src/backend/aircraft/adsblol-remote/headers.mjs";
import { default as createRadarUserAgent } from "../../../../src/backend/user-agent.mjs";

test("includes Radar contact details without an API key", () => {
  expect(createAdsbLolHeaders("")).toEqual({
    "user-agent": createRadarUserAgent(),
  });
});

test("adds an explicit API key header", () => {
  expect(createAdsbLolHeaders("test-api-key")).toEqual({
    "user-agent": createRadarUserAgent(),
    "x-api-key": "test-api-key",
  });
});
