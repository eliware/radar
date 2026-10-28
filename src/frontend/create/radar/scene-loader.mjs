export async function loadAircraftScene(options) {
  const { createAircraftScene } = await import("../../aircraft/scene.mjs");
  return createAircraftScene(options);
}
