import { metarCategoryLabel } from "../../shared/metar/category.mjs";
import { escapeMetarHtml } from "./escape.mjs";

export { escapeMetarHtml } from "./escape.mjs";

export function renderMetarTicker(ticker, reports) {
  ticker.innerHTML = `<span>${reports.map(tickerLine).join("　•　")}</span>`;
  const line = ticker.firstElementChild;
  if (!line) return;
  line.style.animation = "none";
  void line.offsetWidth;
  line.style.animation = "";
}

function tickerLine({ id, metar, decoded }) {
  return `${escapeMetarHtml(id)} ${metarCategoryLabel(decoded?.flightCategory)} ${escapeMetarHtml(metar)}`.trim();
}
