import { expect, test } from "@jest/globals";
import { createDefaultScreenshotCliDependencies } from "../../../../../src/frontend/responsive/screenshot/cli/defaults.mjs";

test("constructs the concrete screenshot CLI defaults", () => {
  expect(createDefaultScreenshotCliDependencies()).toEqual(
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
