import { default as parseSbsFields } from "./sbs/fields.mjs";
import { default as isSupportedSbsRecordType } from "./sbs/record/type.mjs";
import { default as splitSbsRecordFields } from "./sbs/record/fields.mjs";

function parseSbsMessage(line) {
  const values = splitSbsRecordFields(line);
  if (!isSupportedSbsRecordType(values[0])) return null;
  return parseSbsFields(values);
}
export default parseSbsMessage;
