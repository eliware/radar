import { default as updateMetarDisplay } from "./update/display.mjs";
import { default as renderMetarTicker } from "./ticker.mjs";

function renderMetarDisplay(panel, ticker, data) {
  updateMetarDisplay(panel, data);
  renderMetarTicker(ticker, data);
}
export default renderMetarDisplay;
