const SUPPORTED_RECORD_TYPES = new Set(["MSG", "STA", "ID", "AIR", "SEL", "CLK"]);

function isSupportedSbsRecordType(recordType) {
  return SUPPORTED_RECORD_TYPES.has(recordType);
}
export default isSupportedSbsRecordType;
