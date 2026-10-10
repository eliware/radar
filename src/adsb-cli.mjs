import { createAircraftList } from "./aircraft-list.mjs";
import { parseAdsbOptions } from "./adsb-options.mjs";
import { parseSbsMessage } from "./sbs-message.mjs";
import { connectSbsFeed } from "./tcp-feed.mjs";
import { renderFlightStrips } from "./flight-strips.mjs";
import { parseAdsbLocation } from "./adsb-location.mjs";
import { calculateAircraftRange } from "./aircraft-range.mjs";
import packageJson from "../package.json" with { type: "json" };

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
  locationText = process.env.MY_LOCATION,
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
    write("Usage: radar-adsb [--host HOST] [--port PORT]");
    return { close: () => undefined };
  }
  if (options.version) {
    write(packageJson.version);
    return { close: () => undefined };
  }

  let location;
  try {
    location = dependencies.parseAdsbLocation(locationText);
  } catch (error) {
    writeError(error.message);
    setExitCode(2);
    return { close: () => undefined };
  }

  const aircraftList = dependencies.createAircraftList();
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
      const message = dependencies.parseSbsMessage(line);
      if (!message?.icao) return;
      const aircraft = aircraftList.update(message);
      const range = dependencies.calculateAircraftRange(location, aircraft);
      if (range) aircraftList.update({ icao: message.icao, ...range });
      hasAircraft = true;
      refresh();
    },
    onError(error) {
      writeError(`ADS-B feed error: ${error.message}. Retrying in 2 seconds.`);
    },
  });
  return { close: () => feed.close(), refresh };
}
