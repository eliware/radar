import { expect, jest, test } from "@jest/globals";
import { createAdsbCliOutput } from "../../../src/cli/adsb/output.mjs";

test("refreshes output only after aircraft arrive", () => {
  const updateWriter = { table: true, update: jest.fn(), refresh: jest.fn() };
  const createUpdateWriter = jest.fn(() => updateWriter);
  const output = createAdsbCliOutput({
    debug: false,
    write: jest.fn(),
    renderTable: jest.fn(),
    createUpdateWriter,
  });
  output.refresh();
  expect(updateWriter.refresh).not.toHaveBeenCalled();
  output.update({ icao: "ABC123" });
  output.refresh();
  expect(updateWriter.update).toHaveBeenCalledWith({ icao: "ABC123" });
  expect(updateWriter.refresh).toHaveBeenCalledTimes(1);
});
