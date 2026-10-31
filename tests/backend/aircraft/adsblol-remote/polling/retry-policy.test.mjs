import { expect, test } from "@jest/globals";
import { createAdsbLolPollingRetryPolicy } from "../../../../../src/backend/aircraft/adsblol-remote/polling/retry-policy.mjs";

test("increases retry delay exponentially, caps it, and resets after success", () => {
  const retry = createAdsbLolPollingRetryPolicy(15000);
  expect(retry.delay()).toBe(15000);
  for (const delay of [30000, 60000, 120000, 240000, 300000, 300000]) {
    retry.recordFailure();
    expect(retry.delay()).toBe(delay);
  }
  retry.reset();
  expect(retry.delay()).toBe(15000);
});
