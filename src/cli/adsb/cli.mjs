import { createAircraftList } from "../../shared/aircraft/list.mjs";
import { parseAdsbOptions } from "./options.mjs";
import { parseSbsMessage } from "../../shared/sbs-message.mjs";
import { connectSbsFeed } from "../../shared/tcp-feed.mjs";
import { renderFlightStrips } from "../flight/strips.mjs";
import { parseAdsbLocation } from "../../shared/adsb-location.mjs";
import { calculateAircraftRange } from "../../shared/aircraft/range.mjs";
import { createCliAircraftUpdater } from "../update-cli-aircraft.mjs";
import { writeAdsbCliVersion } from "./help.mjs";
import { writeAdsbCliUsage } from "./usage.mjs";
import { createAdsbCliOutput } from "./output.mjs";

export const adsbCliDependencies = {
  createAircraftList,
  parseAdsbOptions,
  parseSbsMessage,
  connectSbsFeed,
  renderFlightStrips,
  parseAdsbLocation,
  calculateAircraftRange,
};

export function startAdsbCli({
  args,
  write,
  writeError,
  setExitCode,
  getTerminalWidth = () => 125,
  locationLatitude,
  locationLongitude,
  dependencies = adsbCliDependencies,
}) {
  let options;
  try {
    options = dependencies.parseAdsbOptions(args);
  } catch (error) {
    writeError(error.message);
    setExitCode(2);
    return { close: () => undefined };
  }

  if (options.help) {
    writeAdsbCliUsage(write);
    return { close: () => undefined };
  }
  if (options.version) {
    writeAdsbCliVersion(write);
    return { close: () => undefined };
  }

  let location;
  try {
    location = dependencies.parseAdsbLocation(
      locationLatitude ?? options.locationLatitude,
      locationLongitude ?? options.locationLongitude,
    );
  } catch (error) {
    writeError(error.message);
    setExitCode(2);
    return { close: () => undefined };
  }

  const aircraftList = dependencies.createAircraftList();
  const updateAircraft = createCliAircraftUpdater({
    parseSbsMessage: dependencies.parseSbsMessage,
    aircraftList,
    location,
    calculateRange: dependencies.calculateAircraftRange,
  });
  const output = createAdsbCliOutput({
    debug: options.debug,
    write,
    renderTable: () =>
      dependencies.renderFlightStrips(aircraftList.list(), {
        width: getTerminalWidth(),
      }),
  });
  const feed = dependencies.connectSbsFeed({
    host: options.host,
    port: options.port,
    onLine(line) {
      const aircraft = updateAircraft(line);
      if (!aircraft) return;
      output.update(aircraft);
    },
    onError(error) {
      writeError(`ADS-B stream error: ${error.message}. Retrying in 2 seconds.`);
    },
  });
  return { close: () => feed.close(), refresh: output.refresh, table: output.table };
}
