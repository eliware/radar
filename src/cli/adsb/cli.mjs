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
import { writeAdsbUpdate } from "./update-output.mjs";

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
  locationLatitude = process.env.ADSB_LAT,
  locationLongitude = process.env.ADSB_LON,
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
    location = dependencies.parseAdsbLocation(locationLatitude, locationLongitude);
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
  let hasAircraft = false;
  const refresh = () => {
    if (!hasAircraft) return;
    writeAdsbUpdate({
      debug: false,
      write,
      renderTable: () =>
        dependencies.renderFlightStrips(aircraftList.list(), {
          width: getTerminalWidth(),
        }),
    });
  };
  const feed = dependencies.connectSbsFeed({
    host: options.host,
    port: options.port,
    onLine(line) {
      const aircraft = updateAircraft(line);
      if (!aircraft) return;
      if (options.debug) {
        writeAdsbUpdate({ aircraft, debug: true, write });
        return;
      }
      hasAircraft = true;
      refresh();
    },
    onError(error) {
      writeError(`ADS-B stream error: ${error.message}. Retrying in 2 seconds.`);
    },
  });
  return { close: () => feed.close(), refresh, table: !options.debug };
}
