export function createRadarRenderer({ THREE, windowRef }) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true });
  } catch {
    renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "low-power" });
  }
  renderer.setPixelRatio(Math.min(windowRef.devicePixelRatio || 1, 2));
  return renderer;
}
