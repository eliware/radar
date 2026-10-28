import { expect, jest, test } from "@jest/globals";
import { parseRangeQuery } from "../../../../src/backend/reference/range/parameters.mjs";

function reply() {
  const response = { sent: true };
  return { response, code: jest.fn(() => ({ send: jest.fn(() => response) })) };
}

test("parses the default minimum and explicit maximum range", () => {
  const replyRef = reply();
  expect(parseRangeQuery({ maxRangeNm: "25" }, replyRef)).toEqual({
    valid: true,
    minRangeNm: 0,
    maxRangeNm: 25,
  });
  expect(replyRef.code).not.toHaveBeenCalled();
});

test("returns the shared validation response for invalid ranges", () => {
  const replyRef = reply();
  expect(parseRangeQuery({ minRangeNm: "20", maxRangeNm: "10" }, replyRef)).toEqual({
    valid: false,
    response: replyRef.response,
  });
  expect(replyRef.code).toHaveBeenCalledWith(400);
});
