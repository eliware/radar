import { expect, jest, test } from "@jest/globals";
import packageJson from "../../../package.json" with { type: "json" };
import { writeAdsbCliVersion } from "../../../src/cli/adsb/help.mjs";
import { startAdsbCli } from "../../../src/cli/adsb/cli.mjs";

test("prints the package version", () => {
  const write = jest.fn();
  writeAdsbCliVersion(write);
  expect(write).toHaveBeenCalledWith(packageJson.version);
});

test("routes help and version options to their output helpers", () => {
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
