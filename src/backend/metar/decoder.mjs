import { decodedFields } from "../../shared/metar/fields.mjs";
import { parseMetarReport } from "./parser.mjs";

export function decodeMetarReport(report, parse = undefined) {
  try {
    const data = parseMetarReport(report, parse);
    const decoded = decodedFields(data);
    return {
      ...report,
      decoded: Object.values(decoded).every(
        (value) => value === "—" || value === false || value == null,
      )
        ? null
        : decoded,
    };
  } catch {
    return { ...report, decoded: null };
  }
}
