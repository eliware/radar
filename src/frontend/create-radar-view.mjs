import { createCanvasRadarView } from "./canvas-radar-view.mjs";
import { hasCoarsePointer } from "./mobile-radar-gestures.mjs";

export async function createRadarView({
  container,
  location,
  elevationFeet,
  mapOutlines = null,
  windowRef = window,
  onMode,
}) {
  const isMobile = hasCoarsePointer(windowRef);
  try {
    const { createAircraftScene } = await import("./aircraft-scene.mjs");
    const view = createAircraftScene({
      container,
      location,
      elevationFeet,
      mapOutlines,
      windowRef,
    });
    onMode?.("3D", isMobile);
    return view;
  } catch (error) {
    if (!/WebGL context|WebGL2|WebGL unavailable/i.test(error.message)) throw error;
    const view = createCanvasRadarView({ container, location, mapOutlines, windowRef });
    onMode?.("2D", isMobile);
    return view;
  }
}
