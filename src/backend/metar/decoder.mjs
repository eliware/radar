import { default as decodedFields } from "../../shared/metar/fields.mjs";
import { default as parseMetarReport } from "./parser.mjs";
import { default as enrichMetarReport } from "./report-enrichment.mjs";

function decodeMetarReport(report, parse = undefined) {
  try {
    const data = parseMetarReport(report, parse);
    return enrichMetarReport(report, decodedFields(data));
  } catch {
    return enrichMetarReport(report, null);
  }
}
export default decodeMetarReport;
