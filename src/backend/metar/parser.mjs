import { parseMetar } from "metar-taf-parser";

export function parseMetarReport(report, parse = parseMetar) {
  const { id, metar } = report;
  const source = String(metar ?? "").trim();
  const message = /^(METAR|SPECI)\s/i.test(source) ? source : ["METAR", id, source].join(" ");
  return parse(message);
}
