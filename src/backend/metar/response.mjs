import { default as decodeMetarReport } from "./decoder.mjs";

function createMetarResponse(stations, reports) {
  return { stations, reports: reports.map((report) => decodeMetarReport(report)) };
}
export default createMetarResponse;
