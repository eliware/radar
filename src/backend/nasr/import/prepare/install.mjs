import { installNasrTemporaryCopy } from "../temporary/install.mjs";
import { prepareNasrTemporaryDatabase } from "./database.mjs";

export function prepareNasrImportInstallation(
  files,
  Database,
  input,
  output,
  prepareTemporaryDatabase = prepareNasrTemporaryDatabase,
) {
  return installNasrTemporaryCopy(files, input, output, (temporary) =>
    prepareTemporaryDatabase(Database, temporary),
  );
}
