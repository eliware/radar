import { parseSbsFields } from "./sbs/fields.mjs";
import { isSupportedSbsRecordType } from "./sbs/record-type.mjs";

export function parseSbsMessage(line) {
  const values = line.split(",");
  if (!isSupportedSbsRecordType(values[0])) return null;
  return parseSbsFields(values);
}
