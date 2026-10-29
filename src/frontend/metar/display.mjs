import { updateMetarDisplay } from "./update/display.mjs";
import { renderMetarTicker } from "./ticker.mjs";

export function renderMetarDisplay(panel, ticker, data) {
  updateMetarDisplay(panel, data);
  renderMetarTicker(ticker, data);
}
