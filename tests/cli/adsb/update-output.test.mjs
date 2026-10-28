import { expect, jest, test } from "@jest/globals";
import { createAdsbCliOutput, writeAdsbUpdate } from "../../../src/cli/adsb/update-output.mjs";

test("writes aircraft as JSON in debug mode", () => {
  const aircraft = { icao: "ABC123", lastSeen: 10 };
  const write = jest.fn();
  const renderTable = jest.fn();

  writeAdsbUpdate({ aircraft, debug: true, write, renderTable });

  expect(write).toHaveBeenCalledWith('{"icao":"ABC123","lastSeen":10}');
  expect(renderTable).not.toHaveBeenCalled();
});

test("writes the rendered table in normal mode", () => {
  const write = jest.fn();
  const renderTable = jest.fn(() => "LIVE FLIGHT STRIPS");

  writeAdsbUpdate({ debug: false, write, renderTable });

  expect(renderTable).toHaveBeenCalledTimes(1);
  expect(write).toHaveBeenCalledWith("LIVE FLIGHT STRIPS");
});

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
