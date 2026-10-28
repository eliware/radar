import { shiftWaterCenter } from "../shift-water-center.mjs";

export function calculateCanvasWaterView(location, canvas, state) {
  const width = canvas.clientWidth || 1;
  const height = canvas.clientHeight || 1;
  const radius = Math.max(1, Math.min(width, height) * 0.44);
  const cosine = Math.cos(state.rotation);
  const sine = Math.sin(state.rotation);
  const east = ((-state.offsetX * cosine - state.offsetY * sine) / radius) * state.range;
  const north = ((state.offsetX * sine - state.offsetY * cosine) / radius) * state.range;
  const center = shiftWaterCenter(location, east, north);
  return { center, key: JSON.stringify([center, state.range]) };
}
