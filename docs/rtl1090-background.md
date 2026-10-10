# RTL1090 background task procedure

## Purpose

Use this procedure to start RTL1090 at Windows startup as a hidden task. The current task runs as `SYSTEM`. Windows Task Scheduler owns the task. RTL1090 is not installed as a Windows service.

## Current setup

- Task name: `RTL1090 ADS-B`
- Trigger: At system startup
- Account: `SYSTEM`
- State: Running
- Program: `rtl1090.exe` in the installed RTL1090 folder
- Arguments: `/run /min`
- Start in: the installed RTL1090 folder
- Feed: SBS/BaseStation TCP on `127.0.0.1:30003`
- RTL1090 config: `rtl1090.ini` enables port `30003`.

The SDR dongle with serial `1090` serves RTL1090. Leave the other dongle for its separate application. Do not start another RTL1090 process that uses the same dongle.

## Requirements

- Keep the RTL1090 folder at its current path, or update the task action after you move it.
- Keep `rtl1090.exe`, `rtlsdr.dll`, and `libusb-1.0.dll` in that folder.
- Install the USB driver for the dongle with serial `1090`.
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

The task runs outside the logged-in desktop. Its minimized window does not appear on the desktop. Use Task Scheduler to control it.

## Start, stop, and check

Open an elevated PowerShell prompt. Run each command on its own line.

Start the task:

```powershell
schtasks /run /tn "\RTL1090 ADS-B"
```

Stop the task:

```powershell
schtasks /end /tn "\RTL1090 ADS-B"
```

Check task state and action:

```powershell
schtasks /query /tn "\RTL1090 ADS-B" /v /fo list
```

Read the **Task To Run** and **Start In** fields to see the registered folder and program paths.

Check the TCP listener:

```powershell
Get-NetTCPConnection -State Listen -LocalPort 30003
```

The task state must show `Running`. The TCP check must show a listener on port `30003`. A client can then read the feed from `127.0.0.1:30003`.

## Start Radar's Node.js client

From the Radar repository, run:

```powershell
node bin/adsb.mjs
```

The client prints one JSON line for each aircraft update. Press `Ctrl+C` to stop the client. This does not stop the RTL1090 task.

## Troubleshooting

- If the task stops, confirm the RTL1090 folder and its DLL files exist.
- If the task cannot open the receiver, confirm the USB driver and dongle serial.
- If port `30003` has no listener, check the task state and `rtl1090.ini`.
- If the task starts before the dongle is ready, start it again from Task Scheduler.
- If the TCP listener works but the client prints no aircraft, check antenna reception and aircraft traffic.
