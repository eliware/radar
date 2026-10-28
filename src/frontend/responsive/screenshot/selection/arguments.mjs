export function parseScreenshotArguments(args = []) {
  let primary = false;
  for (const argument of args) {
    if (argument === "--primary") {
      primary = true;
      continue;
    }
    throw new Error(`Unknown screenshot argument: ${argument}`);
  }
  return { primary };
}
