import { expect, jest, test } from "@jest/globals";
import { loadAdsbEnvironment } from "../../../src/cli/adsb/environment-loader.mjs";

test("loads dotenv configuration quietly", () => {
  const load = jest.fn();

  loadAdsbEnvironment(load);

  expect(load).toHaveBeenCalledWith({ quiet: true });
});

test("loads dotenv configuration with its default loader", () => {
  expect(() => loadAdsbEnvironment()).not.toThrow();
});
