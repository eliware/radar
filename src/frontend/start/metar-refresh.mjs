import { updateMetarDisplay } from "../metar/display.mjs";
import { renderMetarTicker } from "../metar/ticker.mjs";

export function startMetarRefresh({ fetchData, panel, ticker, timerHost, enabled = true }) {
  const refresh = async () => {
    if (!enabled) return;
    try {
      const response = await fetchData("/api/metar");
      if (!response.ok) throw new Error("METAR request failed.");
      const data = await response.json();
      if (enabled) updateDisplays(panel, ticker, data);
    } catch {
      if (enabled) updateDisplays(panel, ticker, { reports: [] });
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

function updateDisplays(panel, ticker, data) {
  updateMetarDisplay(panel, data);
  if (!ticker) return;
  const reports = Array.isArray(data?.reports) ? data.reports : [];
  if (reports.length) renderMetarTicker(ticker, reports);
  else ticker.textContent = "No METAR reports available.";
}
