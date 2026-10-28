import { expect, jest, test } from "@jest/globals";
import { createAdsbLolTypeService } from "../../../../src/backend/lookup/adsblol/type-service.mjs";

test("creates the ADSB.lol aircraft type lookup service", async () => {
  const request = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ ac: [{ hex: "ABC123", t: "B738" }] }),
  });
  const getType = createAdsbLolTypeService({ request });
  await expect(getType("ABC123")).resolves.toEqual({ aircraftTypeCode: "B738" });
  await getType("ABC123");
  expect(request).toHaveBeenCalledTimes(1);
});

test("supports default service options for unusable addresses", async () => {
  await expect(createAdsbLolTypeService()(null)).resolves.toBeNull();
});
