import { expect, jest, test } from "@jest/globals";
import { createAdsbLolRouteService } from "../../../../src/backend/lookup/adsblol/route-service.mjs";

test("creates the ADSB.lol callsign route lookup service", async () => {
  const request = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ airport_codes: "EGLL-KJFK" }),
  });
  const getRoute = createAdsbLolRouteService({ request });
  await expect(getRoute("BAW183")).resolves.toEqual({ origin: "EGLL", destination: "KJFK" });
  await getRoute("BAW183");
  expect(request).toHaveBeenCalledTimes(1);
});

test("supports default service options for unusable callsigns", async () => {
  await expect(createAdsbLolRouteService()("AD")).resolves.toBeNull();
});
