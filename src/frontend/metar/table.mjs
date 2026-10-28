import { updateMetarDisplayElement } from "./table/display.mjs";
import { formatMetarTableHeaders } from "./table/headers.mjs";
import { formatMetarReportRow } from "./table/formatting.mjs";

export function renderMetarTable(reports, now = new Date()) {
  return `<table><thead><tr>${formatMetarTableHeaders()}</tr></thead><tbody>${reports
    .map((report) => formatMetarReportRow(report, now))
    .join("")}</tbody></table>`;
}

export function updateMetarDisplay(element, data, now = new Date()) {
  return updateMetarDisplayElement(element, data, renderMetarTable, now);
}
