import { RADAR_TARGET_STALE_MS } from "../../radar/range.mjs";

function getAircraftHistoryMarks(aircraft, now, staleAfterMs = RADAR_TARGET_STALE_MS) {
  return aircraft.flatMap((item) =>
    (item.history ?? []).slice(0, -1).flatMap((point) => {
      const age = Number.isFinite(point.recordedAt) ? Math.max(0, now - point.recordedAt) : 0;
      const opacity = Math.max(0, 1 - age / staleAfterMs);
      return opacity > 0 ? [{ point, opacity }] : [];
    }),
  );
}
export default getAircraftHistoryMarks;
