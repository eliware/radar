import { expect, jest, test } from "@jest/globals";
import { createTerminalFrameWriter } from "../../../../src/cli/terminal/frame/writer.mjs";

test("writes rendered frames and the terminal restoration sequence", () => {
  const stdout = { write: jest.fn() };
  const writer = createTerminalFrameWriter(stdout);
  writer.write("rendered frame");
  writer.restore();
  expect(stdout.write.mock.calls).toEqual([["rendered frame"], ["\u001b[?25h\u001b[?1049l"]]);
});
