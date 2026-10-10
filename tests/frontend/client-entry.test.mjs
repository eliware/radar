import { expect, jest, test } from "@jest/globals";

test("bootstraps the browser client against the page document", async () => {
  const status = {};
  globalThis.document = {
    querySelector: (selector) => (selector === "[data-status]" ? status : null),
  };
  globalThis.window = { fetch: jest.fn(), WebSocket: class {} };
  await import("../../src/frontend/client-entry.mjs");
  expect(status.textContent).toBe("Radar client assets loaded.");
  delete globalThis.document;
  delete globalThis.window;
});
