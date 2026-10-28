import { copyFileSync, existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { dirname } from "node:path";

export function createNasrImportFiles({
  exists = existsSync,
  copy = copyFileSync,
  mkdir = mkdirSync,
  rename = renameSync,
  remove = rmSync,
} = {}) {
  return {
    exists,
    prepareOutput(output) {
      mkdir(dirname(output), { recursive: true });
    },
    temporaryPath(output) {
      return `${output}.tmp-${process.pid}`;
    },
    copyInput(input, temporary) {
      copy(input, temporary);
    },
    install(temporary, output) {
      rename(temporary, output);
    },
    cleanup(temporary) {
      remove(temporary, { force: true });
    },
  };
}
