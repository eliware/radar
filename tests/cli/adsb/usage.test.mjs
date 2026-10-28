import { expect, jest, test } from "@jest/globals";
import { writeAdsbCliUsage } from "../../../src/cli/adsb/usage.mjs";

test("prints CLI usage help", () => {
  const write = jest.fn();
  writeAdsbCliUsage(write);
  expect(write).toHaveBeenCalledWith("Usage: radar-adsb [--host HOST] [--port PORT] [--debug]");
});
