# RTL1090 background task

Use Windows Task Scheduler to run RTL1090 as a hidden task. RTL1090 is an application, not a Windows-managed process.

## Receiver setup

Enable SBS/BaseStation TCP output at endpoint `30003`. Install the USB driver for the receiver. Connect the receiver before you start the task.

RTL1090 may not send aircraft updates until its Table tab is active. Set that tab before you hide the app:

1. Start `rtl1090.exe` from its install folder.
2. Select the **Table** tab.
3. Close RTL1090 as usual to save the selected tab.
4. Start RTL1090 again and confirm the Table tab opens.
5. Check that endpoint `30003` receives aircraft data.

Repeat these steps after you install RTL1090 on a second computer.

## Create the task

Create a task named `RTL1090 ADS-B` in Task Scheduler. Complete these steps with administrator rights.

1. Select **Create Task**.
2. Set the task account to `SYSTEM`.
3. Select `Run whether user is logged on or not`.
4. Select **Run with highest privileges**.
5. Add an **At startup** trigger.
6. Add an action for `rtl1090.exe` in its install folder.
7. Set the arguments to `/run /min`.
8. Set **Start in** to the RTL1090 install folder.
9. Save and start the task.

Keep `rtl1090.exe`, `rtlsdr.dll`, and `libusb-1.0.dll` in the install folder. The account must have access to that folder. The hidden task does not show a window on the desktop.

## Start and stop both tasks

If you use the Radar desktop batch files, run `Start Radar Services.bat` to start RTL1090, then Radar Web. Run `Stop Radar Services.bat` to stop Radar Web, then RTL1090. The files disable startup triggers after each action.

## Check incoming data

Run this command in PowerShell to check the task:

```powershell
Get-ScheduledTask -TaskName 'RTL1090 ADS-B' | Select-Object TaskName,State
```

Run this command to check the TCP listener:

```powershell
Get-NetTCPConnection -State Listen -LocalPort 30003
```

A listener does not prove that aircraft updates appear. From the Radar repository, run `node bin/adsb.mjs --debug`. Confirm that JSON lines appear. Type `Ctrl+C` to end the CLI.

## Troubleshoot

- Check that the RTL1090 folder and DLL files exist.
- Check that the USB driver can see the receiver.
- Check that `rtl1090.ini` enables SBS/BaseStation output at endpoint `30003`.
- If no listener appears there, stop and start the RTL1090 task.
- If the endpoint listens but the CLI has no data, select the Table tab and close RTL1090 as usual.
- If the receiver is unavailable at startup, start the tasks again after you connect it.
- If the CLI continues to show no data, check the antenna and local aircraft traffic.
