import { updateMetarRefreshDisplay } from "../metar/refresh/display.mjs";

export function startMetarRefresh({ fetchData, panel, ticker, timerHost, enabled = true }) {
  const refresh = async () => {
    if (!enabled) return;
    try {
      const response = await fetchData("/api/metar");
      if (!response.ok) throw new Error("METAR request failed.");
      const data = await response.json();
      if (enabled) updateMetarRefreshDisplay(panel, ticker, data);
    } catch {
      if (enabled) updateMetarRefreshDisplay(panel, ticker, { reports: [] });
    }
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
