import { expect, jest, test } from "@jest/globals";
import { createScreenshotCliSetup } from "../../../../../src/frontend/responsive/screenshot/cli/setup.mjs";

test("assembles default capture dependencies and screenshot settings", () => {
  const { capture, captureOptions } = createScreenshotCliSetup({ args: [], environment: {} });
  expect(capture).toEqual(expect.any(Function));
  expect(captureOptions).toEqual(
    expect.objectContaining({
      baseUrl: "http://127.0.0.1:3000",
      outputDir: "artifacts/screenshots",
      targets: expect.any(Array),
      modes: ["above-fold", "full-page"],
    }),
  );
});

test("uses process defaults when no CLI options are provided", () => {
  const previousArguments = process.argv;
  process.argv = [process.argv[0], process.argv[1]];
  try {
    const { capture, captureOptions } = createScreenshotCliSetup();
    expect(capture).toEqual(expect.any(Function));
    expect(captureOptions.baseUrl).toEqual(expect.any(String));
    expect(captureOptions.outputDir).toEqual(expect.any(String));
  } finally {
    process.argv = previousArguments;
  }
});

test("uses the injected capture implementation", () => {
  const capture = jest.fn();
  const selected = createScreenshotCliSetup({
    args: [],
    environment: {},
    dependencies: { capture },
  });
  expect(selected.capture).toBe(capture);
  expect(selected.captureOptions).toEqual(
    expect.objectContaining({
      baseUrl: expect.any(String),
      outputDir: expect.any(String),
      targets: expect.any(Array),
      modes: expect.any(Array),
    }),
  );
});
