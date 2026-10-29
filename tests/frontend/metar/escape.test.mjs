import { expect, test } from "@jest/globals";
import { escapeMetarHtml } from "../../../src/frontend/metar/escape.mjs";

test("escapes HTML in METAR text", () => {
  expect(escapeMetarHtml("<METAR & report>")).toBe("&lt;METAR &amp; report&gt;");
});
