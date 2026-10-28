export function parseScreenshotArguments(args = []) {
  return { primary: args.includes("--primary") };
}
