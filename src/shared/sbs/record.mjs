import { isSupportedSbsRecordType } from "./record-type.mjs";

export function parseSbsRecord(line) {
  const values = line.split(",");
  return isSupportedSbsRecordType(values[0]) ? values : null;
}
