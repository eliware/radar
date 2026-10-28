import { updateMetarDisplay } from "../metar/table-update.mjs";
import { updateMetarTicker } from "../metar/ticker-update.mjs";

function updateDisplay(panel, ticker, data) {
  updateMetarDisplay(panel, data);
  updateMetarTicker(ticker, data);
}

export function startMetarRefresh({ fetchData, panel, ticker, timerHost, enabled = true }) {
  const refresh = async () => {
    if (!enabled) return;
    try {
      const response = await fetchData("/api/metar");
      if (!response.ok) throw new Error("METAR request failed.");
      const data = await response.json();
      if (enabled) updateDisplay(panel, ticker, data);
    } catch {
      if (enabled) updateDisplay(panel, ticker, { reports: [] });
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
