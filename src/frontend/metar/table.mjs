import { formatMetarTableHeaders } from "./table/headers.mjs";
import { formatMetarReportRow } from "./table/formatting.mjs";

export function renderMetarTable(reports, now = new Date()) {
  return `<table><thead><tr>${formatMetarTableHeaders()}</tr></thead><tbody>${reports
    .map((report) => formatMetarReportRow(report, now))
    .join("")}</tbody></table>`;
}
