import { expect, test } from "@jest/globals";
import { screenshotOutputPath } from "../../../../src/frontend/responsive/screenshot/path.mjs";

test("names screenshot files by viewport and mode", () => {
  expect(screenshotOutputPath("/captures", "desktop", "full-page")).toBe(
    "/captures/desktop-full-page.png",
  );
});
