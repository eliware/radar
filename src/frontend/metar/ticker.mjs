import { metarCategoryLabel } from "./category-label.mjs";
import { escapeHtml } from "../html/escape.mjs";

export { escapeHtml as escapeMetarHtml } from "../html/escape.mjs";

export function renderMetarTicker(ticker, reports) {
  ticker.innerHTML = `<span>${reports.map(tickerLine).join("　•　")}</span>`;
  const line = ticker.firstElementChild;
  if (!line) return;
  line.style.animation = "none";
  void line.offsetWidth;
  line.style.animation = "";
}

function tickerLine({ id, metar, decoded }) {
  return `${escapeHtml(id)} ${metarCategoryLabel(decoded?.flightCategory)} ${escapeHtml(metar)}`.trim();
}
