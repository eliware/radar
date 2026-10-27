import { expect, jest, test } from "@jest/globals";
import { parseMetarReport } from "../../../src/backend/metar/parser.mjs";

test("normalizes report input and delegates parsing", () => {
  const parse = jest.fn((message) => ({ message }));
  expect(parseMetarReport({ id: "KPWM", metar: "  131651Z 29012KT  " }, parse)).toEqual({
    message: "METAR KPWM 131651Z 29012KT",
  });
  expect(parse).toHaveBeenCalledWith("METAR KPWM 131651Z 29012KT");
});

test.each(["METAR KPWM 131651Z", "SPECI KPWM 131651Z"])(
  "preserves a report with an existing %s prefix",
  (message) => {
    const parse = jest.fn((value) => value);
    expect(parseMetarReport({ id: "KPWM", metar: message }, parse)).toBe(message);
  },
);

test("normalizes a missing report string", () => {
  const parse = jest.fn((message) => message);
  expect(parseMetarReport({ id: "KPWM", metar: null }, parse)).toBe("METAR KPWM ");
});
