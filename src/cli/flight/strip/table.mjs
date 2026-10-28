import { fitCell } from "./cell.mjs";

export function tableBorder(widths, left, joint, right, line, specialJointIndex = 0) {
  const segments = widths.map((width) => line.repeat(width + 2));
  const joints = widths.slice(1).map((_, index) => (index + 1 === specialJointIndex ? "╪" : joint));
  return `${left}${segments.map((segment, index) => segment + (joints[index] ?? "")).join("")}${right}`;
}

export function tableRow(values, widths, left = "║", joint = "║", right = "║") {
  return `${left} ${values
    .map((value, index) => fitCell(value, widths[index], "", index === 0 ? "left" : "right"))
    .join(` ${joint} `)} ${right}`;
}
