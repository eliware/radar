export function ilsSystemKey(record) {
  return `${record.faaId}:${record.runwayEnd}:${record.identifier}:${record.systemType}`;
}
