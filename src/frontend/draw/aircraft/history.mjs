import { RADAR_TARGET_STALE_MS } from "../../radar/range.mjs";
import { drawAircraftTrack } from "./track.mjs";

export function drawAircraftHistory(context, aircraft, trailColor, now = Date.now()) {
  const previousAlpha = context.globalAlpha ?? 1;
  context.strokeStyle = trailColor;
  for (const item of aircraft) {
    for (const point of (item.history ?? []).slice(0, -1)) {
      const age = Number.isFinite(point.recordedAt) ? Math.max(0, now - point.recordedAt) : 0;
      const opacity = Math.max(0, 1 - age / RADAR_TARGET_STALE_MS);
      if (opacity === 0) continue;
      context.globalAlpha = previousAlpha * opacity;
      drawAircraftTrack(context, point);
    }
  }
  context.globalAlpha = previousAlpha;
}
