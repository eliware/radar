export function createAdsbLolRouteLookupControl() {
  let enabled = true;
  let generation = 0;
  return {
    isEnabled: () => enabled,
    generation: () => generation,
    isCurrent: (requestGeneration) => requestGeneration === generation && enabled,
    setEnabled(value) {
      const next = Boolean(value);
      if (next !== enabled) generation += 1;
      enabled = next;
    },
  };
}
