import { attachDashboardDisplayToggles } from "../attach/dashboard/display-toggles.mjs";
import { startMetarRefresh } from "../start/metar-refresh.mjs";

export function createDashboardDisplay({ document, fetchData, windowRef, onMetarEnabled }) {
  const toggles = attachDashboardDisplayToggles(document, fetchData, onMetarEnabled);

  return {
    toggles,
    startMetarRefresh() {
      return startMetarRefresh({
        fetchData,
        panel: document.querySelector("[data-metar-reports]"),
        ticker: document.querySelector("[data-metar-ticker]"),
        timerHost: windowRef,
        enabled: !toggles.panel?.hidden,
      });
    },
  };
}
