import { expect, jest, test } from "@jest/globals";
import packageJson from "../../package.json" with { type: "json" };
import { startAdsbCli } from "../../src/cli/adsb-cli.mjs";

function dependencies() {
  const values = {
    parseAdsbOptions: jest.fn(() => ({ host: "127.0.0.1", port: 30003 })),
    parseSbsMessage: jest.fn((line) => (line === "valid" ? { icao: "ABC123" } : null)),
    createAircraftList: jest.fn(() => ({
      update: jest.fn((message) => ({ ...message, lastSeen: 10 })),
      list: jest.fn(() => [{ icao: "ABC123", lastSeen: 10 }]),
    })),
    connectSbsFeed: jest.fn(() => ({ close: jest.fn() })),
    renderFlightStrips: jest.fn(() => "LIVE FLIGHT STRIPS"),
    parseAdsbLocation: jest.fn(() => ({ latitude: 43, longitude: -70 })),
    calculateAircraftRange: jest.fn(() => null),
  };
  const write = jest.fn();
  const writeError = jest.fn();
  const setExitCode = jest.fn();
  return { values, write, writeError, setExitCode };
}

test("renders the current aircraft list after each aircraft update", () => {
  const deps = dependencies();
  let width = 80;
  const cli = startAdsbCli({
    args: [],
    write: deps.write,
    writeError: deps.writeError,
    setExitCode: deps.setExitCode,
    getTerminalWidth: () => width,
    dependencies: deps.values,
  });
  expect(cli.table).toBe(true);
  const feedOptions = deps.values.connectSbsFeed.mock.calls[0][0];
  cli.refresh();
  feedOptions.onLine("ignored");
  feedOptions.onLine("valid");
  expect(deps.values.renderFlightStrips).toHaveBeenCalledWith([{ icao: "ABC123", lastSeen: 10 }], {
    width: 80,
  });
  expect(deps.write).toHaveBeenCalledWith("LIVE FLIGHT STRIPS");
  width = 132;
  cli.refresh();
  expect(deps.values.renderFlightStrips).toHaveBeenLastCalledWith(
    [{ icao: "ABC123", lastSeen: 10 }],
    {
      width: 132,
    },
  );
  expect(deps.writeError).not.toHaveBeenCalled();
  feedOptions.onError(new Error("offline"));
  expect(deps.writeError).toHaveBeenCalledWith("ADS-B feed error: offline. Retrying in 2 seconds.");
  expect(deps.setExitCode).not.toHaveBeenCalled();
  cli.close();
});

test("writes aircraft JSON instead of drawing the table in debug mode", () => {
  const deps = dependencies();
  deps.values.parseAdsbOptions.mockReturnValue({ host: "127.0.0.1", port: 30003, debug: true });
  const cli = startAdsbCli({
    args: ["--debug"],
    write: deps.write,
    writeError: deps.writeError,
    setExitCode: deps.setExitCode,
    dependencies: deps.values,
  });
  expect(cli.table).toBe(false);
  deps.values.connectSbsFeed.mock.calls[0][0].onLine("valid");
  expect(JSON.parse(deps.write.mock.calls[0][0])).toEqual({ icao: "ABC123", lastSeen: 10 });
  expect(deps.values.renderFlightStrips).not.toHaveBeenCalled();
});

test("adds calculated range data to the in-memory aircraft record", () => {
  const deps = dependencies();
  const aircraft = { icao: "ABC123", lastSeen: 10 };
  deps.values.calculateAircraftRange.mockReturnValue({
    distanceNauticalMiles: 1.5,
    bearingDegrees: 270,
  });
  deps.values.createAircraftList.mockReturnValue({
    update: jest.fn(() => aircraft),
    list: jest.fn(() => [{ ...aircraft, distanceNauticalMiles: 1.5, bearingDegrees: 270 }]),
  });
  startAdsbCli({
    args: [],
    write: deps.write,
    writeError: deps.writeError,
    setExitCode: deps.setExitCode,
    locationText: "43, -70",
    dependencies: deps.values,
  });
  deps.values.connectSbsFeed.mock.calls[0][0].onLine("valid");
  expect(deps.values.calculateAircraftRange).toHaveBeenCalledWith(
    { latitude: 43, longitude: -70 },
    aircraft,
  );
  expect(deps.values.createAircraftList.mock.results[0].value.update).toHaveBeenCalledWith({
    icao: "ABC123",
    distanceNauticalMiles: 1.5,
    bearingDegrees: 270,
  });
});

