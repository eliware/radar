import { parseAdsbLolResponse } from "./response.mjs";
import { requestAdsbLolCircleResponse } from "./request/circle.mjs";

export async function requestAdsbLolCircle(request, location, radiusNm, apiKey) {
  const response = await requestAdsbLolCircleResponse(request, location, radiusNm, apiKey);
  return parseAdsbLolResponse(response);
}
