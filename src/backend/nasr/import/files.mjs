import { copyFileSync, existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
function createNasrImportFiles({
  exists = existsSync,
  copy = copyFileSync,
  mkdir = mkdirSync,
  rename = renameSync,
  remove = rmSync,
} = {}) {
  return {
    exists,
    copy,
    mkdir,
    rename,
    remove,
  };
}
export default createNasrImportFiles;
