import { expect, test } from "@jest/globals";
import {
  MAX_RADIUS_NM,
  POLL_INTERVAL_MS,
} from "../../../../src/backend/aircraft/adsblol-remote/settings.mjs";

test("exports the remote polling and radius limits", () => {
  expect(POLL_INTERVAL_MS).toBe(6000);
  expect(MAX_RADIUS_NM).toBe(300);
});
