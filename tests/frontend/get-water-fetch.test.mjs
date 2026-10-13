import { expect, jest, test } from "@jest/globals";
import { getWaterFetch } from "../../src/frontend/get-water-fetch.mjs";

test("binds browser fetch and returns a safe unavailable response otherwise", async () => {
  const owner = { fetch: jest.fn(async () => ({ ok: true })) };
  expect(await getWaterFetch(owner)()).toEqual({ ok: true });
  expect(owner.fetch).toHaveBeenCalled();
  expect(await getWaterFetch({})()).toEqual({ ok: false });
  expect(await getWaterFetch(null)()).toEqual({ ok: false });
});
