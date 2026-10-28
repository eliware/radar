import { startTableRefresh } from "./table-refresh.mjs";

export function installCliProcessLifecycle({
  cli,
  terminalOutput,
  stdout = process.stdout,
  processRef = process,
  setIntervalFn = setInterval,
  clearIntervalFn = clearInterval,
}) {
  let closed = false;
  const stopTableRefresh = cli.table
    ? startTableRefresh(() => cli.refresh(), setIntervalFn, clearIntervalFn)
    : () => {};
  const onResize = () => cli.refresh?.();
  const onExit = () => terminalOutput.restore();
  if (stdout.isTTY) stdout.on("resize", onResize);
  processRef.once("exit", onExit);

  const close = () => {
    if (closed) return;
    closed = true;
    stopTableRefresh();
    if (stdout.isTTY) stdout.off("resize", onResize);
    processRef.off("exit", onExit);
    processRef.off("SIGINT", close);
    processRef.off("SIGTERM", close);
    cli.close();
    terminalOutput.restore();
  };
  processRef.once("SIGINT", close);
  processRef.once("SIGTERM", close);
  return close;
}
