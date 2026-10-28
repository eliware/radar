import { expect, test } from "@jest/globals";
import { composeScreenshotOptions } from "../../../../src/frontend/responsive/screenshot/options.mjs";

test("composes the default viewport and screenshot mode selections", () => {
  const options = composeScreenshotOptions();
  expect(options.targets).toHaveLength(6);
  expect(options.modes).toEqual(["above-fold", "full-page"]);
});
