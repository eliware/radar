import { updateMetarDisplay } from "./update/display.mjs";
import { updateMetarTicker } from "./update/ticker.mjs";

export function renderMetarDisplay(panel, ticker, data) {
  updateMetarDisplay(panel, data);
  updateMetarTicker(ticker, data);
}
