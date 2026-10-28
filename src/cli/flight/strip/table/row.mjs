import { fitCell } from "../cell.mjs";

export function tableRow(values, widths, left = "║", joint = "║", right = "║") {
  return `${left} ${values
    .map((value, index) => fitCell(value, widths[index], "", index === 0 ? "left" : "right"))
    .join(` ${joint} `)} ${right}`;
}
