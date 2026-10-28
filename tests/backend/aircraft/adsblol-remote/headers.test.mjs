import { expect, test } from "@jest/globals";
import { createAdsbLolHeaders } from "../../../../src/backend/aircraft/adsblol-remote/headers.mjs";

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
