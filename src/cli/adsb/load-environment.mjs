import { config } from "dotenv";

export function loadAdsbEnvironment(load = config) {
  load({ quiet: true });
}
