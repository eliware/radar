import { parseAdsbPort } from "./parse-port.mjs";
import { validateAdsbPort } from "./validate-port.mjs";

export function resolveAdsbPort(commandLinePort, environmentPort) {
  const port = parseAdsbPort(commandLinePort ?? environmentPort);
  validateAdsbPort(port);
  return port;
}
