import { expect, jest, test } from "@jest/globals";
import { loadAdsbEnvironment } from "../../../src/cli/adsb/load-environment.mjs";

test("loads dotenv configuration quietly", () => {
  const load = jest.fn();
  loadAdsbEnvironment(load);
  expect(load).toHaveBeenCalledWith({ quiet: true });
});
