import { default as createRadarUserAgent } from "../../user-agent.mjs";

function createAdsbLolHeaders(apiKey) {
  const headers = { "user-agent": createRadarUserAgent() };
  if (apiKey) headers["x-api-key"] = apiKey;
  return headers;
}
export default createAdsbLolHeaders;
