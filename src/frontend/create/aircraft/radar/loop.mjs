import { selectDefaultRadarRange } from "../../../radar/range.mjs";
import { watchRadarTargets } from "../../../watch-radar-targets.mjs";
import { createRadarRenderLoop } from "../../../radar/render-loop.mjs";

const OVERLAY_REFRESH_MS = 100;

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
  defaultRangeNm,
  isConnected,
  airports,
  navaids,
  boundaries,
  ilsApproaches = new Map(),
  isIlsVisible = () => true,
  procedures = new Map(),
  procedureVisibility = { sidVisible: true, starVisible: true },
  airways = new Map(),
  airwayVisibility = { isVisible: () => true },
  runwayVisibility = { isRunwaysVisible: () => true, isExtensionsVisible: () => true },
  referenceVisibility = { airportsVisible: true, navaidsVisible: true },
  isWaterVisible = () => true,
}) {
  let lastOverlayFrame = null;
  const stopWatch = watchRadarTargets({
    targets,
    windowRef,
    onExpire: (expired) => {
      trails.remove(expired);
      if (isAutoZoom())
        radarCamera.setRange(selectDefaultRadarRange(targets.localDistances(), defaultRangeNm));
    },
  });
  const stopRender = createRadarRenderLoop({
    renderer,
    scene,
    camera,
    container,
    windowRef,
    onFrame: (time) => {
      const now = Number.isFinite(time) ? time : (windowRef.performance?.now?.() ?? Date.now());
      if (lastOverlayFrame !== null && now - lastOverlayFrame < OVERLAY_REFRESH_MS) return;
      lastOverlayFrame = now;
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
        procedureVisibility,
        isWaterVisible(),
        airways,
        Object.fromEntries(["Q", "J", "V"].map((type) => [type, airwayVisibility.isVisible(type)])),
        {
          runwaysVisible:
            referenceVisibility.airportsVisible && runwayVisibility.isRunwaysVisible(),
          extensionsVisible:
            referenceVisibility.airportsVisible && runwayVisibility.isExtensionsVisible(),
        },
        referenceVisibility,
      );
    },
  });
  return () => {
    stopRender();
    stopWatch();
  };
}
