import { parseSbsFields } from "./sbs/fields.mjs";
import { parseSbsRecord } from "./sbs/record.mjs";

export function parseSbsMessage(line) {
  const values = parseSbsRecord(line);
  if (!values) return null;
  return parseSbsFields(values);
}
