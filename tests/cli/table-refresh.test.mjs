import { expect, jest, test } from "@jest/globals";
import { startTableRefresh } from "../../src/cli/table-refresh.mjs";

test("refreshes the table each second and stops the timer", () => {
  const refresh = jest.fn();
  const timer = {};
  const schedule = jest.fn(() => timer);
  const cancel = jest.fn();
  const stop = startTableRefresh(refresh, schedule, cancel);

  expect(schedule).toHaveBeenCalledWith(refresh, 1000);
  stop();
  expect(cancel).toHaveBeenCalledWith(timer);
});
