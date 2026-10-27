import { expect, jest, test } from "@jest/globals";
import { readJson } from "../../src/frontend/read-json.mjs";

test("returns JSON from a successful response", async () => {
  const data = { configured: true };
  const fetchData = jest.fn().mockResolvedValue({ ok: true, json: async () => data });
  await expect(readJson(fetchData, "/api/config")).resolves.toBe(data);
  expect(fetchData).toHaveBeenCalledWith("/api/config");
});

test("reports the requested path when the response fails", async () => {
  await expect(readJson(async () => ({ ok: false }), "/api/config")).rejects.toThrow(
    "Request failed: /api/config",
  );
});
