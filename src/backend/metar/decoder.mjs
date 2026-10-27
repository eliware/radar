import { parseMetar } from "metar-taf-parser";
import { decodedFields } from "./format-fields.mjs";

export function decodeMetarReport(report, parse = parseMetar) {
  try {
    const { id, metar } = report;
    const source = String(metar ?? "").trim();
    const message = /^(METAR|SPECI)\s/i.test(source) ? source : ["METAR", id, source].join(" ");
    const data = parse(message);
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
