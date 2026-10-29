import { expect, test } from "@jest/globals";
import { parseAdsbOptionValue } from "../../../src/cli/adsb/option-value.mjs";

test("accepts a value and rejects missing option values", () => {
  expect(parseAdsbOptionValue("--host", "localhost")).toBe("localhost");
  expect(() => parseAdsbOptionValue("--host", undefined)).toThrow("Option --host needs a value");
  expect(() => parseAdsbOptionValue("--host", "--port")).toThrow("Option --host needs a value");
});
