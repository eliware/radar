import { expect, jest, test } from "@jest/globals";
import { updateMetarDisplayElement } from "../../../../src/frontend/metar/table/display.mjs";

test("sets the empty-state message when no reports are available", () => {
  const element = { textContent: "", innerHTML: "previous" };
  const renderTable = jest.fn();
  updateMetarDisplayElement(element, { reports: [] }, renderTable, new Date(0));
  expect(element.textContent).toBe("No METAR reports available.");
  expect(element.innerHTML).toBe("previous");
  expect(renderTable).not.toHaveBeenCalled();
  updateMetarDisplayElement(element, {}, renderTable, new Date(0));
  expect(element.textContent).toBe("No METAR reports available.");
});

test("renders reports into the display element", () => {
  const element = { textContent: "", innerHTML: "" };
  const reports = [{ id: "KPWM" }];
  const now = new Date(0);
  const renderTable = jest.fn(() => "<table>reports</table>");
  updateMetarDisplayElement(element, { reports }, renderTable, now);
  expect(renderTable).toHaveBeenCalledWith(reports, now);
  expect(element.innerHTML).toBe("<table>reports</table>");
});

test("ignores a missing display element", () => {
  const renderTable = jest.fn();
  expect(updateMetarDisplayElement(null, {}, renderTable, new Date(0))).toBeUndefined();
  expect(renderTable).not.toHaveBeenCalled();
});
