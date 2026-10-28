const USER_AGENT = "EliwareRadar/15.0.1 (+https://radar.purinton.us; contact: radar@eliware.org)";

export function createAdsbLolHeaders(apiKey) {
  const headers = { "user-agent": USER_AGENT };
  if (apiKey) headers["x-api-key"] = apiKey;
  return headers;
}
