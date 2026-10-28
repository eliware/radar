import { writeAdsbCliVersion } from "./version.mjs";
import { writeAdsbCliUsage } from "./usage.mjs";

export function handleAdsbInformationalOptions(options, write) {
  if (options.help) {
    writeAdsbCliUsage(write);
    return true;
  }
  if (options.version) {
    writeAdsbCliVersion(write);
    return true;
  }
  return false;
}
