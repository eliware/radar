import { expect, test } from "@jest/globals";
import { createScreenshotPageErrors } from "../../../../src/frontend/responsive/screenshot/page-errors.mjs";

test("collects named errors and reports them together", () => {
  const errors = createScreenshotPageErrors();
  expect(() => errors.assertNone()).not.toThrow();
  errors.record("desktop", new Error("page failed"));
  errors.record("mobile", new Error("navigation failed"));
  expect(() => errors.assertNone()).toThrow(
    "Browser errors:\ndesktop: page failed\nmobile: navigation failed",
  );
});
