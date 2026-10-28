import { installNasrCopy } from "../install-copy.mjs";
import { prepareNasrTemporaryDatabase } from "./database.mjs";

export function prepareNasrImportInstallation(
  files,
  Database,
  input,
  output,
  prepareTemporaryDatabase = prepareNasrTemporaryDatabase,
) {
  return installNasrCopy(files, input, output, (temporary) =>
    prepareTemporaryDatabase(Database, temporary),
  );
}
