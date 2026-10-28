import { expect, jest, test } from "@jest/globals";
import packageJson from "../../../package.json" with { type: "json" };
import { writeAdsbCliVersion } from "../../../src/cli/adsb/version.mjs";

test("prints the package version", () => {
  const write = jest.fn();
  writeAdsbCliVersion(write);
  expect(write).toHaveBeenCalledWith(packageJson.version);
});
