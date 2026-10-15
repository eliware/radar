import { createAircraftList } from "../shared/aircraft-list.mjs";
import { parseAdsbOptions } from "./adsb-options.mjs";
import { parseSbsMessage } from "../shared/sbs-message.mjs";
import { connectSbsFeed } from "../shared/tcp-feed.mjs";
import { renderFlightStrips } from "./flight-strips.mjs";
import { parseAdsbLocation } from "../shared/adsb-location.mjs";
import { calculateAircraftRange } from "../shared/aircraft-range.mjs";
import { createCliAircraftUpdater } from "./update-cli-aircraft.mjs";
import packageJson from "../../package.json" with { type: "json" };

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
    write("Usage: radar-adsb [--host HOST] [--port PORT] [--debug]");
    return { close: () => undefined };
  }
  if (options.version) {
    write(packageJson.version);
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
    write(
      dependencies.renderFlightStrips(aircraftList.list(), {
        width: getTerminalWidth(),
      }),
    );
  };
  const feed = dependencies.connectSbsFeed({
    host: options.host,
    port: options.port,
    onLine(line) {
      const aircraft = updateAircraft(line);
      if (!aircraft) return;
      if (options.debug) {
        write(JSON.stringify(aircraft));
        return;
      }
      hasAircraft = true;
      refresh();
    },
    onError(error) {
      writeError(`ADS-B feed error: ${error.message}. Retrying in 2 seconds.`);
    },
  });
  return { close: () => feed.close(), refresh, table: !options.debug };
}
