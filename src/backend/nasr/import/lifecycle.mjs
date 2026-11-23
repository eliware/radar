import { default as validateNasrSource } from "./source/validation.mjs";
import { default as prepareNasrImportInstallation } from "./prepare/install.mjs";

function completeNasrImportLifecycle(
  DatabaseConstructor,
  filesystem,
  input,
  output,
  { validateSource = validateNasrSource, prepareInstallation = prepareNasrImportInstallation } = {},
) {
  validateSource(DatabaseConstructor, input);
  const indexes = prepareInstallation(filesystem, DatabaseConstructor, input, output);
  return { output, indexes };
}
export default completeNasrImportLifecycle;
