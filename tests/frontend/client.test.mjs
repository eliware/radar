import { expect, test } from "@jest/globals";
import { renderHome } from "../../src/frontend/client.mjs";

test("updates the page status when its element exists", () => {
  const status = {};
  renderHome({ querySelector: () => status });
  expect(status.textContent).toBe("Radar client assets loaded.");
});

test("does nothing when the page has no status element", () => {
  renderHome({ querySelector: () => null });
  expect(true).toBe(true);
});
