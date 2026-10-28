import { expect, jest, test } from "@jest/globals";
import { createTerminalFrameWriter } from "../../../../src/cli/terminal/frame/writer.mjs";

test("writes frame output and delegates terminal restoration", () => {
  const stdout = { write: jest.fn() };
  const writer = createTerminalFrameWriter(stdout);
  writer.write("rendered frame");
  writer.restore();
  expect(stdout.write.mock.calls[0]).toEqual(["rendered frame"]);
  expect(stdout.write).toHaveBeenCalledTimes(2);
});
