import { expect, test } from "@jest/globals";
import { createAdsbLolRequestHeaders } from "../../../../../src/backend/aircraft/adsblol-remote/request/headers.mjs";

test("resolves the environment API key when building request headers", () => {
  expect(createAdsbLolRequestHeaders("explicit-key")["x-api-key"]).toBe("explicit-key");
});

test("uses the configured API key when none is supplied", () => {
  expect(createAdsbLolRequestHeaders(undefined)["x-api-key"]).toBe(process.env.ADSBLOL_API_KEY);
});
