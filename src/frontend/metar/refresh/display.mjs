import { updateMetarDisplay } from "../display.mjs";
import { updateMetarTicker } from "../ticker.mjs";

export function updateMetarRefreshDisplay(panel, ticker, data) {
  updateMetarDisplay(panel, data);
  updateMetarTicker(ticker, data);
}
