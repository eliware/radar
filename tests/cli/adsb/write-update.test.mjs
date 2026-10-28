import { expect, jest, test } from "@jest/globals";
import { createAdsbUpdateWriter } from "../../../src/cli/adsb/write-update.mjs";

test("writes aircraft as JSON in debug mode", () => {
  const aircraft = { icao: "ABC123", lastSeen: 10 };
  const write = jest.fn();
  const renderTable = jest.fn();

  const output = createAdsbUpdateWriter({ debug: true, write, renderTable });
  output.update(aircraft);
  output.refresh();

  expect(output.table).toBe(false);
  expect(write).toHaveBeenCalledWith('{"icao":"ABC123","lastSeen":10}');
  expect(renderTable).not.toHaveBeenCalled();
});

test("writes the rendered table in normal mode", () => {
  const write = jest.fn();
  const renderTable = jest.fn(() => "LIVE FLIGHT STRIPS");

  const output = createAdsbUpdateWriter({ debug: false, write, renderTable });
  output.update({ icao: "ABC123" });
  output.refresh();

  expect(output.table).toBe(true);
  expect(renderTable).toHaveBeenCalledTimes(2);
  expect(write).toHaveBeenCalledWith("LIVE FLIGHT STRIPS");
});
