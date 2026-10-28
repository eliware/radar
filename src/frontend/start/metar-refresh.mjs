import { renderMetarRefreshResponse } from "../metar/refresh-display.mjs";

export function startMetarRefresh({ fetchData, panel, ticker, timerHost, enabled = true }) {
  const refresh = async () => {
    if (!enabled) return;
    await renderMetarRefreshResponse(
      panel,
      ticker,
      () => fetchData("/api/metar"),
      () => enabled,
    );
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
