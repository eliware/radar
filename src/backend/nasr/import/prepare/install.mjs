import { default as installNasrTemporaryCopy } from "../temporary/install.mjs";
import { default as prepareNasrTemporaryDatabase } from "./database.mjs";

function prepareNasrImportInstallation(
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
export default prepareNasrImportInstallation;
