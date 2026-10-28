import { dirname } from "node:path";

export function createNasrImportTemporaryFile(files) {
  return {
    prepareOutput(output) {
      files.mkdir(dirname(output), { recursive: true });
    },
    temporaryPath(output) {
      return `${output}.tmp-${process.pid}`;
    },
    copyInput(input, temporary) {
      files.copy(input, temporary);
    },
    install(temporary, output) {
      files.rename(temporary, output);
    },
    cleanup(temporary) {
      files.remove(temporary, { force: true });
    },
  };
}
