import { expect, jest, test } from "@jest/globals";
import { createAdsbCliOutput } from "../../../src/cli/adsb/output.mjs";

test("selects JSON output in debug mode and keeps refresh inactive", () => {
  const write = jest.fn();
  const renderTable = jest.fn(() => "table");
  const output = createAdsbCliOutput({ debug: true, write, renderTable });
  expect(output.table).toBe(false);
  output.refresh();
  output.update({ icao: "ABC123" });
  expect(write).toHaveBeenCalledWith('{"icao":"ABC123"}');
  expect(renderTable).not.toHaveBeenCalled();
});

test("selects table output and refreshes only after aircraft arrive", () => {
  const write = jest.fn();
  const renderTable = jest.fn(() => "table");
  const output = createAdsbCliOutput({ debug: false, write, renderTable });
  expect(output.table).toBe(true);
  output.refresh();
  expect(write).not.toHaveBeenCalled();
  output.update({ icao: "ABC123" });
  output.refresh();
  expect(renderTable).toHaveBeenCalledTimes(2);
  expect(write).toHaveBeenCalledTimes(2);
});
