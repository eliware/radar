import { expect, jest, test } from "@jest/globals";
import { resolveScreenshotCliDependencies } from "../../../../../src/frontend/responsive/screenshot/cli/dependencies.mjs";

test("selects browser, filesystem, and capture defaults", () => {
  expect(resolveScreenshotCliDependencies()).toEqual(
    expect.objectContaining({
      browserLauncher: expect.objectContaining({ launch: expect.any(Function) }),
      browserArgs: expect.any(Array),
      fetcher: expect.any(Function),
      files: expect.objectContaining({ mkdir: expect.any(Function), stat: expect.any(Function) }),
      delayMs: 500,
      report: console.log,
      capture: expect.any(Function),
    }),
  );
});

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
