export function createAircraftSceneView({
  connection,
  workflow,
  layers,
  references,
  updateAirspace,
  viewport,
  orbit,
  radar,
  destroy,
}) {
  return {
    ...connection,
    update: workflow.update,
    updateRemote: workflow.updateRemote,
    updateSnapshot: workflow.updateSnapshot,
    isLocalOnly: layers.aircraft.isLocalOnly,
    ...references.updates(updateAirspace),
    setIlsVisible: layers.ils.setVisible,
    ...viewport,
    ...orbit,
    reset: radar.reset,
    destroy,
  };
}
