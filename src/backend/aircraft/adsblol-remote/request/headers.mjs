import { getAdsbLolApiKey } from "../api-key.mjs";
import { createAdsbLolHeaders } from "../headers.mjs";

export function createAdsbLolRequestHeaders(apiKey) {
  return createAdsbLolHeaders(apiKey ?? getAdsbLolApiKey());
}
