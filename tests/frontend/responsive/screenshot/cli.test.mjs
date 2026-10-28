import { expect, jest, test } from "@jest/globals";
import { runScreenshotCli } from "../../../../src/frontend/responsive/screenshot/cli.mjs";

test("invokes the selected capture workflow and returns its result", async () => {
  const capture = jest.fn().mockResolvedValue({ count: 2 });
  const result = await runScreenshotCli({ args: [], environment: {}, dependencies: { capture } });
  expect(result).toEqual({ count: 2 });
  expect(capture).toHaveBeenCalledTimes(1);
});
