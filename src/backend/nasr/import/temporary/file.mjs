import { dirname } from "node:path";
import { createNasrTemporaryPath } from "./path.mjs";

export function createNasrImportTemporaryFile(files) {
  return {
    prepareOutput(output) {
      files.mkdir(dirname(output), { recursive: true });
    },
    temporaryPath: createNasrTemporaryPath,
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
