import { attachRadarCompass } from "./attach-radar-compass.mjs";

const ACTIONS = new Map([
  ["zoom-in", (view) => view.zoom(0.8)],
  ["zoom-out", (view) => view.zoom(1.25)],
  ["rotate-left", (view) => view.rotate(1)],
  ["rotate-right", (view) => view.rotate(-1)],
  ["tilt-top", (view) => view.tilt(-1)],
  ["tilt-horizon", (view) => view.tilt(1)],
]);

export function attachRadarControls(documentRef, view) {
  const listeners = [];
  const detachCompass = attachRadarCompass(documentRef, view);
  for (const button of documentRef.querySelectorAll("[data-radar-control]")) {
    const action = ACTIONS.get(button.dataset.radarControl);
    if (!action) continue;
    button.disabled = button.dataset.radarControl.startsWith("tilt-") && !view.tilt;
    if (button.disabled) continue;
    const listener = () => action(view);
    button.addEventListener("click", listener);
    listeners.push([button, listener]);
  }
  return () => {
    for (const [button, listener] of listeners) button.removeEventListener("click", listener);
    detachCompass();
  };
}
