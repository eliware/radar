import { default as isValidRangeBand } from "./validation.mjs";

const RANGE_ERROR = "Use a valid range from 0 to 300 nautical miles.";

function parseRangeQuery(query, reply) {
  const minRangeNm = Number(query.minRangeNm ?? 0);
  const maxRangeNm = Number(query.maxRangeNm);
  if (!isValidRangeBand(minRangeNm, maxRangeNm)) {
    return { valid: false, response: reply.code(400).send({ error: RANGE_ERROR }) };
  }
  return { valid: true, minRangeNm, maxRangeNm };
}
export default parseRangeQuery;
