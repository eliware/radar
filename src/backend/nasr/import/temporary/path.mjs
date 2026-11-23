function createNasrTemporaryPath(output) {
  return `${output}.tmp-${process.pid}`;
}
export default createNasrTemporaryPath;
