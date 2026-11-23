import { default as radarLegendLayout } from "./entries.mjs";
import { default as drawRadarLegendSymbol } from "./symbol.mjs";
import { default as resolveRadarLegendColor } from "./colors.mjs";

function drawRadarLegendTable(context, width, height, connected, visibility, topInset = 0) {
  context.font = '12px Consolas, "Courier New", monospace';
  context.textAlign = "left";
  radarLegendLayout(width, height, topInset).forEach(({ entry, x, y }) => {
    const [icon, label] = entry;
    const { ink } = resolveRadarLegendColor(entry, connected, visibility);
    context.fillStyle = ink;
    context.strokeStyle = ink;
    drawRadarLegendSymbol(context, icon, x, y - 4);
    context.fillText(label, x + 14, y);
  });
}
export default drawRadarLegendTable;
