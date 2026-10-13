import { selectDefaultRadarRange } from "./radar-range.mjs";
import { watchRadarTargets } from "./watch-radar-targets.mjs";
import { createRadarRenderLoop } from "./radar-render-loop.mjs";

export function createAircraftRadarLoop({
  targets,
  trails,
  windowRef,
  radarCamera,
  isAutoZoom,
  renderer,
  scene,
  camera,
  container,
  overlay,
  location,
  elevationFeet,
  isConnected,
  airports,
  navaids,
  boundaries,
  ilsApproaches = new Map(),
  isIlsVisible = () => true,
  procedures = new Map(),
  isProceduresVisible = () => true,
}) {
  const stopWatch = watchRadarTargets({
    targets,
    windowRef,
    onExpire: (expired) => {
      trails.remove(expired);
      if (isAutoZoom()) radarCamera.setRange(selectDefaultRadarRange(targets.distances()));
    },
  });
  const stopRender = createRadarRenderLoop({
    renderer,
    scene,
    camera,
    container,
    windowRef,
    onFrame: () =>
      overlay.draw(
        targets.items(),
        trails,
        location,
        elevationFeet,
        camera,
        radarCamera.range(),
        isConnected(),
        airports,
        navaids,
        boundaries,
        ilsApproaches,
        isIlsVisible(),
        procedures,
        isProceduresVisible(),
      ),
  });
  return () => {
    stopRender();
    stopWatch();
  };
}
