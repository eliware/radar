export function renderHome(document) {
  const status = document.querySelector("[data-status]");
  if (!status) return;
  status.textContent = "Radar client assets loaded.";
}
