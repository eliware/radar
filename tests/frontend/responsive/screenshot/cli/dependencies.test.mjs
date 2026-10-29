import { expect, jest, test } from "@jest/globals";
import { resolveScreenshotCliDependencies } from "../../../../../src/frontend/responsive/screenshot/cli/dependencies.mjs";

test("uses injected CLI dependencies", () => {
  const dependencies = {
    browserLauncher: { launch: jest.fn() },
    browserArgs: ["--test"],
    fetcher: jest.fn(),
    files: { mkdir: jest.fn(), stat: jest.fn() },
    delayMs: 0,
    report: jest.fn(),
    capture: jest.fn(),
  };
  expect(resolveScreenshotCliDependencies(dependencies)).toEqual(dependencies);
});

test("fills unspecified dependencies with defaults", () => {
  const resolved = resolveScreenshotCliDependencies({ delayMs: 0 });
  expect(resolved.delayMs).toBe(0);
  expect(resolved.browserLauncher).toEqual(
    expect.objectContaining({ launch: expect.any(Function) }),
  );
  expect(resolved.capture).toEqual(expect.any(Function));
});
