import { expect, jest, test } from "@jest/globals";
import { createRadarConnectionState } from "../../src/frontend/create-radar-connection-state.mjs";

test("tracks and forwards the radar feed state", () => {
  const onChange = jest.fn();
  const connection = createRadarConnectionState(onChange);
  expect(connection.isConnected()).toBe(false);
  connection.setConnected(1);
  expect(connection.isConnected()).toBe(true);
  connection.setConnected(0);
  expect(connection.isConnected()).toBe(false);
  expect(onChange.mock.calls.map(([value]) => value)).toEqual([true, false]);
});
