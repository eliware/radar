import { expect, test } from "@jest/globals";
import { composeScreenshotOptions } from "../../../../src/frontend/responsive/screenshot/options.mjs";

test("composes the default viewport and screenshot mode selections", () => {
  const options = composeScreenshotOptions();
  expect(options.targets).toHaveLength(6);
  expect(options.modes).toEqual(["above-fold", "full-page"]);
});

test("composes explicit viewport and mode selections", () => {
  const options = composeScreenshotOptions("desktop-primary", "full-page");
  expect(options.targets[0].viewport).toEqual({
    width: 1280,
    height: 1024,
    deviceScaleFactor: 1,
  });
  expect(options.modes).toEqual(["full-page"]);
});

test("rejects invalid viewport or mode selections", () => {
  expect(() => composeScreenshotOptions("unknown", "full-page")).toThrow(
    "Unknown viewport selection",
  );
  expect(() => composeScreenshotOptions("all", "unknown")).toThrow("Unknown screenshot mode");
});
