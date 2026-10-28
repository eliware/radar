import { updateMetarDisplayElement } from "../table/display.mjs";
import { renderMetarTable } from "../table.mjs";

export function updateMetarDisplay(element, data, now = new Date()) {
  return updateMetarDisplayElement(element, data, renderMetarTable, now);
}
