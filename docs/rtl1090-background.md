# RTL1090 background task procedure

## Purpose

Use this procedure to run RTL1090 as a hidden Windows task. The task runs as `SYSTEM`. Windows Task Scheduler owns the task. RTL1090 is not a Windows service.

## Current setup

- Task name: `RTL1090 ADS-B`
- Trigger: At system startup.
- Account: `SYSTEM`
- Current host state: Disabled.
- Program: `rtl1090.exe` in the installed RTL1090 folder
- Arguments: `/run /min`
- Start in: the installed RTL1090 folder
- Feed: SBS/BaseStation TCP on `127.0.0.1:30003`
- RTL1090 config: `rtl1090.ini` enables port `30003`.

The SDR dongle with serial `1090` serves RTL1090. Leave the other dongle for its separate application. Do not start another RTL1090 process that uses the same dongle.

The Radar start batch starts RTL1090 before Radar Web. The stop batch stops Radar Web before RTL1090. Both batches keep their scheduled tasks disabled, so they do not start at reboot.

## Set the first-run view

Set the Table view before you run RTL1090 as a hidden task. RTL1090 may not send aircraft updates until the Table tab is active.

1. Start `rtl1090.exe` from the folder that the task uses.
2. Select the **Table** tab.
3. Close RTL1090 normally. This saves the Table view as the startup view.
4. Start RTL1090 again. Confirm that the Table tab opens.
5. Confirm that RTL1090 sends aircraft updates to port `30003`.

Use this one-time setup on each RTL1090 installation. The hidden task cannot show its window on the desktop.

## Requirements

- Keep the RTL1090 folder at its current path, or update the task action after you move it.
- Keep `rtl1090.exe`, `rtlsdr.dll`, and `libusb-1.0.dll` in that folder.
- Install the USB driver for the dongle with serial `1090`.
- Enable SBS/BaseStation TCP output on port `30003`.
- Open Task Scheduler with administrator rights to create or change the task.

## Create or repair the task

1. Open Task Scheduler with administrator rights.
2. Select **Create Task**.
3. Enter `RTL1090 ADS-B` as the task name.
4. Select **Run whether user is logged on or not**.
5. Set the task account to `SYSTEM`.
6. Select **Run with highest privileges**.
7. Add an **At startup** trigger.
8. Add an action that starts `rtl1090.exe` from the installed RTL1090 folder.
9. Set the action arguments to `/run /min`.
10. Set **Start in** to the RTL1090 folder.
11. Save the task.
12. Start the task from Task Scheduler.

The task runs outside the logged-in desktop. Its minimized window does not appear on the desktop. Save the Table view before you create or start this task.

## Start, stop, and check

Use the desktop batch files to start or stop both tasks in order.

Start both tasks:

```text
Start Radar Services.bat
```

This starts RTL1090 first, then Radar Web. The batch leaves both scheduled tasks disabled to prevent a reboot start.

Stop both tasks:

```text
Stop Radar Services.bat
```

This stops Radar Web first, then RTL1090. The batch keeps both scheduled tasks disabled.

Check the scheduled task:

```powershell
Get-ScheduledTask -TaskName 'RTL1090 ADS-B' | Select-Object TaskName,State
```

The batch starts each task, then disables its startup trigger. A disabled task can still have a running process. Check the TCP listener to confirm that RTL1090 runs.

Check the TCP listener:

```powershell
Get-NetTCPConnection -State Listen -LocalPort 30003
```

The TCP check must show a listener on port `30003`. A listener alone does not confirm aircraft updates. Use the Radar CLI to check the feed.

## Start Radar's Node.js client

From the Radar repository, run:

```powershell
node bin/adsb.mjs --debug
```

The client prints one JSON line for each aircraft update. Confirm that JSON lines appear. Press `Ctrl+C` to stop the client. This does not stop either task.

## Troubleshooting

- If the task stops, confirm the RTL1090 folder and its DLL files exist.
- If the task cannot open the receiver, confirm the USB driver and dongle serial.
- If port `30003` has no listener, check the task state and `rtl1090.ini`.
- If the port listens but the CLI prints no aircraft, open RTL1090 and select the Table tab. Close RTL1090 normally to save that view.
- If the dongle is not ready when RTL1090 starts, run `Start Radar Services.bat` again after the dongle is ready.
- If the Table view is active but the CLI prints no aircraft, check antenna reception and aircraft traffic.
