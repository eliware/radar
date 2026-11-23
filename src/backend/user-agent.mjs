import packageJson from "../../package.json" with { type: "json" };

function createRadarUserAgent() {
  return `EliwareRadar/${packageJson.version} (+https://radar.purinton.us; contact: radar@eliware.org)`;
}
export default createRadarUserAgent;
