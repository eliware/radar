export function installNasrCopy(files, input, output, prepare) {
  files.prepareOutput(output);
  const temporary = files.temporaryPath(output);
  try {
    files.copyInput(input, temporary);
    const result = prepare(temporary);
    files.install(temporary, output);
    return result;
  } catch (error) {
    files.cleanup(temporary);
    throw error;
  }
}
