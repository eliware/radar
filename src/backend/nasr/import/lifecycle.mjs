import { validateNasrSource } from "./source/validation.mjs";
import { prepareNasrImportInstallation } from "./prepare/install.mjs";

export function completeNasrImportLifecycle(
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
