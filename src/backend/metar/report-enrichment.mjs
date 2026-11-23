import { default as hasUsefulMetarData } from "./useful.mjs";

function enrichMetarReport(report, decoded) {
  return {
    ...report,
    decoded: decoded && hasUsefulMetarData(decoded) ? decoded : null,
  };
}
export default enrichMetarReport;
