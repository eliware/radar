import { decodedFields } from "../../shared/metar/fields.mjs";
import { parseMetarReport } from "./parser.mjs";
import { enrichMetarReport } from "./report-enrichment.mjs";

export function decodeMetarReport(report, parse = undefined) {
  try {
    const data = parseMetarReport(report, parse);
    return enrichMetarReport(report, decodedFields(data));
  } catch {
    return enrichMetarReport(report, null);
  }
}
