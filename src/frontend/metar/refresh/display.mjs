import { updateMetarDisplay } from "../display.mjs";
import { updateMetarRefreshTicker } from "./ticker.mjs";

export function updateMetarRefreshDisplay(panel, ticker, data) {
  updateMetarDisplay(panel, data);
  updateMetarRefreshTicker(ticker, data);
}
