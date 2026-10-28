export function parseScreenshotArguments(args = []) {
  return args
    .filter((argument) => argument.startsWith("--"))
    .map((argument) => ({ name: argument.slice(2) }));
}
