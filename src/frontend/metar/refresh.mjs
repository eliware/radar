import { default as renderMetarDisplay } from "./display.mjs";

async function refreshMetar({ fetchData, panel, ticker, isEnabled = () => true }) {
  try {
    const response = await fetchData("/api/metar");
    if (!response.ok) throw new Error("METAR request failed.");
    const data = await response.json();
    if (isEnabled()) renderMetarDisplay(panel, ticker, data);
  } catch {
    if (isEnabled()) renderMetarDisplay(panel, ticker, { reports: [] });
  }
}
export default refreshMetar;
