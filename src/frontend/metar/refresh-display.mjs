import { renderMetarDisplay } from "./display.mjs";

export async function renderMetarRefreshResponse(
  panel,
  ticker,
  loadResponse,
  isEnabled = () => true,
) {
  try {
    const response = await loadResponse();
    if (!response.ok) throw new Error("METAR request failed.");
    const data = await response.json();
    if (isEnabled()) renderMetarDisplay(panel, ticker, data);
  } catch {
    if (isEnabled()) renderMetarDisplay(panel, ticker, { reports: [] });
  }
}
