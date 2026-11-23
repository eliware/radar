import { default as getAdsbLolApiKey } from "../api-key.mjs";
import { default as createAdsbLolHeaders } from "../headers.mjs";

function createAdsbLolRequestHeaders(apiKey) {
  return createAdsbLolHeaders(apiKey ?? getAdsbLolApiKey());
}
export default createAdsbLolRequestHeaders;