test("rejects invalid location settings before opening the feed", () => {
  const deps = dependencies();
  deps.values.parseAdsbLocation.mockImplementation(() => {
    throw new Error("bad MY_LOCATION");
  });
  const cli = startAdsbCli({
    args: [],
    write: deps.write,
    writeError: deps.writeError,
    setExitCode: deps.setExitCode,
    locationText: "bad",
    dependencies: deps.values,
  });
  cli.close();
  expect(deps.writeError).toHaveBeenCalledWith("bad MY_LOCATION");
  expect(deps.setExitCode).toHaveBeenCalledWith(2);
  expect(deps.values.connectSbsFeed).not.toHaveBeenCalled();
});

test("uses the default terminal width when no width callback is set", () => {
  const deps = dependencies();
  startAdsbCli({
    args: [],
    write: deps.write,
    writeError: deps.writeError,
    setExitCode: deps.setExitCode,
    dependencies: deps.values,
  });
  deps.values.connectSbsFeed.mock.calls[0][0].onLine("valid");
  expect(deps.values.renderFlightStrips).toHaveBeenCalledWith([{ icao: "ABC123", lastSeen: 10 }], {
    width: 125,
  });
});

test("does not render records without an aircraft address", () => {
  const deps = dependencies();
  const record = { recordType: "STA", transmissionType: 1, sessionId: "2", aircraftId: "3" };
  deps.values.parseSbsMessage.mockReturnValue(record);
  startAdsbCli({
    args: [],
    write: deps.write,
    writeError: deps.writeError,
    setExitCode: deps.setExitCode,
    dependencies: deps.values,
  });
  deps.values.connectSbsFeed.mock.calls[0][0].onLine("STA,1,2,3");
  expect(deps.write).not.toHaveBeenCalled();
});

test("prints version and invalid option errors without opening the feed", () => {
  const version = dependencies();
  version.values.parseAdsbOptions.mockReturnValue({ version: true });
  const versionCli = startAdsbCli({
    args: ["--version"],
    write: version.write,
    writeError: version.writeError,
    setExitCode: version.setExitCode,
    dependencies: version.values,
  });
  versionCli.close();
  expect(version.write).toHaveBeenCalledWith(packageJson.version);
  expect(version.values.connectSbsFeed).not.toHaveBeenCalled();

  const invalid = dependencies();
  invalid.values.parseAdsbOptions.mockImplementation(() => {
    throw new Error("bad options");
  });
  const invalidCli = startAdsbCli({
    args: ["--bad"],
    write: invalid.write,
    writeError: invalid.writeError,
    setExitCode: invalid.setExitCode,
    dependencies: invalid.values,
  });
  invalidCli.close();
  expect(invalid.writeError).toHaveBeenCalledWith("bad options");
  expect(invalid.setExitCode).toHaveBeenCalledWith(2);
  expect(invalid.values.connectSbsFeed).not.toHaveBeenCalled();
});

test("uses the default CLI dependencies", () => {
  const write = jest.fn();
  const cli = startAdsbCli({
    args: ["--help"],
    write,
    writeError: jest.fn(),
    setExitCode: jest.fn(),
  });
  cli.close();
  expect(write).toHaveBeenCalledWith("Usage: radar-adsb [--host HOST] [--port PORT] [--debug]");
});
