export function createCanvasRadarViewState(defaultRangeNm, defaultRotationRadians) {
  return {
    range: defaultRangeNm,
    defaultRangeNm,
    autoZoom: true,
    offsetX: 0,
    offsetY: 0,
    rotation: defaultRotationRadians,
    defaultRotationRadians,
    connected: false,
    ilsVisible: true,
    sidVisible: true,
    starVisible: true,
    airwayVisibility: { Q: true, J: true, V: true },
    runwaysVisible: true,
    extensionsVisible: true,
    baseLegsVisible: true,
    airportsVisible: true,
    navaidsVisible: true,
  };
}
