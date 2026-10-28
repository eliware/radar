export function createWebSocketRetry({ setTimer, clearTimer, onRetry }) {
  let timer;
  let scheduled = false;
  let delay = 1000;
  let generation = 0;

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    const currentGeneration = ++generation;
    const currentDelay = delay;
    delay = Math.min(delay * 2, 30000);
    timer = setTimer(() => {
      if (currentGeneration !== generation) return;
      timer = undefined;
      scheduled = false;
      onRetry();
    }, currentDelay);
  }

  function cancel() {
    generation += 1;
    if (timer !== undefined) clearTimer(timer);
    timer = undefined;
    scheduled = false;
  }

  return {
    schedule,
    cancel,
    reset() {
      delay = 1000;
    },
    get pending() {
      return scheduled;
    },
  };
}
