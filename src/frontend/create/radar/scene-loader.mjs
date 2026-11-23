async function loadAircraftScene(options) {
  const { default: createAircraftScene } = await import("../../aircraft/scene.mjs");
  return createAircraftScene(options);
}
export default loadAircraftScene;
