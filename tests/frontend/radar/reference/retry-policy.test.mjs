import { expect, test } from "@jest/globals";
import { createRadarReferenceRetryPolicy } from "../../../../src/frontend/radar/reference/retry-policy.mjs";

test("increases reference retry delays exponentially and resets after success", () => {
  const retry = createRadarReferenceRetryPolicy(180, 30_000);
  expect(retry.delay()).toBe(180);
  for (const delay of [180, 360, 720, 1440, 2880, 5760, 11520, 23040, 23040]) {
    retry.recordFailure();
    expect(retry.delay()).toBe(delay);
  }
  retry.reset();
  expect(retry.delay()).toBe(180);
});
