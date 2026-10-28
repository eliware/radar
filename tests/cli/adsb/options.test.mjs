import { expect, test } from "@jest/globals";
import { parseAdsbOptions } from "../../../src/cli/adsb/options.mjs";

test("composes parsed arguments with resolved environment settings", () => {
  expect(parseAdsbOptions(["--host", "receiver.local", "--port", "30004", "--debug"])).toEqual({
    host: "receiver.local",
    port: 30004,
    locationLatitude: undefined,
    locationLongitude: undefined,
    debug: true,
  });
});
