import packageJson from "../../package.json" with { type: "json" };

export function createRadarUserAgent() {
  return `EliwareRadar/${packageJson.version} (+https://radar.purinton.us; contact: radar@eliware.org)`;
}
