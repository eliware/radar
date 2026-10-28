export function createNasrTemporaryPath(output) {
  return `${output}.tmp-${process.pid}`;
}
