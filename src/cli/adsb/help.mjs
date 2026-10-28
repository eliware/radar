import packageJson from "../../../package.json" with { type: "json" };

export function writeAdsbCliHelp(write) {
  write("Usage: radar-adsb [--host HOST] [--port PORT] [--debug]");
}

export function writeAdsbCliVersion(write) {
  write(packageJson.version);
}
