import { expect, test } from "@jest/globals";
import { composeScreenshotOptions } from "../../../../src/frontend/responsive/screenshot/options.mjs";

test("composes selected viewport and screenshot mode options", () => {
  const options = composeScreenshotOptions("desktop-1080p", "full-page");
  expect(options.targets.map(({ name }) => name)).toEqual(["desktop-1080p"]);
  expect(options.modes).toEqual(["full-page"]);
});
