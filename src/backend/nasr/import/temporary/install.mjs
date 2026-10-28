import { dirname } from "node:path";
import { createNasrTemporaryPath } from "./path.mjs";

export function installNasrTemporaryCopy(files, input, output, prepare) {
  files.mkdir(dirname(output), { recursive: true });
  const temporary = createNasrTemporaryPath(output);
  try {
    files.copy(input, temporary);
    const result = prepare(temporary);
    files.rename(temporary, output);
    return result;
  } catch (error) {
    files.remove(temporary, { force: true });
    throw error;
  }
}
