import { expect, jest, test } from "@jest/globals";
import { writeAdsbUpdate } from "../../../src/cli/adsb/update-output.mjs";

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
