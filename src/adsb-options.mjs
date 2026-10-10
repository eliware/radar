export function parseAdsbOptions(args) {
  const options = {
    host: process.env.ADSB_HOST ?? "127.0.0.1",
    port: Number(process.env.ADSB_PORT ?? 30003),
  };
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
    if (argument !== "--host" && argument !== "--port") {
      throw new Error(`Unknown option: ${argument}`);
    }

    const value = args[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Option ${argument} needs a value`);
    }
    index += 1;
    if (argument === "--host") {
      options.host = value;
      continue;
    }
    options.port = Number(value);
    if (!Number.isInteger(options.port) || options.port < 1 || options.port > 65535) {
      throw new Error("Port must be an integer from 1 through 65535");
    }
  }

  if (!Number.isInteger(options.port) || options.port < 1 || options.port > 65535) {
    throw new Error("Port must be an integer from 1 through 65535");
  }
  return options;
}
