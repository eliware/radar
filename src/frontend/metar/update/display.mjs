import { default as renderMetarTable } from "../table.mjs";

function updateMetarDisplay(element, data, now = new Date()) {
  if (!element) return;
  const reports = Array.isArray(data?.reports) ? data.reports : [];
  if (!reports.length) {
    element.textContent = renderMetarTable(reports, now);
    return;
  }
  element.innerHTML = renderMetarTable(reports, now);
}
export default updateMetarDisplay;
