import { expect, test } from "@jest/globals";
import { escapeMetarHtml } from "../../../src/frontend/metar/escape.mjs";

test("escapes HTML-sensitive text and uses an em dash for missing values", () => {
  expect(escapeMetarHtml(`<>&"'`)).toBe("&lt;&gt;&amp;&quot;&#39;");
  expect(escapeMetarHtml(null)).toBe("—");
});
