import { createRadarUserAgent } from "../../user-agent.mjs";

export function createAdsbLolHeaders(apiKey) {
  const headers = { "user-agent": createRadarUserAgent() };
  if (apiKey) headers["x-api-key"] = apiKey;
  return headers;
}
