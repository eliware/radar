# Radar web background task

## Purpose

Run the Radar web app as a hidden Windows scheduled task.

## Current task

- Task name: `Radar Web`.
- Trigger: system startup.
- Account: `SYSTEM` with highest privileges.
- Program: Node.js with `bin/radar.mjs` as the argument.
- Start folder: the Radar repository root.
- Bind address: `0.0.0.0:3000`.
- LAN address: `http://<computer-wifi-ip>:3000`.
- Firewall access: TCP port `3000` from the local subnet.

The task reads `.env` from the repository root. The `SYSTEM` account needs read access to the repository and `.env`.

## Start and stop from the desktop

Run `Start Radar Services.bat` on the desktop. It starts RTL1090, then Radar Web.

Run `Stop Radar Services.bat` to stop Radar Web, then RTL1090. Both files disable the tasks after each action. This prevents startup at reboot.

## Start, stop, and check

Use the desktop files to start or stop both tasks. Check the task status through an elevated PowerShell session.

```powershell
Get-ScheduledTask -TaskName 'Radar Web' | Select-Object TaskName,State
```

Check the web health route:

```powershell
curl.exe http://127.0.0.1:3000/health
```

Run `ipconfig` to find the computer's Wi-Fi IPv4 address. Open `http://<computer-wifi-ip>:3000` on a phone on the same network.
