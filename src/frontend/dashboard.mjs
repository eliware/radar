export async function startDashboard({ document, fetchData, WebSocketClass, createScene }) {
  const status = document.querySelector("[data-status]");
  const container = document.querySelector("[data-scene]");
  if (!container) return null;
  try {
    const config = await readJson(fetchData, "/api/config");
    const scene = createScene({
      container,
      location: config.location,
      elevationFeet: config.elevationFeet,
    });
    const home = document.querySelector("[data-home]");
    home.textContent = config.location
      ? `${config.location.latitude.toFixed(4)}°, ${config.location.longitude.toFixed(4)}° · ${config.elevationFeet} ft MSL`
      : `Set MY_LOCATION in .env · ${config.elevationFeet} ft MSL`;
    const aircraft = await readJson(fetchData, "/api/aircraft");
    aircraft.forEach((item) => scene.update(item));
    const socket = new WebSocketClass(webSocketUrl(document.location));
    socket.onopen = () => {
      status.textContent = "Live feed connected.";
    };
    socket.onclose = () => {
      status.textContent = "Live feed disconnected.";
    };
    socket.onerror = () => {
      status.textContent = "Live feed error.";
    };
    socket.onmessage = (event) => updateScene(scene, event.data);
    const reset = document.querySelector("[data-reset]");
    reset?.addEventListener("click", () => scene.reset());
    status.textContent = `3D space ready. ${aircraft.length} aircraft tracked.`;
    return { scene, socket };
  } catch (error) {
    status.textContent = `Radar could not start: ${error.message}`;
    return null;
  }
}

async function readJson(fetchData, path) {
  const response = await fetchData(path);
  if (!response.ok) throw new Error(`Request failed: ${path}`);
  return response.json();
}

function webSocketUrl(location) {
  const protocol = location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${location.host}/ws`;
}

function updateScene(scene, data) {
  let aircraft;
  try {
    aircraft = JSON.parse(data);
  } catch {
    return;
  }
  scene.update(aircraft);
}
