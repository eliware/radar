export function createReferenceVisibility(onChange = () => {}) {
  const state = { airportsVisible: true, navaidsVisible: true };
  function setVisible(layer, value) {
    if (!(layer in state)) return;
    state[layer] = Boolean(value);
    onChange({ ...state });
  }
  return {
    isAirportsVisible: () => state.airportsVisible,
    isNavaidsVisible: () => state.navaidsVisible,
    setVisible,
    setAirportsVisible: (value) => setVisible("airportsVisible", value),
    setNavaidsVisible: (value) => setVisible("navaidsVisible", value),
  };
}
