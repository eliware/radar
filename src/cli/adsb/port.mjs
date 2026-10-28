export function parseAdsbPort(value) {
  return Number(value);
}

export function validateAdsbPort(port) {
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("TCP endpoint number must be an integer from 1 through 65535");
  }
}

export function resolveAdsbPort(commandLinePort, environmentPort) {
  const port = parseAdsbPort(commandLinePort ?? environmentPort);
  validateAdsbPort(port);
  return port;
}
