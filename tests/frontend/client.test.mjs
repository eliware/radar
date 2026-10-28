import { expect, jest, test } from "@jest/globals";
import { renderHome } from "../../src/frontend/client.mjs";

test("leaves pages without a status element unchanged", () => {
  const document = { querySelector: jest.fn(() => null) };

  expect(renderHome(document)).toBeUndefined();
  expect(document.querySelector).toHaveBeenCalledWith("[data-status]");
});
