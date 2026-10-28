import { expect, jest, test } from "@jest/globals";
import { runScreenshotCli } from "../../../../src/frontend/responsive/screenshot/cli.mjs";

test("invokes the selected capture workflow and returns its result", async () => {
  const capture = jest.fn().mockResolvedValue({ count: 2 });
  const result = await runScreenshotCli({ args: [], environment: {}, capture });
  expect(result).toEqual({ count: 2 });
  expect(capture).toHaveBeenCalledWith(
    expect.objectContaining({
      baseUrl: "http://127.0.0.1:3000",
      targets: expect.any(Array),
      modes: ["above-fold", "full-page"],
    }),
  );
});
