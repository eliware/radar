import { expect, jest, test } from "@jest/globals";
import { createAdsbLolSubscribers } from "../../../../src/backend/aircraft/adsblol-remote/subscribers.mjs";

test("publishes the current aircraft list and supports unsubscribe and clear", () => {
  let aircraft = [{ icao: "ABC123" }];
  const list = jest.fn(() => aircraft);
  const notify = jest.fn();
  const subscribers = createAdsbLolSubscribers(list);
  const unsubscribe = subscribers.subscribe(notify);

  subscribers.publish();
  expect(notify).toHaveBeenCalledWith(aircraft);
  aircraft = [];
  subscribers.publish();
  expect(notify).toHaveBeenLastCalledWith([]);
  unsubscribe();
  subscribers.publish();
  expect(notify).toHaveBeenCalledTimes(2);

  subscribers.subscribe(notify);
  subscribers.clear();
  subscribers.publish();
  expect(notify).toHaveBeenCalledTimes(2);
  expect(list).toHaveBeenCalledTimes(4);
});
