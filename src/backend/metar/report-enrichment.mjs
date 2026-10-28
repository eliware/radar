import { hasUsefulMetarData } from "./useful.mjs";

export function enrichMetarReport(report, decoded) {
  return {
    ...report,
    decoded: decoded && hasUsefulMetarData(decoded) ? decoded : null,
  };
}
