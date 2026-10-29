import { parseAdsbOptionValue } from "./option-value.mjs";

export function parseAdsbArguments(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--help") {
      options.help = true;
      continue;
    }
    if (argument === "--version") {
      options.version = true;
      continue;
    }
    if (argument === "--debug") {
      options.debug = true;
      continue;
    }
    if (argument !== "--host" && argument !== "--port") {
      throw new Error(`Unknown option: ${argument}`);
    }

    const value = parseAdsbOptionValue(argument, args[index + 1]);
    index += 1;
    if (argument === "--host") {
      options.host = value;
      continue;
    }
    options.port = value;
  }
  return options;
}
