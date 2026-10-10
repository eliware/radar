import { expect, test } from "@jest/globals";

test("bootstraps the browser client against the page document", async () => {
  const status = {};
  globalThis.document = { querySelector: () => status };
  await import("../src/client-entry.mjs");
  expect(status.textContent).toBe("Radar client assets loaded.");
  delete globalThis.document;
});
