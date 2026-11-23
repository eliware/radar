import { default as refreshMetar } from "../metar/refresh.mjs";

function startMetarRefresh({ fetchData, panel, ticker, timerHost, enabled = true }) {
  const refresh = async () => {
    if (!enabled) return;
    await refreshMetar({ fetchData, panel, ticker, isEnabled: () => enabled });
  };
  refresh();
  const timer = timerHost?.setInterval?.(refresh, 300000) ?? null;
  return {
    setEnabled(value) {
      enabled = Boolean(value);
      if (enabled) refresh();
    },
    destroy() {
      if (timer !== null) timerHost?.clearInterval?.(timer);
    },
  };
}
export default startMetarRefresh;
