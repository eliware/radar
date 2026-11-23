function createRadarRenderer({ THREE, windowRef }) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true });
  } catch {
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "low-power" });
    } catch (error) {
      throw new Error("WebGL context unavailable", { cause: error });
    }
  }
  renderer.setPixelRatio(Math.min(windowRef.devicePixelRatio || 1, 2));
  return renderer;
}
export default createRadarRenderer;
