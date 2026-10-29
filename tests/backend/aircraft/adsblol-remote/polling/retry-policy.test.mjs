import { expect, test } from "@jest/globals";
import { createAdsbLolPollingRetryPolicy } from "../../../../../src/backend/aircraft/adsblol-remote/polling/retry-policy.mjs";

test("increases retry delay exponentially, caps it, and resets after success", () => {
  const retry = createAdsbLolPollingRetryPolicy(6000, 300_000);
  expect(retry.delay()).toBe(6000);
  for (const delay of [12000, 24000, 48000, 96000, 192000, 300000, 300000]) {
    retry.recordFailure();
    expect(retry.delay()).toBe(delay);
  }
  retry.reset();
  expect(retry.delay()).toBe(6000);
});
