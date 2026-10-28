import { expect, jest, test } from "@jest/globals";
import { reportScreenshotResults } from "../../../../src/frontend/responsive/screenshot/report.mjs";

test("reports and returns the screenshot count and output directory", () => {
  const report = jest.fn();
  expect(
    reportScreenshotResults(report, [{}, {}], ["above-fold", "full-page"], "artifacts/shots"),
  ).toEqual({ count: 4, outputDir: "artifacts/shots" });
  expect(report).toHaveBeenCalledWith("Saved 4 screenshots to artifacts/shots");
});
