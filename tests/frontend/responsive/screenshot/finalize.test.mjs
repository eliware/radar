import { expect, jest, test } from "@jest/globals";
import { finalizeScreenshotSession } from "../../../../src/frontend/responsive/screenshot/finalize.mjs";

test("closes the browser and checks page errors after capture", async () => {
  const session = { close: jest.fn(), assertNoPageErrors: jest.fn() };
  const capture = jest.fn();
  await finalizeScreenshotSession(session, capture);
  expect(capture).toHaveBeenCalledTimes(1);
  expect(session.close).toHaveBeenCalledTimes(1);
  expect(session.assertNoPageErrors).toHaveBeenCalledTimes(1);
});

test("closes the browser after capture failure and preserves the capture error", async () => {
  const session = { close: jest.fn(), assertNoPageErrors: jest.fn() };
  const capture = jest.fn().mockRejectedValue(new Error("capture failed"));
  await expect(finalizeScreenshotSession(session, capture)).rejects.toThrow("capture failed");
  expect(session.close).toHaveBeenCalledTimes(1);
  expect(session.assertNoPageErrors).not.toHaveBeenCalled();
});

test("propagates browser close failures", async () => {
  const session = {
    close: jest.fn().mockRejectedValue(new Error("close failed")),
    assertNoPageErrors: jest.fn(),
  };
  await expect(finalizeScreenshotSession(session, async () => {})).rejects.toThrow("close failed");
  expect(session.assertNoPageErrors).not.toHaveBeenCalled();
});
