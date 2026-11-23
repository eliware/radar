import { default as attachDashboardDisplayToggles } from "../attach/dashboard/display-toggles.mjs";
import { default as startMetarRefresh } from "../start/metar-refresh.mjs";

function createDashboardDisplay({ document, fetchData, windowRef, onMetarEnabled }) {
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
export default createDashboardDisplay;
