import { expect, jest, test } from "@jest/globals";
import packageJson from "../../../package.json" with { type: "json" };
import { startAdsbCli } from "../../../src/cli/adsb/cli.mjs";
import { handleAdsbInformationalOptions } from "../../../src/cli/adsb/informational-options.mjs";

test("writes help and version output for their corresponding options", () => {
  const write = jest.fn();
  expect(handleAdsbInformationalOptions({ help: true }, write)).toBe(true);
  expect(write).toHaveBeenLastCalledWith("Usage: radar-adsb [--host HOST] [--port PORT] [--debug]");
  expect(handleAdsbInformationalOptions({ version: true }, write)).toBe(true);
  expect(write).toHaveBeenCalledTimes(2);
  expect(handleAdsbInformationalOptions({}, write)).toBe(false);
});

test("routes help and version options through the CLI", () => {
  const write = jest.fn();
  const common = { write, writeError: jest.fn(), setExitCode: jest.fn() };
  startAdsbCli({ args: ["--help"], ...common }).close();
  startAdsbCli({ args: ["--version"], ...common }).close();
  expect(write).toHaveBeenNthCalledWith(
    1,
    "Usage: radar-adsb [--host HOST] [--port PORT] [--debug]",
  );
  expect(write).toHaveBeenNthCalledWith(2, packageJson.version);
});
