import { createFlightStripView } from "../flight/strips.mjs";
import { createDashboardDisplay } from "./display.mjs";

export function createDashboardDisplaySetup({ document, fetchData, windowRef, onMetarEnabled }) {
  const flightStrips = createFlightStripView(
    document.querySelector("[data-flight-strips]"),
    windowRef,
  );
  const display = createDashboardDisplay({ document, fetchData, windowRef, onMetarEnabled });
  return { flightStrips, toggles: display.toggles, startMetarRefresh: display.startMetarRefresh };
}
