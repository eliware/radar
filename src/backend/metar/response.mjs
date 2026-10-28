import { decodeMetarReport } from "./decoder.mjs";

export function createMetarResponse(stations, reports) {
  return { stations, reports: reports.map((report) => decodeMetarReport(report)) };
}
