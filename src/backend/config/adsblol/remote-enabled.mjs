export function parseAdsbLolRemoteEnabled(value) {
  if (value === undefined) return true;
  const normalized = value.trim().toLowerCase();
  if (normalized === "") return true;
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  throw new Error('ADSBLOL_REMOTE must be "true" or "false"');
}
