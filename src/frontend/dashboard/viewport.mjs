import { default as createViewportReporter } from "../report-viewport.mjs";

function createDashboardViewport(scene, documentRef) {
  const send = createViewportReporter(scene, documentRef);
  return {
    send,
    observe(getSocket) {
      return scene.onViewChange?.(() => send(getSocket()));
    },
    destroy: send.destroy,
  };
}
export default createDashboardViewport;
