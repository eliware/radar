import { createCanvasRadarView } from "./canvas-radar-view.mjs";

export async function createRadarView({
  container,
  location,
  elevationFeet,
  windowRef = window,
  onMode,
}) {
  try {
    const { createAircraftScene } = await import("./aircraft-scene.mjs");
    const view = createAircraftScene({ container, location, elevationFeet, windowRef });
    onMode?.("3D");
    return view;
  } catch (error) {
    if (!/WebGL context|WebGL2|WebGL unavailable/i.test(error.message)) throw error;
    const view = createCanvasRadarView({ container, location, windowRef });
    onMode?.("2D");
    return view;
  }
}
