import { expect, test } from "@jest/globals";
import { escapeHtml } from "../../../src/frontend/html/escape.mjs";

test("escapes HTML-sensitive text and uses an em dash for missing values", () => {
  expect(escapeHtml(`<>&"'`)).toBe("&lt;&gt;&amp;&quot;&#39;");
  expect(escapeHtml(null)).toBe("—");
});
