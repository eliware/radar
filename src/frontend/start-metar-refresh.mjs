import { updateMetarDisplay } from "./metar-display.mjs";

export function startMetarRefresh({ fetchData, panel, ticker, timerHost }) {
  const refresh = async () => {
    try {
      const response = await fetchData("/api/metar");
      if (!response.ok) throw new Error("METAR request failed.");
      updateMetarDisplay(panel, ticker, await response.json());
    } catch {
      updateMetarDisplay(panel, ticker, { reports: [] });
    }
  };
  refresh();
  return timerHost?.setInterval?.(refresh, 300000) ?? null;
}
