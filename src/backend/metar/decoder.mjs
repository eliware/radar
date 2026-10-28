import { decodedFields } from "../../shared/metar/fields.mjs";
import { parseMetarReport } from "./parser.mjs";
import { hasUsefulMetarData } from "./useful.mjs";

export function decodeMetarReport(report, parse = undefined) {
  try {
    const data = parseMetarReport(report, parse);
    const decoded = decodedFields(data);
    return {
      ...report,
      decoded: hasUsefulMetarData(decoded) ? decoded : null,
    };
  } catch {
    return { ...report, decoded: null };
  }
}
