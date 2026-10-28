import { createAircraftList } from "../../shared/aircraft/list.mjs";
import { parseAdsbOptions } from "./options.mjs";
import { parseSbsMessage } from "../../shared/sbs-message.mjs";
import { connectSbsFeed } from "../../shared/tcp-feed.mjs";
import { renderFlightStrips } from "../flight/strips.mjs";
import { parseAdsbLocation } from "../../shared/adsb-location.mjs";
import { calculateAircraftRange } from "../../shared/aircraft/range.mjs";
import { handleAdsbInformationalOptions } from "./informational-options.mjs";
import { createAdsbCliOutput } from "./output.mjs";
import { connectAdsbCliFeed } from "./feed.mjs";

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

  if (handleAdsbInformationalOptions(options, write)) return { close: () => undefined };

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
  const output = createAdsbCliOutput({
    debug: options.debug,
    write,
    renderTable: () =>
      dependencies.renderFlightStrips(aircraftList.list(), {
        width: getTerminalWidth(),
      }),
  });
  const feed = connectAdsbCliFeed({
    connectSbsFeed: dependencies.connectSbsFeed,
    options,
    parseSbsMessage: dependencies.parseSbsMessage,
    aircraftList,
    location,
    calculateAircraftRange: dependencies.calculateAircraftRange,
    output,
    writeError,
  });
  return { close: () => feed.close(), refresh: output.refresh, table: output.table };
}
