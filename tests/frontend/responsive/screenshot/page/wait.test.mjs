import { afterEach, expect, jest, test } from "@jest/globals";
import { waitForScreenshotReadiness } from "../../../../../src/frontend/responsive/screenshot/page/wait.mjs";

afterEach(() => jest.useRealTimers());

test("waits for the requested screenshot readiness delay", async () => {
  jest.useFakeTimers();
  const ready = waitForScreenshotReadiness(250);
  let completed = false;
  ready.then(() => (completed = true));

  await jest.advanceTimersByTimeAsync(249);
  expect(completed).toBe(false);
  await jest.advanceTimersByTimeAsync(1);
  await expect(ready).resolves.toBeUndefined();
  expect(completed).toBe(true);
});
