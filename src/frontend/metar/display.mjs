import { updateMetarDisplay } from "./table.mjs";
import { updateMetarTicker } from "./ticker.mjs";

export function renderMetarDisplay(panel, ticker, data) {
  updateMetarDisplay(panel, data);
  updateMetarTicker(ticker, data);
}
