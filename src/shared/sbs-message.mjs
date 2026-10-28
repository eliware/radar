import { parseSbsFields } from "./sbs/fields.mjs";
import { isSupportedSbsRecordType } from "./sbs/record/type.mjs";
import { splitSbsRecordFields } from "./sbs/record/fields.mjs";

export function parseSbsMessage(line) {
  const values = splitSbsRecordFields(line);
  if (!isSupportedSbsRecordType(values[0])) return null;
  return parseSbsFields(values);
}
