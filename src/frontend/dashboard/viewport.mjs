import { createViewportReporter } from "../report-viewport.mjs";

export function createDashboardViewport(scene, documentRef) {
  const send = createViewportReporter(scene, documentRef);
  return {
    send,
    observe(getSocket) {
      return scene.onViewChange?.(() => send(getSocket()));
    },
    destroy: send.destroy,
  };
}
