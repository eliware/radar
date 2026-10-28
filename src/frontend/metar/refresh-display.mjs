import { updateMetarDisplay } from "./display.mjs";
import { renderMetarTicker } from "./ticker.mjs";

export function updateMetarRefreshDisplay(panel, ticker, data) {
  updateMetarDisplay(panel, data);
  if (!ticker) return;
  const reports = Array.isArray(data?.reports) ? data.reports : [];
  if (reports.length) renderMetarTicker(ticker, reports);
  else ticker.textContent = "No METAR reports available.";
}
