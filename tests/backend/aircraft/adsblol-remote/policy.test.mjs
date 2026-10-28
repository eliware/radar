import { expect, test } from "@jest/globals";
import { createAdsbLolClients } from "../../../../src/backend/aircraft/adsblol-remote/clients.mjs";
import { getAdsbLolPollingPolicy } from "../../../../src/backend/aircraft/adsblol-remote/policy.mjs";

test("aggregates active remote client demand into polling policy", () => {
  const clients = createAdsbLolClients(20, 300);
  expect(getAdsbLolPollingPolicy(clients, 300)).toEqual({
    hasRemoteClients: false,
    radiusNm: 0,
  });
  clients.connect("near");
  clients.connect("local");
  clients.setRadius("near", 42.1);
  clients.setRadius("local", 250);
  clients.setLocalOnly("local", true);
  expect(getAdsbLolPollingPolicy(clients, 300)).toEqual({
    hasRemoteClients: true,
    radiusNm: 43,
  });
  clients.setLocalOnly("near", true);
  expect(getAdsbLolPollingPolicy(clients, 300)).toEqual({
    hasRemoteClients: false,
    radiusNm: 0,
  });
});
