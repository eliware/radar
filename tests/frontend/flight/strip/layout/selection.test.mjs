import { expect, test } from "@jest/globals";
import { selectFlightStripLayout } from "../../../../../src/frontend/flight/strip/layout/selection.mjs";

const labels = ["A", "B", "C", "D", "E", "", "G", "H", "I"];
const values = [["RADAR123", "125-06", "B738", "009°200", "1200", "", "007°4", "KPWM", "KBOS"]];

test("selects one, two, or three rows based on available width", () => {
  expect(selectFlightStripLayout(values, 3000, labels)).toHaveLength(1);
  expect(selectFlightStripLayout(values, 500, labels)).toHaveLength(2);
  expect(selectFlightStripLayout(values, 250, labels)).toHaveLength(3);
});

test("selects a narrow layout for empty aircraft values", () => {
  expect(selectFlightStripLayout([], 0, labels)).toHaveLength(3);
});
