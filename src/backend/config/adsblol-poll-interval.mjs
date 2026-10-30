import { POLL_INTERVAL_MS } from "../aircraft/adsblol-remote/settings.mjs";

export function parseAdsbLolPollInterval(value) {
  const interval = value === undefined ? POLL_INTERVAL_MS : Number(value);
  if (!Number.isInteger(interval) || interval < 1000 || interval > 300_000) {
    throw new Error("ADSBLOL_POLL_INTERVAL_MS must be an integer from 1000 through 300000");
  }
  return interval;
}
