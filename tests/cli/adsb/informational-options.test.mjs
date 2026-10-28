import { expect, jest, test } from "@jest/globals";
import { handleAdsbInformationalOptions } from "../../../src/cli/adsb/informational-options.mjs";

test("writes help and version output for their corresponding options", () => {
  const write = jest.fn();
  expect(handleAdsbInformationalOptions({ help: true }, write)).toBe(true);
  expect(write).toHaveBeenLastCalledWith("Usage: radar-adsb [--host HOST] [--port PORT] [--debug]");
  expect(handleAdsbInformationalOptions({ version: true }, write)).toBe(true);
  expect(write).toHaveBeenCalledTimes(2);
  expect(handleAdsbInformationalOptions({}, write)).toBe(false);
});
